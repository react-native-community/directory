import { type NextApiRequest, type NextApiResponse } from 'next';

import { NEXT_10M_CACHE_HEADER } from '~/util/Constants';
import { parseQueryParams } from '~/util/queryParams';

const UNPKG_TIMEOUT_MS = 15_000;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name, version, path } = parseQueryParams(req.query);

  const packageName = name ? name.toString().toLowerCase().trim() : undefined;
  const packageVersion = version ? version.toString().toLowerCase().trim() : 'latest';
  const apiPath = path ? path.toString().trim() : undefined;

  res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=300');

  if (!packageName || !apiPath) {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 500;
    res.json({
      error: `Invalid request. You need to specify package name via 'name' query param and desired request 'path'.`,
    });
    return;
  }

  try {
    const result = await fetch(`https://unpkg.com/${packageName}@${packageVersion}/${apiPath}`, {
      ...NEXT_10M_CACHE_HEADER,
      redirect: 'manual',
      signal: AbortSignal.timeout(UNPKG_TIMEOUT_MS),
    });

    if (result.status === 302) {
      const location = result.headers.get('location');

      if (!location) {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 502;
        res.json({
          error: 'Invalid response. Unpkg returned a redirect without a location header.',
        });
        return;
      }

      const redirectResult = await fetch(new URL(location, 'https://unpkg.com').toString(), {
        ...NEXT_10M_CACHE_HEADER,
        signal: AbortSignal.timeout(UNPKG_TIMEOUT_MS),
      });

      if ('status' in redirectResult && redirectResult.status !== 200) {
        res.statusCode = redirectResult.status;
        res.json({});
        return;
      }

      res.setHeader('Content-Type', 'text/plain');
      res.statusCode = 200;
      res.write(await redirectResult.text());
      res.end();
      return;
    }

    if ('status' in result && result.status !== 200) {
      res.statusCode = result.status;
      res.json({});
      return;
    }

    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.write(await result.text());
    res.end();
  } catch (error) {
    if (error instanceof Error && error.name !== 'AbortError' && error.name !== 'TimeoutError') {
      throw error;
    }

    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 504;
    res.json({ error: `Request to unpkg timed out after ${UNPKG_TIMEOUT_MS / 1000}s.` });
  }
}

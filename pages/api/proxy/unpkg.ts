import { type NextApiRequest, type NextApiResponse } from 'next';

import { NEXT_10M_CACHE_HEADER } from '~/util/Constants';
import { parseQueryParams } from '~/util/queryParams';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name, path } = parseQueryParams(req.query);

  const packageName = name ? name.toString().toLowerCase().trim() : undefined;
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

  const result = await fetch(`https://unpkg.com/${packageName}/${apiPath}`, {
    ...NEXT_10M_CACHE_HEADER,
    redirect: 'manual',
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
  res.json(await result.json());
}

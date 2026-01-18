import { type NextApiRequest, type NextApiResponse } from 'next';

import { NEXT_10M_CACHE_HEADER } from '~/util/Constants';
import { parseQueryParams } from '~/util/parseQueryParams';
import { TimeRange } from '~/util/datetime';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name } = parseQueryParams(req.query);
  const packageName = name ? name.toString().toLowerCase().trim() : undefined;

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=300');

  if (!packageName) {
    res.statusCode = 500;
    return res.json({
      error: `Invalid request. You need to specify package name via 'name' query param.`,
    });
  }

  const now = Date.now();
  const until = new Date(now).toISOString().slice(0, 10);
  const from = new Date(now - TimeRange.MONTH * 1000).toISOString().slice(0, 10);

  const result = await fetch(
    `https://npm-stat.com/api/download-counts?package=${packageName}&from=${from}&until=${until}`,
    NEXT_10M_CACHE_HEADER
  );

  if ('status' in result && result.status !== 200) {
    res.statusCode = result.status;
    return res.json({});
  }

  res.statusCode = 200;
  return res.json(await result.json());
}

import { type NextApiRequest, type NextApiResponse } from 'next';

import { BASE_META, NEXT_1H_CACHE_HEADER } from '~/util/Constants';
import { parseQueryParams } from '~/util/parseQueryParams';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { title, description } = parseQueryParams(req.query);

  const ogTitle = title ? title.toString().trim() : BASE_META.title;
  const ogDescription = description ? description.toString().trim() : BASE_META.description;

  res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=300');

  const result = await fetch(
    `https://og.expo.dev/?theme=rnd&title=${encodeURIComponent(ogTitle)}&description=${encodeURIComponent(ogDescription)}`,
    NEXT_1H_CACHE_HEADER
  );

  if (!result.ok) {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 502;
    return res.json({ error: `Failed to fetch OG image.` });
  }

  const upstreamContentType = result.headers.get('content-type') ?? 'image/png';
  const upstreamContentLength = result.headers.get('content-length');

  if (upstreamContentLength) {
    res.setHeader('Content-Length', upstreamContentLength);
  }

  res.setHeader('Content-Type', upstreamContentType);
  res.statusCode = 200;

  const arrayBuffer = await result.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return res.send(buffer);
}

import { type NextApiRequest, type NextApiResponse } from 'next';

import { NEXT_10M_CACHE_HEADER } from '~/util/Constants';
import { trimPackageVersionsData } from '~/util/packageVersionsRegistryData';
import { parseQueryParams } from '~/util/queryParams';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.warn(req.query);
  const { name, versionsOnly } = parseQueryParams(req.query);
  const packageName = name ? name.toString().toLowerCase().trim() : undefined;
  const versionsOnlyFlag = versionsOnly
    ? Boolean(versionsOnly.toString().toLowerCase().trim())
    : false;

  res.setHeader('Content-Type', 'application/json');

  if (!packageName) {
    res.statusCode = 500;
    res.json({
      error: `Invalid request. You need to specify package name via 'name' query param.`,
    });
    return;
  }

  const result = await fetch(`https://registry.npmjs.org/${packageName}`, NEXT_10M_CACHE_HEADER);

  if ('status' in result && result.status !== 200) {
    res.statusCode = result.status;
    res.json({});
    return;
  }

  const versionsData = await result.json();

  res.statusCode = 200;
  res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=300');

  if (versionsOnlyFlag) {
    res.json({
      'dist-tags': versionsData['dist-tags'],
      versions: Object.keys(versionsData.versions).reverse(),
    });
  } else {
    res.json(trimPackageVersionsData(versionsData));
  }
}

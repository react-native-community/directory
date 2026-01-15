import { type NextApiRequest, type NextApiResponse } from 'next';

import data from '~/assets/data.json';
import { type DataAssetType } from '~/types';
import { parseQueryParams } from '~/util/parseQueryParams';

const DATASET = data as DataAssetType;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name, check } = parseQueryParams(req.query);

  const packageNames = name ? name.toString().toLowerCase().trim().split(',') : undefined;
  const checkOnly = Boolean(check);

  const libraries = DATASET.libraries.filter(library =>
    packageNames?.includes(library.npmPkg.toLowerCase())
  );

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=300');

  if (!packageNames) {
    res.statusCode = 500;
    return res.json({
      error: `Invalid request. You need to specify package names via 'name' query param.`,
    });
  }

  res.statusCode = 200;
  return res.json(
    Object.fromEntries(
      packageNames.map(name => [
        name,
        checkOnly
          ? libraries.filter(library => name === library.npmPkg).length >= 1
          : libraries.find(library => (name === library.npmPkg ? library : undefined)),
      ])
    )
  );
}

import { type NextApiRequest, type NextApiResponse } from 'next';

import data from '~/assets/data.json';
import { type DataAssetType, type LibraryType } from '~/types';
import { parseQueryParams } from '~/util/queryParams';

const DATASET = data as DataAssetType;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name, check } = parseQueryParams(req.query);

  const packageNames = name ? name.toString().toLowerCase().trim().split(',') : undefined;
  const libraries = DATASET.libraries.filter(library =>
    packageNames?.includes(library.npmPkg.toLowerCase())
  );

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=300');

  if (!packageNames) {
    res.statusCode = 500;
    res.json({
      error: `Invalid request. You need to specify package names via 'name' query param.`,
    });
    return;
  }

  res.statusCode = 200;
  res.json(
    Object.fromEntries(packageNames.map(name => [name, handleCheck(libraries, name, check)]))
  );
}

function handleCheck(libraries: LibraryType[], name: string, check?: string) {
  switch (check) {
    case 'version':
      const lib = libraries.find(library => (name === library.npmPkg ? library : undefined));
      return lib ? (lib.npm?.latestRelease ?? 'unknown') : undefined;
    case 'true':
      return libraries.some(library => name === library.npmPkg);
    default:
      return libraries.find(library => (name === library.npmPkg ? library : undefined));
  }
}

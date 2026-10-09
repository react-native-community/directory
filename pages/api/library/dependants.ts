import { type NextApiRequest, type NextApiResponse } from 'next';

import data from '~/assets/data.json';
import dependants from '~/assets/dependants.json';
import { type DataAssetType, type DependantsDataType, type LibraryType } from '~/types';
import { DEFAULT_RESPONSE_CACHE_HEADER } from '~/util/Constants';

const LIBRARIES = (data as DataAssetType).libraries;
const LIBRARIES_BY_NAME = new Map(
  LIBRARIES.map(library => [library.npmPkg.toLowerCase(), library])
);
const DEPENDANTS = dependants as DependantsDataType;
const DEFAULT_LIMIT = 6;
const MAX_LIMIT = 100;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const nameParam = req.query.name;
  const packageName = (Array.isArray(nameParam) ? nameParam[0] : nameParam)?.toLowerCase().trim();

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', DEFAULT_RESPONSE_CACHE_HEADER);

  if (!packageName) {
    res.statusCode = 400;
    res.json({ error: "Invalid request. Specify the package name via the 'name' query param." });
    return;
  }

  const limitParam = req.query.limit;
  const parsedLimit = Number.parseInt(
    (Array.isArray(limitParam) ? limitParam[0] : limitParam) ?? '',
    10
  );
  const limit = Number.isNaN(parsedLimit)
    ? DEFAULT_LIMIT
    : Math.max(0, Math.min(parsedLimit, MAX_LIMIT));
  const libraries = (DEPENDANTS[packageName] ?? [])
    .map(dependant => LIBRARIES_BY_NAME.get(dependant.toLowerCase()))
    .filter(
      (library): library is LibraryType => !!library && library.npmPkg.toLowerCase() !== packageName
    )
    .toSorted(compareLibraries);

  res.statusCode = 200;
  res.json({
    libraries: libraries.slice(0, limit),
    total: libraries.length,
  });
}

function compareLibraries(a: LibraryType, b: LibraryType) {
  const downloadDifference = (b.npm?.downloads ?? 0) - (a.npm?.downloads ?? 0);
  return downloadDifference || b.github.stats.stars - a.github.stats.stars;
}

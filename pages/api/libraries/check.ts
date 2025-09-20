import { type NextApiRequest, type NextApiResponse } from 'next';

import data from '~/assets/data.json';
import { type DataAssetType } from '~/types';
import { getNewArchSupportStatus, NewArchSupportStatus } from '~/util/newArchStatus';

type CheckResultsType = Record<
  string,
  {
    unmaintained?: boolean;
    newArchitecture: NewArchSupportStatus;
  }
>;

// Copy data into an object that is keyed by npm package name for faster lookup
const dataByNpmPackage: CheckResultsType = {};

(data as DataAssetType).libraries.forEach(library => {
  dataByNpmPackage[library.npmPkg] = {
    unmaintained: library.unmaintained,
    newArchitecture: getNewArchSupportStatus(library),
  };
});

// Provide library metadata for a list of npm packages
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/json');
  let packages: string[];

  if (typeof req.body === 'string') {
    packages = JSON.parse(req.body)?.packages;
  } else {
    packages = req.body.packages;
  }

  if (!packages || !Array.isArray(packages)) {
    res.statusCode = 500;
    return res.json({ error: 'packages must be an array' });
  }

  res.statusCode = 200;
  const result: CheckResultsType = {};
  packages.forEach(pkgName => {
    result[pkgName] = dataByNpmPackage[pkgName];
  });

  return res.json(result);
}

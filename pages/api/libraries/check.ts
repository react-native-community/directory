import { NextApiRequest, NextApiResponse } from 'next';

import data from '~/assets/data.json';
import { Library } from '~/types';
import { getNewArchSupportStatus } from '~/util/newArchStatus';

// Copy data into an object that is keyed by npm package name for faster lookup
const dataByNpmPackage = {};
data.libraries.forEach(library => {
  const npmPackageName = getNpmPackageName(library);
  dataByNpmPackage[npmPackageName] = {
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
  const result = {};
  packages.forEach(pkgName => {
    result[pkgName] = dataByNpmPackage[pkgName];
  });

  return res.json(result);
}

// if npmPkg, use that, otherwise use the last path segment on githubUrl
function getNpmPackageName(library: Library): string {
  return library.npmPkg ?? library.githubUrl.split('/').pop() ?? '';
}

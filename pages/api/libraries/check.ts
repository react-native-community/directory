import { type NextApiRequest, type NextApiResponse } from 'next';

import data from '~/assets/check-data.json';
import { type CheckResultsType } from '~/types';
import { DEFAULT_RESPONSE_CACHE_HEADER } from '~/util/Constants';

const DATASET = data as CheckResultsType;

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
    res.json({ error: 'packages must be an array' });
    return;
  }

  res.statusCode = 200;
  res.setHeader('Cache-Control', DEFAULT_RESPONSE_CACHE_HEADER);
  const result: CheckResultsType = {};
  packages.forEach(pkgName => {
    result[pkgName] = DATASET[pkgName];
  });

  res.json(result);
}

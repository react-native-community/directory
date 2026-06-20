import { type NextApiRequest, type NextApiResponse } from 'next';

import data from '~/assets/check-data.json';
import { type CheckResultsType } from '~/types';
import { DEFAULT_RESPONSE_CACHE_HEADER } from '~/util/Constants';

const DATASET = data as CheckResultsType;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/json');
  let packages: string[];

  if (req.method === 'GET') {
    const rawPackages = req.query.packages;
    if (!rawPackages) {
      packages = [];
    } else if (Array.isArray(rawPackages)) {
      packages = rawPackages;
    } else {
      packages = rawPackages
        .split(',')
        .map(p => p.trim())
        .filter(Boolean);
    }
  } else if (typeof req.body === 'string') {
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
  res.json(Object.fromEntries(packages.map(pkgName => [pkgName, DATASET[pkgName]])));
}

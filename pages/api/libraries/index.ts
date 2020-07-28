import drop from 'lodash/drop';
import take from 'lodash/take';
import Cors from 'micro-cors';
import { NextApiRequest, NextApiResponse } from 'next';

import { libraries } from '../../../assets/data.json';
import { NUM_PER_PAGE } from '../../../util/Constants';
import { handleFilterLibraries } from '../../../util/search';
import * as Sorting from '../../../util/sorting';

const originalData = [...libraries];
const SortedData = {
  updated: Sorting.updated([...originalData]),
  added: [...originalData.reverse()],
  recommended: Sorting.recommended([...originalData]),
  compatibility: Sorting.compatibility([...originalData]),
  quality: Sorting.quality([...originalData]),
  downloads: Sorting.downloads([...originalData]),
  issues: Sorting.issues([...originalData]),
  stars: Sorting.stars([...originalData]),
};
const SortingKeys = Object.keys(SortedData);

const getAllowedOrderString = (req: NextApiRequest) => {
  let sortBy = SortingKeys[0];

  SortingKeys.forEach(sortName => {
    if (req.query.order === sortName) {
      sortBy = sortName;
    }
  });

  return sortBy;
};

function handler(req: NextApiRequest, res: NextApiResponse) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');

  let sortBy = getAllowedOrderString(req);
  let libraries = SortedData[sortBy];
  let filteredLibraries = handleFilterLibraries({
    libraries,
    queryTopic: req.query.topic,
    querySearch: req.query.search,
    support: {
      ios: req.query.ios,
      android: req.query.android,
      web: req.query.web,
      windows: req.query.windows,
      macos: req.query.macos,
      expo: req.query.expo,
    },
    hasExample: req.query.hasExample,
    hasImage: req.query.hasImage,
    hasTypes: req.query.hasTypes,
    isMaintained: req.query.isMaintained,
    isPopular: req.query.isPopular,
    isRecommended: req.query.isRecommended,
    wasRecentlyUpdated: req.query.wasRecentlyUpdated,
  });

  let offset = req.query.offset ? parseInt(req.query.offset.toString(), 10) : 0;
  let limit = NUM_PER_PAGE; // UI doesn't yet support different limits req.query.limit || NUM_PER_PAGE,

  let filteredAndPaginatedLibraries = take(drop(filteredLibraries, offset), limit);
  return res.end(
    JSON.stringify({
      libraries: filteredAndPaginatedLibraries,
      total: filteredLibraries.length,
    })
  );
}

const cors = Cors({
  allowMethods: ['GET', 'HEAD'],
});

export default cors(handler);

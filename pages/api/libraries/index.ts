import drop from 'lodash/drop';
import take from 'lodash/take';
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
  popularity: Sorting.popularity([...originalData]),
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

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');

  const sortBy = getAllowedOrderString(req);
  const libraries = SortedData[sortBy];

  const querySearch = req.query.search
    ? req.query.search.toString().toLowerCase().trim()
    : undefined;

  const filteredLibraries = handleFilterLibraries({
    libraries,
    queryTopic: req.query.topic,
    querySearch,
    support: {
      ios: req.query.ios,
      android: req.query.android,
      web: req.query.web,
      windows: req.query.windows,
      macos: req.query.macos,
      expo: req.query.expo,
      tvos: req.query.tvos,
    },
    hasExample: req.query.hasExample,
    hasImage: req.query.hasImage,
    hasTypes: req.query.hasTypes,
    isMaintained: req.query.isMaintained,
    isPopular: req.query.isPopular,
    isRecommended: req.query.isRecommended,
    wasRecentlyUpdated: req.query.wasRecentlyUpdated,
    minPopularity: req.query.minPopularity,
  });

  const offset = req.query.offset ? parseInt(req.query.offset.toString(), 10) : 0;
  const limit = req.query.limit ? parseInt(req.query.limit.toString(), 10) : NUM_PER_PAGE;

  const relevanceSortedLibraries =
    querySearch?.length && (!req.query.order || req.query.order === 'relevance')
      ? Sorting.relevance([...filteredLibraries])
      : filteredLibraries;
  const filteredAndPaginatedLibraries = take(drop(relevanceSortedLibraries, offset), limit);

  return res.end(
    JSON.stringify({
      libraries: filteredAndPaginatedLibraries,
      total: filteredLibraries.length,
    })
  );
}

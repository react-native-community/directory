import drop from 'lodash/drop';
import take from 'lodash/take';
import { NextApiRequest, NextApiResponse } from 'next';

import data from '../../../assets/data.json';
import { Library } from '../../../types';
import { NUM_PER_PAGE } from '../../../util/Constants';
import { handleFilterLibraries } from '../../../util/search';
import * as Sorting from '../../../util/sorting';

const originalData = [...data.libraries] as Library[];
const getData = () => ({
  updated: Sorting.updated([...originalData]),
  added: [...originalData.reverse()],
  compatibility: Sorting.compatibility([...originalData]),
  quality: Sorting.quality([...originalData]),
  popularity: Sorting.popularity([...originalData]),
  downloads: Sorting.downloads([...originalData]),
  issues: Sorting.issues([...originalData]),
  stars: Sorting.stars([...originalData]),
  relevance: Sorting.relevance([...originalData]),
});

const SortedData = getData();
const SortingKeys = Object.keys(SortedData);

const ReversedSortedData = Object.entries(getData()).reduce(
  (accumulator = {}, data) => ({ ...accumulator, [data[0]]: data[1].reverse() }),
  {}
);

const getAllowedOrderString = (req: NextApiRequest, querySearch?: string) => {
  let sortBy = querySearch ? SortingKeys.at(-1) : SortingKeys[0];

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

  const querySearch = req.query.search
    ? req.query.search.toString().toLowerCase().trim()
    : undefined;

  const sortBy = getAllowedOrderString(req, querySearch);
  const sortDirection = req.query.direction ?? 'descending';
  const libraries = sortDirection === 'ascending' ? ReversedSortedData[sortBy] : SortedData[sortBy];

  const filteredLibraries = handleFilterLibraries({
    libraries,
    sortBy,
    queryTopic: req.query.topic,
    querySearch,
    support: {
      ios: req.query.ios,
      android: req.query.android,
      web: req.query.web,
      windows: req.query.windows,
      macos: req.query.macos,
      expoGo: req.query.expoGo,
      fireos: req.query.fireos,
      tvos: req.query.tvos,
      visionos: req.query.visionos,
    },
    hasExample: req.query.hasExample,
    hasImage: req.query.hasImage,
    hasTypes: req.query.hasTypes,
    isMaintained: req.query.isMaintained,
    isPopular: req.query.isPopular,
    isRecommended: req.query.isRecommended,
    wasRecentlyUpdated: req.query.wasRecentlyUpdated,
    minPopularity: req.query.minPopularity,
    minMonthlyDownloads: req.query.minMonthlyDownloads,
    newArchitecture: req.query.newArchitecture,
    skipLibs: req.query.skipLibs,
    skipTools: req.query.skipTools,
    skipTemplates: req.query.skipTemplates,
  });

  const offset = req.query.offset ? parseInt(req.query.offset.toString(), 10) : 0;
  const limit = req.query.limit ? parseInt(req.query.limit.toString(), 10) : NUM_PER_PAGE;

  const relevanceSortedLibraries =
    querySearch?.length && (!req.query.order || req.query.order === 'relevance')
      ? Sorting.relevance([...filteredLibraries])
      : filteredLibraries;
  const filteredAndPaginatedLibraries = take(drop(relevanceSortedLibraries, offset), limit);

  return res.json({
    libraries: filteredAndPaginatedLibraries,
    total: filteredLibraries.length,
  });
}

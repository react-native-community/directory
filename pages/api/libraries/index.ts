import drop from 'lodash/drop';
import take from 'lodash/take';
import { NextApiRequest, NextApiResponse } from 'next';

import data from '~/assets/data.json';
import { type LibraryType, QueryOrder } from '~/types';
import { NUM_PER_PAGE } from '~/util/Constants';
import { parseQueryParams } from '~/util/parseQueryParams';
import { handleFilterLibraries } from '~/util/search';
import * as Sorting from '~/util/sorting';

const originalData = [...data.libraries] as LibraryType[];
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

function getAllowedOrderString(req: NextApiRequest, querySearch?: string): QueryOrder {
  let sortBy = querySearch ? SortingKeys.at(-1) : SortingKeys[0];

  SortingKeys.forEach(sortName => {
    if (req.query.order === sortName) {
      sortBy = sortName;
    }
  });

  return sortBy as QueryOrder;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');

  const parsedQuery = parseQueryParams(req.query);

  const querySearch = parsedQuery.search
    ? parsedQuery.search.toString().toLowerCase().trim()
    : undefined;

  const sortBy = getAllowedOrderString(req, querySearch);
  const sortDirection = parsedQuery.direction ?? 'descending';
  const libraries = sortDirection === 'ascending' ? ReversedSortedData[sortBy] : SortedData[sortBy];

  const filteredLibraries = handleFilterLibraries({
    libraries,
    sortBy,
    queryTopic: parsedQuery.topic,
    querySearch,
    support: {
      ios: parsedQuery.ios,
      android: parsedQuery.android,
      web: parsedQuery.web,
      windows: parsedQuery.windows,
      macos: parsedQuery.macos,
      expoGo: parsedQuery.expoGo,
      fireos: parsedQuery.fireos,
      tvos: parsedQuery.tvos,
      visionos: parsedQuery.visionos,
    },
    hasExample: parsedQuery.hasExample,
    hasImage: parsedQuery.hasImage,
    hasTypes: parsedQuery.hasTypes,
    hasNativeCode: parsedQuery.hasNativeCode,
    isMaintained: parsedQuery.isMaintained,
    isPopular: parsedQuery.isPopular,
    isRecommended: parsedQuery.isRecommended,
    wasRecentlyUpdated: parsedQuery.wasRecentlyUpdated,
    minPopularity: parsedQuery.minPopularity,
    minMonthlyDownloads: parsedQuery.minMonthlyDownloads,
    newArchitecture: parsedQuery.newArchitecture,
    skipLibs: parsedQuery.skipLibs,
    skipTools: parsedQuery.skipTools,
    skipTemplates: parsedQuery.skipTemplates,
  });

  const offset = parsedQuery.offset ? parseInt(parsedQuery.offset.toString(), 10) : 0;
  const limit = parsedQuery.limit ? parseInt(parsedQuery.limit.toString(), 10) : NUM_PER_PAGE;

  const relevanceSortedLibraries =
    querySearch?.length && (!parsedQuery.order || parsedQuery.order === 'relevance')
      ? sortDirection === 'ascending'
        ? Sorting.relevance([...filteredLibraries]).reverse()
        : Sorting.relevance([...filteredLibraries])
      : filteredLibraries;
  const filteredAndPaginatedLibraries = take(drop(relevanceSortedLibraries, offset), limit);

  return res.json({
    libraries: filteredAndPaginatedLibraries,
    total: filteredLibraries.length,
  });
}

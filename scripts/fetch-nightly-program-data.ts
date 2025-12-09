import { makeGraphqlQuery } from '~/scripts/helpers';
import GitHubNightlyProgramQuery from '~/scripts/queries/GitHubNightlyProgramQuery';
import { type LibraryType } from '~/types';

export default async function fetchNightlyProgrammeData(list: LibraryType[]) {
  const result = await makeGraphqlQuery(GitHubNightlyProgramQuery);

  const nightlyData = JSON.parse(result.data.repository.librariesJson.text);
  const nightlyLibraries = Object.keys(nightlyData);

  list.map(library => {
    if (nightlyLibraries.includes(library.npmPkg)) {
      library.nightlyProgram = true;
      return library;
    }

    return library;
  });

  return list;
}

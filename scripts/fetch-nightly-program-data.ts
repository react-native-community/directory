import { makeGraphqlQuery } from '~/scripts/helpers';
import GitHubNightlyProgramQuery from '~/scripts/queries/GitHubNightlyProgramQuery';
import { type LibraryType, type NightlyProgramData } from '~/types';

export default async function fetchNightlyProgrammeData(list: LibraryType[]) {
  const result = await makeGraphqlQuery(GitHubNightlyProgramQuery);

  const nightlyData = JSON.parse(result.data.repository.librariesJson.text) as Record<
    string,
    NightlyProgramData
  >;

  const nightlyLibraries = [
    ...new Set([
      ...Object.keys(nightlyData),
      ...Object.values(nightlyData).flatMap(entry => entry.installCommand.split(' ')),
    ]),
  ];

  list.map(library => {
    if (nightlyLibraries.includes(library.npmPkg)) {
      library.nightlyProgram = true;
      return library;
    }

    return library;
  });

  return list;
}

import { View } from 'react-native';

import { A } from '~/common/styleguide';
import { Calendar } from '~/components/Icons';
import Tooltip from '~/components/Tooltip';
import { type LibraryType } from '~/types';
import { getTimeSinceToday } from '~/util/datetime';
import { parseGitHubUrl } from '~/util/parseGitHubUrl';
import tw from '~/util/tailwind';

type Props = {
  library: LibraryType;
};

export default function UpdatedAtView({ library }: Props) {
  const { branchName, packagePath } = parseGitHubUrl(library.githubUrl);
  const repoUrl = library.github.urls.repo;

  const tooltipContent = `
    Last update (based on Git activity)
    ${
      library.npm?.latestReleaseDate
        ? ` Last npm release: ${getTimeSinceToday(library.npm.latestReleaseDate)}`
        : ''
    }`;

  return (
    <Tooltip
      sideOffset={2}
      trigger={
        <View style={tw`flex-row items-start gap-2`} aria-label={tooltipContent} role="tooltip">
          <View>
            <Calendar
              style={
                library.unmaintained
                  ? tw`text-warning-dark dark:text-warning`
                  : tw`text-tertiary dark:text-pewter`
              }
              width={14}
              height={16}
            />
          </View>
          <A
            href={
              packagePath === '.'
                ? `${repoUrl}/commits`
                : `${repoUrl}/commits/${branchName}/${packagePath}`
            }
            style={[
              tw`text-[13px] font-light decoration-palette-gray3 dark:decoration-palette-gray5`,
              library.unmaintained ? tw`text-warning-dark dark:text-warning` : tw`text-secondary`,
            ]}
            hoverStyle={
              library.unmaintained
                ? tw`text-warning-dark decoration-warning-dark dark:text-warning dark:decoration-warning`
                : tw`text-hover decoration-palette-gray4`
            }>
            {getTimeSinceToday(library.github.stats.pushedAt)}
          </A>
        </View>
      }>
      {tooltipContent}
    </Tooltip>
  );
}

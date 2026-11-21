import { View } from 'react-native';

import { A } from '~/common/styleguide';
import { CalendarIcon } from '~/components/Icons';
import { Tooltip } from '~/components/Tooltip';
import { type LibraryType } from '~/types';
import { getTimeSinceToday } from '~/util/datetime';
import { parseGitHubUrl } from '~/util/parseGitHubUrl';
import { cx } from '~/util/tailwind';

type Props = {
  library: LibraryType;
};

export default function UpdatedAtView({ library }: Props) {
  const { branchName, packagePath } = parseGitHubUrl(library.githubUrl);
  const repoUrl = library.github.urls.repo;
  const unmaintainedClassName = library.unmaintained ? 'text-warning-dark dark:text-warning' : '';

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
        <View className="flex-row items-start gap-2" role="tooltip">
          <View>
            <CalendarIcon
              className={cx('h-4 w-3.5', unmaintainedClassName || 'text-tertiary dark:text-pewter')}
            />
          </View>
          <A
            href={
              packagePath === '.'
                ? `${repoUrl}/commits`
                : `${repoUrl}/commits/${branchName}/${packagePath}`
            }
            className={cx(
              'text-[13px] font-light decoration-palette-gray3 dark:decoration-palette-gray5',
              unmaintainedClassName || 'text-secondary'
            )}
            hoverStyle={
              library.unmaintained
                ? 'text-warning-dark decoration-warning-dark dark:text-warning dark:decoration-warning'
                : 'text-hover decoration-palette-gray4'
            }>
            {getTimeSinceToday(library.github.stats.pushedAt)}
          </A>
        </View>
      }>
      {tooltipContent}
    </Tooltip>
  );
}

import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { A, colors, darkColors } from '~/common/styleguide';
import Tooltip from '~/components/Tooltip';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';
import { type LibraryType } from '~/types';
import { getTimeSinceToday } from '~/util/datetime';
import { parseGitHubUrl } from '~/util/parseGitHubUrl';

import { Calendar } from '../Icons';

type Props = {
  library: LibraryType;
};

export default function UpdatedAtView({ library }: Props) {
  const { isDark } = useContext(CustomAppearanceContext);

  const iconColor = isDark ? darkColors.pewter : colors.secondary;
  const textColor = isDark ? darkColors.secondary : colors.gray5;
  const decorationColor = isDark ? colors.gray5 : colors.gray3;
  const unmaintainedIconColor = isDark ? darkColors.warning : colors.warningDark;
  const unmaintainedTextColor = isDark ? darkColors.warning : colors.warningDark;

  const { branchName, packagePath } = parseGitHubUrl(library.githubUrl);

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
        <View style={styles.updatedAtContainer} aria-label={tooltipContent} role="tooltip">
          <View>
            <Calendar
              fill={library.unmaintained ? unmaintainedIconColor : iconColor}
              width={14}
              height={16}
            />
          </View>
          <A
            href={
              packagePath === '.'
                ? `${library.github.urls.repo}/commits`
                : `${library.github.urls.repo}/commits/${branchName}/${packagePath}`
            }
            style={[
              styles.link,
              {
                color: library.unmaintained ? unmaintainedTextColor : textColor,
                textDecorationColor: decorationColor,
              },
            ]}
            hoverStyle={{
              color: library.unmaintained
                ? unmaintainedTextColor
                : isDark
                  ? colors.gray3
                  : colors.gray5,
              textDecorationColor: library.unmaintained ? unmaintainedTextColor : colors.gray4,
            }}>
            {getTimeSinceToday(library.github.stats.pushedAt)}
          </A>
        </View>
      }>
      {tooltipContent}
    </Tooltip>
  );
}

const styles = StyleSheet.create({
  updatedAtContainer: {
    gap: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  link: {
    fontSize: 13,
    fontWeight: 300,
    backgroundColor: 'transparent',
    textDecorationColor: 'transparent',
  },
});

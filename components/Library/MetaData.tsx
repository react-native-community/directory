import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, A, P, Caption, darkColors } from '../../common/styleguide';
import CustomAppearanceContext from '../../context/CustomAppearanceContext';
import { Library as LibraryType } from '../../types';
import { getTimeSinceToday } from '../../util/datetime';
import { Calendar, Star, Download, Issue, Web, License, Fork, Code } from '../Icons';
import { DirectoryScore } from './DirectoryScore';

type Props = {
  library: LibraryType;
  secondary?: boolean;
};

const generateData = (library, secondary, isDark) => {
  const { github } = library;

  if (secondary) {
    const secondaryTextColor = {
      color: isDark ? darkColors.secondary : colors.gray5,
    };
    const iconColor = isDark ? darkColors.pewter : colors.secondary;
    const paragraphStyles = [styles.secondaryText, secondaryTextColor];
    const linkStyles = [...paragraphStyles, styles.mutedLink];
    const hoverStyle = isDark ? { color: colors.primaryDark } : undefined;

    return [
      github.urls.homepage
        ? {
            id: 'web',
            icon: <Web fill={iconColor} width={16} height={16} />,
            content: (
              <A href={github.urls.homepage} style={linkStyles} hoverStyle={hoverStyle}>
                Website
              </A>
            ),
          }
        : null,
      github.license
        ? {
            id: 'license',
            icon: <License fill={iconColor} width={14} height={16} />,
            content:
              github.license.name === 'Other' ? (
                <P style={paragraphStyles}>Unrecognized License</P>
              ) : (
                <A
                  href={github.license.url}
                  style={linkStyles}
                  hoverStyle={isDark ? { color: colors.primaryDark } : undefined}>
                  {github.license.name}
                </A>
              ),
          }
        : null,
      library.examples && library.examples.length
        ? {
            id: 'examples',
            icon: <Code fill={iconColor} width={16} height={16} />,
            content: (
              <>
                <Caption style={paragraphStyles}>Examples: </Caption>
                {library.examples.map((example, index) => (
                  <A
                    key={example}
                    href={example}
                    target="blank"
                    style={[...linkStyles, styles.exampleLink]}
                    hoverStyle={isDark ? { color: colors.primaryDark } : undefined}>
                    #{index + 1}
                  </A>
                ))}
              </>
            ),
          }
        : null,
    ];
  } else {
    return [
      {
        id: 'score',
        icon: <DirectoryScore score={library.score} />,
        content: (
          <A
            target=""
            href="/directory-score"
            style={styles.mutedLink}
            hoverStyle={isDark ? { color: colors.primaryDark } : undefined}>
            Directory Score
          </A>
        ),
      },
      {
        id: 'calendar',
        icon: <Calendar fill={colors.gray5} />,
        content: `Updated ${getTimeSinceToday(github.stats.pushedAt)}`,
      },
      library.npm.downloads
        ? {
            id: 'downloads',
            icon: <Download fill={colors.gray5} />,
            content: (
              <A href={`https://www.npmjs.com/package/${library.npmPkg}`}>
                {`${library.npm.downloads.toLocaleString()}`} {library.npm.period}ly downloads
              </A>
            ),
          }
        : null,
      {
        id: 'star',
        icon: <Star fill={colors.gray5} />,
        content: `${github.stats.stars.toLocaleString()} stars`,
      },
      github.stats.forks
        ? {
            id: 'forks',
            icon: <Fork fill={colors.gray5} width={16} height={17} />,
            content: (
              <A href={`${github.urls.repo}/network/members`}>
                {`${github.stats.forks.toLocaleString()}`} forks
              </A>
            ),
          }
        : null,
      github.stats.issues
        ? {
            id: 'issues',
            icon: <Issue fill={colors.gray5} />,
            content: (
              <A href={`${github.urls.repo}/issues`}>
                {`${github.stats.issues.toLocaleString()}`} issues
              </A>
            ),
          }
        : null,
    ];
  }
};

export function MetaData(props: Props) {
  const { library, secondary } = props;

  return (
    <CustomAppearanceContext.Consumer>
      {context => {
        const data = generateData(library, secondary, context.isDark);
        return (
          <>
            {data.filter(Boolean).map((datum, i) => (
              <View
                key={datum.id}
                style={[
                  styles.displayHorizontal,
                  i + 1 !== data.length ? styles.datumContainer : {},
                  secondary ? styles.secondaryContainer : {},
                ]}>
                <View
                  style={[styles.iconContainer, secondary ? styles.secondaryIconContainer : {}]}>
                  {datum.icon}
                </View>
                <Caption>{datum.content}</Caption>
              </View>
            ))}
          </>
        );
      }}
    </CustomAppearanceContext.Consumer>
  );
}

const styles = StyleSheet.create({
  datumContainer: {
    marginBottom: 8,
  },
  displayHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 8,
    width: 20,
    alignItems: 'center',
  },
  mutedLink: {
    backgroundColor: 'transparent',
  },
  secondaryText: {
    fontSize: 13,
  },
  secondaryContainer: {
    marginBottom: 0,
    marginRight: 16,
  },
  secondaryIconContainer: {
    marginRight: 6,
  },
  exampleLink: {
    marginLeft: 2,
    marginRight: 4,
  },
});

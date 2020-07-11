import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, A, P, Caption } from '../../common/styleguide';
import { Library as LibraryType } from '../../types';
import { getTimeSinceToday } from '../../util/datetime';
import { Calendar, Star, Download, Issue, Web, License, Fork, Code } from '../Icons';
import { DirectoryScore } from './DirectoryScore';

type Props = {
  library: LibraryType;
  secondary?: boolean;
};

export function MetaData(props: Props) {
  const { library, secondary } = props;
  const { github } = library;

  const data = secondary
    ? [
        github.urls.homepage
          ? {
              id: 'web',
              icon: <Web fill="#afb1af" width={16} height={16} />,
              content: (
                <A href={github.urls.homepage} style={[styles.mutedLink, styles.secondaryText]}>
                  Website
                </A>
              ),
            }
          : null,
        github.license
          ? {
              id: 'license',
              icon: <License fill="#afb1af" width={14} height={16} />,
              content:
                github.license.name === 'Other' ? (
                  <P style={styles.secondaryText}>Unrecognized License</P>
                ) : (
                  <A href={github.license.url} style={[styles.mutedLink, styles.secondaryText]}>
                    {github.license.name}
                  </A>
                ),
            }
          : null,
        library.examples && library.examples.length
          ? {
              id: 'examples',
              icon: <Code fill="#afb1af" width={16} height={16} />,
              content: (
                <>
                  <Caption style={styles.secondaryText}>Examples: </Caption>
                  {library.examples.map((example, index) => (
                    <A
                      key={example}
                      href={example}
                      target="blank"
                      style={[styles.mutedLink, styles.secondaryText, styles.exampleLink]}>
                      #{index + 1}
                    </A>
                  ))}
                </>
              ),
            }
          : null,
      ]
    : [
        {
          id: 'score',
          icon: <DirectoryScore score={library.score} />,
          content: (
            <A target="" href="/directory-score" style={styles.mutedLink}>
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
          <View style={[styles.iconContainer, secondary ? styles.secondaryIconContainer : {}]}>
            {datum.icon}
          </View>
          <Caption>{datum.content}</Caption>
        </View>
      ))}
    </>
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
    color: colors.gray5,
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

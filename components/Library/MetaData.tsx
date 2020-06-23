import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, A, Caption } from '../../common/styleguide';
import { Library as LibraryType } from '../../types';
import { getTimeSinceToday } from '../../util/datetime';
import { Calendar, Star, Download, Issue, Web } from '../Icons';
import { DirectoryScore } from './DirectoryScore';

type Props = {
  library: LibraryType;
};

export function MetaData(props: Props) {
  const { library } = props;

  const data = [
    {
      id: 'score',
      icon: <DirectoryScore score={library.score} />,
      content: (
        <A target="" href="/directory-score" style={styles.directoryScoreLink}>
          Directory Score
        </A>
      ),
    },
    {
      id: 'calendar',
      icon: <Calendar fill={colors.gray5} />,
      content: `Updated ${getTimeSinceToday(library.github.stats.pushedAt)}`,
    },
    {
      id: 'star',
      icon: <Star fill={colors.gray5} />,
      content: `${library.github.stats.stars.toLocaleString()} stars`,
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
    library.github.stats.issues
      ? {
          id: 'issues',
          icon: <Issue fill={colors.gray5} />,
          content: (
            <A href={`${library.github.urls.repo}/issues`}>
              {`${library.github.stats.issues.toLocaleString()}`} issues
            </A>
          ),
        }
      : null,
    library.github.urls.homepage
      ? {
          id: 'web',
          icon: <Web fill={colors.gray5} />,
          content: <A href={library.github.urls.homepage}>Visit Website</A>,
        }
      : null,
  ].filter(Boolean);

  return (
    <View>
      {data.map((datum, i) => (
        <View
          key={datum.id}
          style={[styles.displayHorizontal, i + 1 !== data.length ? styles.datumContainer : {}]}>
          <View style={styles.iconContainer}>{datum.icon}</View>
          <Caption>{datum.content}</Caption>
        </View>
      ))}
    </View>
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
  directoryScoreLink: {
    backgroundColor: 'transparent',
  },
});

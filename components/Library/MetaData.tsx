import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Library as LibraryType } from '../../types';
import { getTimeSinceToday } from '../../util/datetime';
import { colors, A, Caption } from '../../common/styleguide';
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
      content: 'Directory score',
    },
    {
      id: 'calendar',
      icon: <Calendar fill={colors.gray5} />,
      content: `Updated ${getTimeSinceToday(props.library.github.stats.pushedAt)}`,
    },
    {
      id: 'star',
      icon: <Star fill={colors.gray5} />,
      content: `${props.library.github.stats.stars} stars`,
    },
    library.npm.downloads
      ? {
          id: 'downloads',
          icon: <Download fill={colors.gray5} />,
          content: (
            <A href={`https://www.npmjs.com/package/${props.library.npmPkg}`}>
              {`${props.library.npm.downloads.toLocaleString()}`} {props.library.npm.period}ly
              downloads
            </A>
          ),
        }
      : null,
    library.github.stats.issues
      ? {
          id: 'issues',
          icon: <Issue fill={colors.gray5} />,
          content: (
            <A href={`${props.library.github.urls.repo}/issues`}>
              {`${props.library.github.stats.issues}`} issues
            </A>
          ),
        }
      : null,
    props.library.github.urls.homepage
      ? {
          id: 'web',
          icon: <Web fill={colors.gray5} />,
          content: <A href={props.library.github.urls.homepage}>Visit Website</A>,
        }
      : null,
  ];

  return (
    <View>
      {data.filter(Boolean).map(datum => (
        <View key={datum.id} style={[styles.displayHorizontal, styles.datumContainer]}>
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
});

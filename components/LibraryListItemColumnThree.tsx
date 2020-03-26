import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { getTimeSinceToday } from '../util/datetime';
import { colors, A } from '../common/styleguide';
import { Calendar, Star, Download, Issue, Web } from '../components/Icons';

const renderListItem = (data, index) => {
  const { IconComponent } = data;
  return (
    <View style={styles.item} key={`list-item-${index}`}>
      <View style={styles.iconContainer}>
        <IconComponent fill={colors.gray5} />
      </View>
      <Text style={styles.text}>{data.content}</Text>
    </View>
  );
};

export default function LibraryListItemColumnThree(props) {
  const items = [
    {
      IconComponent: Calendar,
      content: <Text>Updated {getTimeSinceToday(props.library.github.stats.pushedAt)}</Text>,
    },
    {
      IconComponent: Star,
      content: <Text>{props.library.github.stats.stars} stars</Text>,
    },
  ];

  if (props.library.npm.downloads) {
    items.push({
      IconComponent: Download,
      content: (
        <A href={`https://www.npmjs.com/package/${props.library.npmPkg}`}>
          {`${props.library.npm.downloads}`} downloads {props.library.npm.period}ly
        </A>
      ),
    });
  }

  if (props.library.github.stats.issues > 0) {
    items.push({
      IconComponent: Issue,
      content: (
        <A href={`${props.library.github.urls.repo}/issues`}>
          {`${props.library.github.stats.issues}`} issues
        </A>
      ),
    });
  }

  if (props.library.github.urls.homepage) {
    items.push({
      IconComponent: Web,
      content: <A href={props.library.github.urls.homepage}>Visit Website</A>,
    });
  }

  const elements = items.map(renderListItem);

  return <View style={{ flex: 0.333 }}>{elements}</View>;
}

let styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    marginTop: 2,
    marginBottom: 6,
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
  },
  iconContainer: {
    marginRight: 8,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

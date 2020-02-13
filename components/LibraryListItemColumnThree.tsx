import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import * as SVG from '../util/svg';
import { getTimeSinceToday } from '../util/datetime';
import ExternalLink from '../components/ExternalLink';
import LibraryListColumn from '../components/LibraryListColumn';

const renderListItem = (data, index) => {
  const { IconComponent } = data;
  return (
    <View style={styles.item} key={`list-item-${index}`}>
      <IconComponent style={styles.icon} />
      <Text style={styles.text}>{data.content}</Text>
    </View>
  );
};

export default function LibraryListItemColumnThree(props) {
  const items = [
    {
      IconComponent: SVG.Calendar,
      content: <Text>Updated {getTimeSinceToday(props.library.github.stats.pushedAt)}</Text>,
    },
    {
      IconComponent: SVG.Star,
      content: <Text>{props.library.github.stats.stars} stars</Text>,
    },
  ];

  if (props.library.npm.downloads) {
    items.push({
      IconComponent: SVG.Download,
      content: (
        <ExternalLink
          href={`https://www.npmjs.com/package/${props.library.npmPkg}`}
          style={styles.text}>
          {`${props.library.npm.downloads}`} downloads {props.library.npm.period}ly
        </ExternalLink>
      ),
    });
  }

  if (props.library.github.stats.issues > 0) {
    items.push({
      IconComponent: SVG.File,
      content: (
        <ExternalLink href={`${props.library.github.urls.repo}/issues`} style={styles.text}>
          {`${props.library.github.stats.issues}`} issues
        </ExternalLink>
      ),
    });
  }

  if (props.library.github.urls.homepage) {
    items.push({
      IconComponent: SVG.Website,
      content: (
        <ExternalLink href={props.library.github.urls.homepage} style={styles.text}>
          Visit Website
        </ExternalLink>
      ),
    });
  }

  const elements = items.map(renderListItem);

  return <LibraryListColumn>{elements}</LibraryListColumn>;
}

let styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    marginTop: 2,
    marginBottom: 6,
    alignItems: 'center',
  },
  text: {
    fontFamily: 'office-code',
    fontSize: 12,
  },
  icon: {
    marginRight: 8,
  },
});

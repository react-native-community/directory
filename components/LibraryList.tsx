import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import LibraryListEmptyState from './LibraryListEmptyState';
import LibraryListItem from './LibraryListItem';

export default function LibraryList({ libraries }) {
  let content: any;
  if (!libraries || !libraries.length) {
    content = <LibraryListEmptyState />;
  } else {
    content = libraries.map((item: any, index: number) => (
      <LibraryListItem
        key={`list-item-${index}-${item.github.name}`}
        library={item}
        isLastItem={index === libraries.length - 1}
      />
    ));
  }

  return <View style={styles.container}>{content}</View>;
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
});

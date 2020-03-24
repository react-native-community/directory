import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { useMediaQuery } from 'react-responsive';

import LibraryListItemColumnOne from './LibraryListItemColumnOne';
import LibraryListItemColumnThree from './LibraryListItemColumnThree';

export default function LibraryListItem({ library, isLastItem = false }) {
  const isLargeViewport = useMediaQuery({
    minWidth: 800,
  });

  return (
    <View
      style={[
        styles.item,
        isLastItem ? { borderBottomWidth: 0 } : null,
        {
          flexDirection: isLargeViewport ? 'row' : 'column',
          paddingBottom: isLargeViewport ? 20 : 0,
        },
      ]}>
      <LibraryListItemColumnOne library={library} />
      <LibraryListItemColumnThree library={library} />
    </View>
  );
}

let styles = StyleSheet.create({
  item: {
    flex: 1,
    paddingTop: 27,
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
  },
});

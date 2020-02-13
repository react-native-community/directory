import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { useMediaQuery } from 'react-responsive';

export default function LibraryListColumn({ isWide = false, children, style = null }) {
  const isSmallViewport = useMediaQuery({
    maxWidth: 800,
  });

  const columnStyles = [
    styles.column,
    isWide && styles.columnWide,
    isSmallViewport && { marginBottom: 16, paddingRight: 0 },
    style,
  ];

  return <View style={columnStyles}>{children}</View>;
}

const styles = StyleSheet.create({
  column: {
    flex: 1,
    paddingLeft: 5,
    paddingRight: 24,
  },
  columnWide: {
    flex: 2,
  },
});

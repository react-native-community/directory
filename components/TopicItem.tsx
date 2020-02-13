import * as React from 'react';
import { StyleSheet, Text } from 'react-native';

export default function TopicItem({ children }) {
  return <Text style={styles.item}>{children}</Text>;
}

let styles = StyleSheet.create({
  item: {
    fontFamily: 'office-code',
    fontSize: 12,
    lineHeight: 20,
    color: 'rgba(0, 0, 0, 0.75)',
  },
});

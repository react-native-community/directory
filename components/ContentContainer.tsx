import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

import { layout } from '../common/styleguide';

type Props = {
  children: ReactNode;
  style?: ViewStyle;
};

export default function ContentContainer(props: Props) {
  const { children, style } = props;
  return <View style={[styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    maxWidth: layout.maxWidth,
    margin: 'auto',
  },
});

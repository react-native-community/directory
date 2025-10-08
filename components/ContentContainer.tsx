import { type PropsWithChildren } from 'react';
import { View, type ViewProps, StyleSheet } from 'react-native';

import { layout } from '~/common/styleguide';

const ContentContainer = ({ children, style }: PropsWithChildren<ViewProps>) => (
  <View style={[styles.container, style]}>{children}</View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    maxWidth: layout.maxWidth,
    margin: 'auto',
  },
});

export default ContentContainer;

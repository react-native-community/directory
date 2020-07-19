import { A } from '@expo/html-elements';
import React, { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

import { colors, darkColors, P } from '../common/styleguide';
import CustomAppearanceContext from '../context/CustomAppearanceContext';

type Props = {
  children?: ReactNode;
  href?: string;
  onPress?: () => void;
  target?: string;
  style?: ViewStyle | ViewStyle[];
};

export function Button(props: Props) {
  const { children, href, onPress, style, target } = props;
  const isString = typeof children === 'string';

  return (
    <CustomAppearanceContext.Consumer>
      {context => (
        <A href={href} target={target}>
          <TouchableOpacity
            onPress={onPress}
            style={[
              styles.container,
              {
                backgroundColor: context.isDark ? darkColors.border : colors.white,
              },
              style,
            ]}>
            {isString ? <P>{children}</P> : children}
          </TouchableOpacity>
        </A>
      )}
    </CustomAppearanceContext.Consumer>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 34,
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

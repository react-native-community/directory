import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { colors, darkColors } from '../common/styleguide';
import CustomAppearanceContext from '../context/CustomAppearanceContext';
import { Check } from './Icons';

type Props = {
  style?: ViewStyle | ViewStyle[];
  value?: boolean;
  color?: string;
};

export function CheckBox(props: Props) {
  const { style, value, color } = props;

  return (
    <CustomAppearanceContext.Consumer>
      {context => (
        <View
          style={[
            styles.container,
            {
              borderColor: value ? color : context.isDark ? darkColors.border : colors.gray4,
              backgroundColor: value ? color : context.isDark ? darkColors.dark : colors.white,
            },
            style,
          ]}>
          {value ? (
            <Check
              width={14}
              height={10}
              fill={context.isDark ? darkColors.veryDark : colors.white}
            />
          ) : null}
        </View>
      )}
    </CustomAppearanceContext.Consumer>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 18,
    width: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: 2,
    marginRight: 8,
  },
});

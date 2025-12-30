import { useContext } from 'react';
import { type StyleProp, StyleSheet, type TextStyle } from 'react-native';

import { colors, darkColors, Label } from '~/common/styleguide';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';

type Props = {
  count: number;
  style?: StyleProp<TextStyle>;
};

export default function EntityCounter({ count, style }: Props) {
  const { isDark } = useContext(CustomAppearanceContext);
  return (
    <Label
      style={[
        styles.tabCounter,
        { backgroundColor: isDark ? darkColors.border : colors.gray2 },
        style,
      ]}>
      {count}
    </Label>
  );
}

const styles = StyleSheet.create({
  tabCounter: {
    color: 'inherit',
    marginTop: 3,
    fontSize: 11,
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
});

import { ReactElement, useContext } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { Check } from './Icons';
import { colors, darkColors, Label } from '../common/styleguide';
import CustomAppearanceContext from '../context/CustomAppearanceContext';

type Props = {
  label: string;
  tagStyle: ViewStyle;
  icon?: ReactElement;
};

export const Tag = ({
  label,
  tagStyle,
  icon = <Check width={12} height={8} fill={colors.gray5} />,
}: Props) => {
  const { isDark } = useContext(CustomAppearanceContext);
  return (
    <View key={label} style={[styles.tag, tagStyle]}>
      {icon}
      <Label
        style={[
          {
            color: isDark ? darkColors.secondary : colors.black,
          },
        ]}>
        {label}
      </Label>
    </View>
  );
};

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 4,
    userSelect: 'none',
    minHeight: 25.5,
    gap: 5,
  },
});

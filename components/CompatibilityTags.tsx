import { useContext } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

import { Check } from './Icons';
import { colors, darkColors, Label } from '../common/styleguide';
import CustomAppearanceContext from '../context/CustomAppearanceContext';
import { Library } from '../types';

type Props = {
  library: Library;
};

type TagProps = {
  label: string;
  tagStyle: ViewStyle;
  showCheck?: boolean;
};

const Tag = ({ label, tagStyle, showCheck = true }: TagProps) => {
  const { isDark } = useContext(CustomAppearanceContext);
  return (
    <View key={label} style={[styles.tag, tagStyle]}>
      {showCheck ? <Check width={12} height={8} fill={colors.gray5} /> : null}
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

export function CompatibilityTags({ library }: Props) {
  const { isDark } = useContext(CustomAppearanceContext);
  const platforms = [
    library.android ? 'Android' : null,
    library.expoGo ? 'Expo Go' : null,
    library.ios ? 'iOS' : null,
    library.macos ? 'macOS' : null,
    library.tvos ? 'tvOS' : null,
    library.visionos ? 'visionOS' : null,
    library.web ? 'Web' : null,
    library.windows ? 'Windows' : null,
  ]
    .map(platform => platform)
    .filter(Boolean);

  return (
    <View style={styles.container}>
      {library.dev ? (
        <Tag
          label="Development Tool"
          tagStyle={{
            backgroundColor: isDark ? '#2b1c48' : '#e3d8f8',
            borderColor: isDark ? '#482f72' : '#d3c2f2',
          }}
          showCheck={false}
        />
      ) : null}
      {library.template ? (
        <Tag
          label="Template"
          tagStyle={{
            backgroundColor: isDark ? '#173137' : '#d8f8f1',
            borderColor: isDark ? '#28555a' : '#b2ddce',
          }}
          showCheck={false}
        />
      ) : null}
      {platforms.map(platform => (
        <Tag
          label={platform}
          key={`${platform}-platform`}
          tagStyle={{
            backgroundColor: isDark ? darkColors.dark : colors.gray1,
            borderColor: isDark ? darkColors.border : colors.gray2,
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: -4,
    gap: 6,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 4,
    userSelect: 'none',
    gap: 4,
  },
});

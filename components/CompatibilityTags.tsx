import React, { useContext } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

import { colors, darkColors, Label } from '../common/styleguide';
import CustomAppearanceContext from '../context/CustomAppearanceContext';
import { Library } from '../types';
import { Check } from './Icons';

type Props = {
  library: Library;
};

type TagProps = {
  platform: string;
  tagStyle: ViewStyle;
  showCheck?: boolean;
};

const Tag = ({ platform, tagStyle, showCheck = true }: TagProps) => {
  const { isDark } = useContext(CustomAppearanceContext);
  return (
    <View key={platform} style={[styles.tag, tagStyle]}>
      {showCheck ? (
        <Check width={14} height={10} fill={isDark ? darkColors.secondary : undefined} />
      ) : null}
      <Label
        style={[
          styles.text,
          {
            color: isDark ? darkColors.secondary : colors.black,
          },
        ]}>
        {platform}
      </Label>
    </View>
  );
};

export function CompatibilityTags(props: Props) {
  const { isDark } = useContext(CustomAppearanceContext);
  const { library } = props;
  const platforms = [
    library.android ? 'Android' : null,
    library.expo && typeof library.expo !== 'string' ? 'Expo Go' : null,
    library.ios ? 'iOS' : null,
    library.macos ? 'macOS' : null,
    library.tvos ? 'tvOS' : null,
    library.web ? 'Web' : null,
    library.windows ? 'Windows' : null,
  ]
    .map(platform => platform)
    .filter(Boolean);

  return (
    <View style={styles.container}>
      {library.dev ? (
        <Tag
          platform="Development Tool"
          tagStyle={{
            backgroundColor: isDark ? '#2b1c48' : '#e3d8f8',
            borderColor: isDark ? '#482f72' : '#d3c2f2',
          }}
          showCheck={false}
        />
      ) : null}
      {platforms.map(platform => (
        <Tag
          platform={platform}
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
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    marginRight: 8,
    borderRadius: 2,
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginBottom: 4,
  },
  text: {
    marginLeft: 4,
  },
});

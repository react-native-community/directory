import React from 'react';
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

const Tag = ({ platform, tagStyle, showCheck = true }: TagProps) => (
  <CustomAppearanceContext.Consumer>
    {context => (
      <View key={platform} style={[styles.tag, tagStyle]}>
        {showCheck ? (
          <Check width={14} height={10} fill={context.isDark ? darkColors.secondary : undefined} />
        ) : null}
        <Label
          style={[
            styles.text,
            {
              color: context.isDark ? darkColors.secondary : colors.black,
            },
          ]}>
          {platform}
        </Label>
      </View>
    )}
  </CustomAppearanceContext.Consumer>
);

export function CompatibilityTags(props: Props) {
  const { library } = props;
  const platforms = [
    library.android ? 'Android' : null,
    library.expo && typeof library.expo !== 'string' ? 'Expo client' : null,
    library.ios ? 'iOS' : null,
    library.macos ? 'macOS' : null,
    library.web ? 'Web' : null,
    library.windows ? 'Windows' : null,
  ]
    .map(platform => platform)
    .filter(Boolean);

  return (
    <CustomAppearanceContext.Consumer>
      {context => (
        <View style={styles.container}>
          {library.dev ? (
            <Tag
              platform="Development Tool"
              tagStyle={{
                backgroundColor: context.isDark ? '#2b1c48' : '#e3d8f8',
                borderColor: context.isDark ? '#482f72' : '#d3c2f2',
              }}
              showCheck={false}
            />
          ) : null}
          {platforms.map(platform => (
            <Tag
              platform={platform}
              tagStyle={{
                backgroundColor: context.isDark ? darkColors.dark : colors.gray1,
                borderColor: context.isDark ? darkColors.border : colors.gray2,
              }}
            />
          ))}
        </View>
      )}
    </CustomAppearanceContext.Consumer>
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

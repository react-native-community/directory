import React from 'react';
import { View, StyleSheet } from 'react-native';

import { colors, darkColors, Label } from '../common/styleguide';
import CustomAppearanceContext from '../context/CustomAppearanceContext';
import { Library } from '../types';
import { Check } from './Icons';

type Props = {
  library: Library;
};

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
          {platforms.map(platform => (
            <View
              key={platform}
              style={[
                styles.tag,
                {
                  backgroundColor: context.isDark ? darkColors.dark : colors.gray1,
                  borderColor: context.isDark ? darkColors.border : colors.gray2,
                },
              ]}>
              <Check
                width={14}
                height={10}
                fill={context.isDark ? darkColors.secondary : undefined}
              />
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

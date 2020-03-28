import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Library } from '../types';
import { colors, Label } from '../common/styleguide';
import { Check } from './Icons';

type Props = {
  library: Library;
};

export function CompatibilityTags(props: Props) {
  const { library } = props;
  const platforms = [
    library.ios ? 'iOS' : null,
    library.android ? 'Android' : null,
    library.web ? 'Web' : null,
    library.expo && typeof library.expo !== 'string' ? 'Expo client' : null,
  ]
    .map(platform => platform)
    .filter(Boolean);

  return (
    <View style={styles.container}>
      {platforms.map(platform => (
        <View key={platform} style={styles.tag}>
          <Check width={14} height={10} />
          <Label style={styles.text}>{platform}</Label>
        </View>
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
    backgroundColor: colors.gray1,
    borderWidth: 1,
    borderColor: colors.gray2,
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

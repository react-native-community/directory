import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { NewArchitectureTag } from './Library/NewArchitectureTag';
import { Tag } from './Tag';
import { colors, darkColors } from '../common/styleguide';
import CustomAppearanceContext from '../context/CustomAppearanceContext';
import { Library } from '../types';

type Props = {
  library: Library;
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
            backgroundColor: isDark ? '#261a3d' : '#ece3fc',
            borderColor: isDark ? '#3d2861' : '#d9c8fa',
          }}
          icon={null}
        />
      ) : null}
      {library.template ? (
        <Tag
          label="Template"
          tagStyle={{
            backgroundColor: isDark ? '#37172e' : '#fce1f5',
            borderColor: isDark ? '#52213e' : '#f5c6e8',
          }}
          icon={null}
        />
      ) : null}
      {!library.dev && !library.template && <NewArchitectureTag library={library} />}
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
});

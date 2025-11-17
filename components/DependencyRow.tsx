import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { A, colors, darkColors, Label } from '~/common/styleguide';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';

type Props = {
  name: string;
  version: string;
};

export default function DependencyRow({ name, version }: Props) {
  const { isDark } = useContext(CustomAppearanceContext);

  const headerColorStyle = {
    color: isDark ? darkColors.secondary : colors.gray5,
  };

  return (
    <View style={styles.dependencyEntry}>
      <A
        href={`https://www.npmjs.com/package/${name}`}
        target="_blank"
        containerStyle={{ flexShrink: 1 }}
        style={[styles.dependencyLabel, styles.mutedLink]}>
        {name}
      </A>
      <Label style={headerColorStyle}>
        {version.startsWith('http') ? (
          <A href={version} style={styles.mutedLink}>
            URL
          </A>
        ) : (
          version
        )}
      </Label>
    </View>
  );
}

const styles = StyleSheet.create({
  mutedLink: {
    fontWeight: 300,
    backgroundColor: 'transparent',
  },
  dependencyEntry: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
    fontFamily: 'monospace',
  },
  dependencyLabel: {
    fontSize: 12,
  },
});

import { type ReactNode, useContext } from 'react';
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
      <Label style={headerColorStyle}>{getVersionLabel(version)}</Label>
    </View>
  );
}

function getVersionLabel(version: string): ReactNode {
  if (version.startsWith('http')) {
    return (
      <A href={version} style={styles.mutedLink}>
        URL
      </A>
    );
  } else if (version.startsWith('patch:')) {
    const patchedVersion = extractPatchedVersion(version);
    if (patchedVersion) {
      return `${patchedVersion} (patched)`;
    }
    return 'patched';
  }
  return version;
}

function extractPatchedVersion(entry: string): string | null {
  const match = entry.match(/@npm%3A([^#]+)/);
  return match ? decodeURIComponent(match[1]) : null;
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

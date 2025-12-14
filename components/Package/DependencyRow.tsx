import { type ReactNode } from 'react';
import { View } from 'react-native';

import { A, Label } from '~/common/styleguide';
import tw from '~/util/tailwind';

type Props = {
  name: string;
  version: string;
};

export default function DependencyRow({ name, version }: Props) {
  const versionLabel = getVersionLabel(version);
  const hasLongVersion = typeof versionLabel === 'string' && versionLabel.length > 26;

  return (
    <View style={[tw`flex-row gap-x-2 justify-between font-mono`, hasLongVersion && tw`flex-wrap`]}>
      <A
        href={`https://www.npmjs.com/package/${name}`}
        target="_blank"
        containerStyle={tw`flex-shrink`}
        style={tw`text-xs leading-tight`}>
        {name}
      </A>
      <Label style={tw`text-xs leading-tight text-palette-gray5 dark:text-secondary`}>
        {getVersionLabel(version)}
      </Label>
    </View>
  );
}

function getVersionLabel(version: string): ReactNode {
  if (version.startsWith('http')) {
    return (
      <A href={version} style={tw`leading-tight`}>
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

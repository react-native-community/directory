import { type ReactNode } from 'react';
import { View } from 'react-native';

import { A, HoverEffect, Label, P, useLayout } from '~/common/styleguide';
import { Logo } from '~/components/Icons';
import Tooltip from '~/components/Tooltip';
import tw from '~/util/tailwind';

type Props = {
  name: string;
  version: string;
  packageExists?: boolean;
};

export default function DependencyRow({ name, version, packageExists }: Props) {
  const { isSmallScreen } = useLayout();
  const versionLabel = getVersionLabel(version);
  const hasLongVersion = typeof versionLabel === 'string' && versionLabel.length > 26;

  return (
    <View
      style={[
        tw`flex-row gap-x-2 justify-between`,
        hasLongVersion && tw`flex-wrap`,
        isSmallScreen && tw`my-px`,
      ]}>
      <span style={tw`flex flex-row gap-x-1.5 items-center flex-shrink pl-0.5 overflow-hidden`}>
        {packageExists ? (
          <Tooltip
            side="left"
            trigger={
              <View style={tw`relative z-10`}>
                <HoverEffect>
                  <A
                    href={`/package/${name}`}
                    style={tw`flex max-h-3 outline-offset-2`}
                    containerStyle={tw`flex-shrink`}>
                    <Logo style={tw`size-3 text-primary-darker`} />
                  </A>
                </HoverEffect>
              </View>
            }>
            Check package page in directory
          </Tooltip>
        ) : (
          <View style={tw`flex max-h-3`}>
            <P
              style={tw`w-3 text-lg leading-[12px] -mt-px text-center select-none text-palette-gray4 dark:text-palette-gray5`}>
              •
            </P>
          </View>
        )}
        <A
          href={`https://www.npmjs.com/package/${name}`}
          target="_blank"
          containerStyle={tw`flex-shrink`}
          style={tw`text-xs leading-[14px] font-mono font-light`}>
          {name}
        </A>
      </span>
      <Label
        style={[
          tw`text-xs leading-[14px] font-mono text-secondary`,
          hasLongVersion && tw`ml-auto`,
        ]}>
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

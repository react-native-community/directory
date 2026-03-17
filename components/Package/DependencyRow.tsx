import { type ReactNode } from 'react';
import { View } from 'react-native';
import semverClean from 'semver/functions/clean';
import semverDiff from 'semver/functions/diff';
import semverGt from 'semver/functions/gt';

import { A, HoverEffect, Label, P, useLayout } from '~/common/styleguide';
import { Info, Logo } from '~/components/Icons';
import Tooltip from '~/components/Tooltip';
import { type PeerDependencyData } from '~/types';
import tw from '~/util/tailwind';

type Props = {
  name: string;
  data: string | PeerDependencyData;
  packageVersion?: string;
};

export default function DependencyRow({ name, data, packageVersion }: Props) {
  const { isSmallScreen } = useLayout();
  const isDataString = typeof data === 'string';
  const versionLabel = getVersionLabel(isDataString ? data : data.version, packageVersion);
  const hasLongVersion = typeof versionLabel === 'string' && versionLabel.length > 18;

  return (
    <View
      style={[
        tw`flex-row justify-between gap-x-2`,
        hasLongVersion && tw`flex-wrap`,
        isSmallScreen && tw`my-px`,
      ]}>
      <span style={tw`flex flex-shrink flex-row items-center gap-x-1.5 overflow-hidden pl-0.5`}>
        {packageVersion ? (
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
              style={tw`-mt-px w-3 select-none text-center text-lg leading-[12px] text-palette-gray4 dark:text-palette-gray5`}>
              •
            </P>
          </View>
        )}
        <A
          href={`https://www.npmjs.com/package/${name}`}
          target="_blank"
          containerStyle={tw`flex-shrink`}
          style={tw`font-mono text-xs font-light leading-[14px]`}>
          {name}
        </A>
        {!isDataString && data.optional && (
          <Tooltip
            trigger={
              <View>
                <Info style={tw`-ml-0.5 -mt-px size-3 cursor-pointer text-icon`} />
              </View>
            }>
            Optional
          </Tooltip>
        )}
      </span>
      <Label
        style={[
          tw`font-mono flex-shrink-0 text-right text-xs leading-[14px] text-secondary`,
          hasLongVersion && tw`ml-auto flex-shrink`,
        ]}>
        {versionLabel}
      </Label>
    </View>
  );
}

function getVersionLabel(version: string, latestVersion?: string): ReactNode {
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

  if (latestVersion) {
    const cleanVersion = semverClean(version.replace(/^[~^]/, ''));

    if (!cleanVersion || semverGt(cleanVersion, latestVersion)) {
      return version;
    }

    const diff = semverDiff(cleanVersion, latestVersion);
    switch (diff) {
      case 'patch':
        return (
          <Tooltip
            sideOffset={-3}
            trigger={
              <span style={tw`cursor-pointer text-[#c99319] dark:text-[#dc9a00]`}>{version}</span>
            }>
            <Label style={tw`font-light text-white`}>
              Patch update available: <span style={tw`font-medium`}>{latestVersion}</span>
            </Label>
          </Tooltip>
        );
      case 'minor':
        return (
          <Tooltip
            sideOffset={-3}
            trigger={<span style={tw`cursor-pointer text-[#ff5900]`}>{version}</span>}>
            <Label style={tw`font-light text-white`}>
              Minor update available: <span style={tw`font-medium`}>{latestVersion}</span>
            </Label>
          </Tooltip>
        );
      case 'major':
        return (
          <Tooltip
            sideOffset={-3}
            trigger={
              <span style={tw`cursor-pointer text-[#e70a2f] dark:text-[#eb2d39]`}>{version}</span>
            }>
            <Label style={tw`font-light text-white`}>
              Major update available: <span style={tw`font-medium`}>{latestVersion}</span>
            </Label>
          </Tooltip>
        );
      default:
        return version;
    }
  } else {
    return version;
  }
}

function extractPatchedVersion(entry: string): string | null {
  const match = entry.match(/@npm%3A([^#]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

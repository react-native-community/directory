import { Fragment, type ReactNode } from 'react';
import { View } from 'react-native';
import semverClean from 'semver/functions/clean';
import semverDiff from 'semver/functions/diff';
import semverGt from 'semver/functions/gt';

import { A, HoverEffect, Label, P, useLayout } from '~/common/styleguide';
import { InfoIcon, Logo } from '~/components/Icons';
import { Tooltip } from '~/components/Tooltip';
import { type PeerDependencyData } from '~/types';
import { cx } from '~/util/tailwind';

type Props = {
  name: string;
  data: string | PeerDependencyData;
  packageVersion?: string | boolean;
};

export default function DependencyRow({ name, data, packageVersion }: Props) {
  const { isSmallScreen } = useLayout();

  const isDataString = typeof data === 'string';
  const versionString = isDataString ? data : data.version;
  const hasLongVersion = versionString.length > 18;
  const versionLabel = getVersionLabel(
    versionString,
    typeof packageVersion === 'string' ? packageVersion : undefined
  );

  return (
    <View
      className={cx(
        'flex-row justify-between gap-x-2',
        cx(hasLongVersion && 'flex-wrap'),
        cx(isSmallScreen && 'my-px')
      )}>
      <span className="flex flex-shrink flex-row items-center gap-x-1.5 overflow-hidden pl-0.5">
        {packageVersion ? (
          <Tooltip
            side="left"
            trigger={
              <View className="relative z-10">
                <HoverEffect>
                  <A
                    href={`/package/${name}`}
                    className="flex max-h-3 outline-offset-2"
                    containerClassName="flex-shrink">
                    <Logo className="text-primary-darker size-3" />
                  </A>
                </HoverEffect>
              </View>
            }>
            Check package page in directory
          </Tooltip>
        ) : (
          <View className="flex max-h-3">
            <P className="text-palette-gray4 dark:text-palette-gray5 -mt-px w-3 text-center text-lg leading-[12px] select-none">
              •
            </P>
          </View>
        )}
        <A
          href={`https://www.npmjs.com/package/${name}`}
          target="_blank"
          containerClassName="flex-shrink"
          className="font-mono text-xs leading-[14px] font-light">
          {name}
        </A>
        {!isDataString && data.optional && (
          <Tooltip
            trigger={
              <View>
                <InfoIcon className="text-icon -ml-0.5 size-3 cursor-pointer" />
              </View>
            }>
            Optional
          </Tooltip>
        )}
      </span>
      <Label
        className={cx(
          'font-mono max-w-[93%] flex-shrink-0 text-right text-xs leading-[14px] text-secondary',
          cx(hasLongVersion && 'ml-auto flex-shrink')
        )}>
        {versionLabel}
      </Label>
    </View>
  );
}

function getVersionLabel(version: string, latestVersion?: string): ReactNode {
  if (version.startsWith('http')) {
    return (
      <A href={version} className="leading-tight">
        URL
      </A>
    );
  } else if (version.startsWith('patch:')) {
    const patchedVersion = extractPatchedVersion(version);
    if (patchedVersion) {
      return `${patchedVersion} (patched)`;
    }
    return 'patched';
  } else if (version.includes('||')) {
    const versionChunks = version.split(' || ');
    return versionChunks.map((v, index) => (
      <Fragment key={`v-${v}`}>
        {v}
        {index !== versionChunks.length - 1 && <span className="text-tertiary">{` || `}</span>}
      </Fragment>
    ));
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
              <span className="cursor-pointer text-[#c99319] dark:text-[#dc9a00]">{version}</span>
            }>
            <Label className="font-light text-white">
              Patch update available: <span className="font-medium">{latestVersion}</span>
            </Label>
          </Tooltip>
        );
      case 'minor':
        return (
          <Tooltip
            sideOffset={-3}
            trigger={<span className="cursor-pointer text-[#ff5900]">{version}</span>}>
            <Label className="font-light text-white">
              Minor update available: <span className="font-medium">{latestVersion}</span>
            </Label>
          </Tooltip>
        );
      case 'major':
        return (
          <Tooltip
            sideOffset={-3}
            trigger={
              <span className="cursor-pointer text-[#e70a2f] dark:text-[#eb2d39]">{version}</span>
            }>
            <Label className="font-light text-white">
              Major update available: <span className="font-medium">{latestVersion}</span>
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

import SHA256 from 'crypto-js/sha256';
import { View } from 'react-native';

import { A, Caption, Label, useLayout } from '~/common/styleguide';
import { Button } from '~/components/Button';
import {
  CodeBlockIcon,
  DependencyIcon,
  DownloadIcon,
  PackageDownloadIcon,
  PackageSizeIcon,
} from '~/components/Icons';
import TrustedBadge from '~/components/Package/TrustedBadge';
import UserAvatar from '~/components/Package/UserAvatar';
import RelativeTime from '~/components/RelativeTime';
import { Tooltip } from '~/components/Tooltip';
import { type PackageVersionData } from '~/types';
import { formatBytes } from '~/util/formatBytes';
import { bigNumberFormatter, pluralize } from '~/util/strings';
import { cx } from '~/util/tailwind';

type Props = {
  label?: string;
  time: string;
  versionData: PackageVersionData;
  downloads?: number;
};

export default function VersionBox({ label, time, versionData, downloads = 0 }: Props) {
  const { isSmallScreen, isMobileScreen } = useLayout();

  const urlBase = `https://www.npmjs.com/package/${versionData.name}/v/${versionData.version}`;
  const publisherMetadata = versionData._npmUser?.url ?? versionData._npmUser?.email;

  return (
    <View
      className={cx(
        'flex-row items-center justify-between gap-0.5 rounded-xl border border-palette-gray2 px-4 pb-2.5 pt-2 dark:border-border',
        cx(isSmallScreen && 'flex-col items-start justify-start gap-x-2 gap-y-2.5')
      )}>
      <View>
        <View className="min-h-4 flex-row flex-wrap items-center gap-1">
          {label && <Caption className="tabular-nums">{label}</Caption>}
          {label && <Caption className="text-secondary opacity-60">{` • `}</Caption>}
          <Caption className={cx(label && 'tabular-nums text-secondary')}>
            {versionData.version}
          </Caption>
          <Caption className="text-secondary opacity-60">{` • `}</Caption>
          <Tooltip
            trigger={
              <View>
                <A
                  className="text-icon h-[17px]"
                  hoverStyle="text-palette-gray4 dark:text-secondary"
                  href={`/package/${versionData.name}/code?selectedVersion=${label ?? versionData.version}`}>
                  <CodeBlockIcon className="mt-px size-4" />
                </A>
              </View>
            }
            sideOffset={0}>
            <span className="text-[12px]">Open this version in code browser</span>
          </Tooltip>
        </View>
        <Label className="text-secondary flex min-h-4 flex-wrap items-center font-light">
          Released <RelativeTime time={time} dateOnly /> by
          {versionData._npmUser?.trustedPublisher && <TrustedBadge className="mx-1" />}
          {publisherMetadata && !versionData._npmUser?.trustedPublisher && (
            <UserAvatar
              src={`https://gravatar.com/avatar/${SHA256(publisherMetadata).toString()}?d=retro`}
              alt={`${versionData._npmUser?.name} avatar`}
              className="border-border relative top-px mx-1 size-3.5 border"
            />
          )}
          {versionData._npmUser?.name ?? 'Unknown'}
        </Label>
      </View>
      <View
        className={cx(
          'flex-row flex-wrap items-center gap-x-5 gap-y-1.5',
          cx(isSmallScreen && 'self-start')
        )}>
        <View className="shrink flex-row flex-wrap gap-x-5 gap-y-1.5">
          {versionData.dependencies && (
            <View
              className={cx(
                'flex-row items-center gap-2.5',
                cx(!isSmallScreen && 'min-w-[110px]')
              )}>
              <DependencyIcon className="text-palette-gray4 dark:text-pewter" />
              <View>
                <A className="font-light tabular-nums" href={`${urlBase}?activeTab=dependencies`}>
                  {Object.keys(versionData.dependencies).length}
                </A>
                <Label className="text-secondary font-light no-underline">
                  {pluralize('dependency', Object.keys(versionData.dependencies).length)}
                </Label>
              </View>
            </View>
          )}
          <View
            className={cx('flex-row items-center gap-2.5', cx(!isSmallScreen && 'min-w-[128px]'))}>
            <DownloadIcon className="text-palette-gray4 dark:text-pewter" />
            <View>
              <A className="font-light tabular-nums" href={`${urlBase}?activeTab=versions`}>
                {bigNumberFormatter(downloads)}
              </A>
              <Label className="text-secondary font-light">weekly downloads</Label>
            </View>
          </View>
          {versionData?.dist?.unpackedSize && (
            <View
              className={cx(
                'flex-row items-center gap-2.5',
                cx(!isSmallScreen && 'min-w-[100px]')
              )}>
              <PackageSizeIcon className="text-palette-gray4 dark:text-pewter" />
              <View>
                <A className="font-light tabular-nums" href={`${urlBase}?activeTab=code`}>
                  {formatBytes(versionData.dist.unpackedSize)}
                </A>
                <Label className="text-secondary font-light">package size</Label>
              </View>
            </View>
          )}
        </View>
        {versionData.dist?.tarball && !isMobileScreen && (
          <Tooltip
            sideOffset={0}
            trigger={
              <Button
                className="bg-transparent"
                containerClassName="h-5"
                href={versionData.dist.tarball}
                aria-label={`Download ${versionData.version} tarball`}>
                <PackageDownloadIcon className="text-palette-gray4 dark:text-pewter" />
              </Button>
            }>
            Download tarball
          </Tooltip>
        )}
      </View>
    </View>
  );
}

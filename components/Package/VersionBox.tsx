import SHA256 from 'crypto-js/sha256';
import { View } from 'react-native';

import { A, Caption, Label, useLayout } from '~/common/styleguide';
import { DependencyIcon, DownloadIcon, PackageSizeIcon } from '~/components/Icons';
import TrustedBadge from '~/components/Package/TrustedBadge';
import UserAvatar from '~/components/Package/UserAvatar';
import RelativeTime from '~/components/RelativeTime';
import { type NpmRegistryVersionData } from '~/types';
import { formatBytes } from '~/util/formatBytes';
import { formatNumberToString, pluralize } from '~/util/strings';
import tw from '~/util/tailwind';

type Props = {
  label?: string;
  time: string;
  versionData: NpmRegistryVersionData;
  downloads?: number;
};

export default function VersionBox({ label, time, versionData, downloads = 0 }: Props) {
  const { isSmallScreen } = useLayout();

  const urlBase = `https://www.npmjs.com/package/${versionData.name}/v/${versionData.version}`;
  const publisherMetadata = versionData._npmUser?.url ?? versionData._npmUser?.email;

  return (
    <View
      style={[
        tw`flex-row items-center justify-between gap-0.5 rounded-xl border border-palette-gray2 px-4 pb-2.5 pt-2 dark:border-default`,
        isSmallScreen && tw`flex-col items-start justify-start gap-x-2 gap-y-2.5`,
      ]}>
      <View>
        <View style={tw`min-h-4 flex-row flex-wrap items-center gap-1`}>
          {label && <Caption style={tw`tabular-nums`}>{label}</Caption>}
          {label && <Caption style={tw`text-secondary`}>{` • `}</Caption>}
          <Caption style={label && tw`tabular-nums text-secondary`}>{versionData.version}</Caption>
        </View>
        <Label style={tw`flex min-h-4 flex-wrap items-center font-light text-secondary`}>
          Released <RelativeTime time={time} dateOnly /> by
          {versionData._npmUser?.trustedPublisher && <TrustedBadge style={tw`mx-1`} />}
          {publisherMetadata && !versionData._npmUser?.trustedPublisher && (
            <UserAvatar
              src={`https://gravatar.com/avatar/${SHA256(publisherMetadata).toString()}?d=retro`}
              alt={`${versionData._npmUser?.name} avatar`}
              style={tw`relative top-px mx-1 size-3.5 border border-default`}
            />
          )}
          {versionData._npmUser?.name ?? 'Unknown'}
        </Label>
      </View>
      <View style={tw`flex-row flex-wrap gap-x-5 gap-y-1.5`}>
        {versionData.dependencies && (
          <View style={[tw`flex-row items-center gap-2.5`, !isSmallScreen && tw`min-w-[110px]`]}>
            <DependencyIcon style={tw`text-icon`} />
            <View>
              <A style={tw`font-light`} href={`${urlBase}?activeTab=dependencies`}>
                {Object.keys(versionData.dependencies).length}
              </A>
              <Label style={tw`font-light text-secondary no-underline`}>
                {pluralize('dependency', Object.keys(versionData.dependencies).length)}
              </Label>
            </View>
          </View>
        )}
        <View style={[tw`flex-row items-center gap-2.5`, !isSmallScreen && tw`min-w-[128px]`]}>
          <DownloadIcon style={tw`text-icon`} />
          <View>
            <A style={tw`font-light`} href={`${urlBase}?activeTab=versions`}>
              {formatNumberToString(downloads)}
            </A>
            <Label style={tw`font-light text-secondary`}>weekly downloads</Label>
          </View>
        </View>
        {versionData.dist.unpackedSize && (
          <View style={[tw`flex-row items-center gap-2.5`, !isSmallScreen && tw`min-w-[100px]`]}>
            <PackageSizeIcon style={tw`text-icon`} />
            <View>
              <A style={tw`font-light`} href={`${urlBase}?activeTab=code`}>
                {formatBytes(versionData.dist.unpackedSize)}
              </A>
              <Label style={tw`font-light text-secondary`}>package size</Label>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

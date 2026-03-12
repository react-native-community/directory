import { View } from 'react-native';

import { A, Caption, Label, useLayout } from '~/common/styleguide';
import { Dependency, Download, PackageSize } from '~/components/Icons';
import TrustedBadge from '~/components/Package/TrustedBadge';
import { type NpmRegistryVersionData } from '~/types';
import { getTimeSinceToday } from '~/util/datetime';
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

  return (
    <View
      style={[
        tw`flex-row items-center justify-between gap-0.5 rounded-xl border border-palette-gray2 px-4 py-2.5 dark:border-default`,
        isSmallScreen && tw`flex-col items-start justify-start gap-2`,
      ]}>
      <View>
        <View style={tw`min-h-4 flex-row items-center gap-1`}>
          {label && <Caption style={tw`tabular-nums`}>{label}</Caption>}
          {label && <Caption style={tw`text-secondary`}>{` • `}</Caption>}
          <Caption style={label && tw`tabular-nums text-secondary`}>{versionData.version}</Caption>
        </View>
        <View style={tw`min-h-4 flex-row items-center gap-1`}>
          <Label style={tw`font-light text-secondary`}>
            Released {getTimeSinceToday(time)} by {versionData._npmUser?.name}
          </Label>
          {versionData._npmUser?.trustedPublisher && <TrustedBadge />}
        </View>
      </View>
      <View style={tw`flex-row flex-wrap gap-x-5 gap-y-1`}>
        {versionData.dependencies && (
          <View style={[tw`flex-row items-center gap-2.5`, !isSmallScreen && tw`min-w-[110px]`]}>
            <Dependency style={tw`text-icon`} />
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
          <Download style={tw`text-icon`} />
          <View>
            <A style={tw`font-light`} href={`${urlBase}?activeTab=versions`}>
              {formatNumberToString(downloads)}
            </A>
            <Label style={tw`font-light text-secondary`}>weekly downloads</Label>
          </View>
        </View>
        {versionData.dist.unpackedSize && (
          <View style={[tw`flex-row items-center gap-2.5`, !isSmallScreen && tw`min-w-[100px]`]}>
            <PackageSize style={tw`text-icon`} />
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

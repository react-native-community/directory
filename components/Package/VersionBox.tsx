import { View } from 'react-native';

import { A, Caption, Label, useLayout } from '~/common/styleguide';
import { Dependency, PackageSize } from '~/components/Icons';
import TrustedBadge from '~/components/Package/TrustedBadge';
import { type NpmRegistryVersionData } from '~/types';
import { getTimeSinceToday } from '~/util/datetime';
import { formatBytes } from '~/util/formatBytes';
import { pluralize } from '~/util/strings';
import tw from '~/util/tailwind';

type Props = {
  label?: string;
  time: string;
  versionData: NpmRegistryVersionData;
};

export default function VersionBox({ label, time, versionData }: Props) {
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
          {label && <Caption>{label}</Caption>}
          {label && <Caption style={tw`text-secondary`}>{` • `}</Caption>}
          <Caption style={label && tw`text-secondary`}>{versionData.version}</Caption>
        </View>
        <View style={tw`min-h-4 flex-row items-center gap-1`}>
          <Label style={tw`font-light text-secondary`}>
            Released {getTimeSinceToday(time)} by {versionData._npmUser?.name}
          </Label>
          {versionData._npmUser?.trustedPublisher && <TrustedBadge />}
        </View>
      </View>
      <View style={tw`flex-row flex-wrap gap-x-4 gap-y-1`}>
        {versionData.dependencies && (
          <View style={[tw`flex-row gap-2`, !isSmallScreen && tw`min-w-[150px]`]}>
            <Dependency style={tw`text-icon`} />
            <A style={tw`font-light`} href={`${urlBase}?activeTab=dependencies`}>
              {`${Object.keys(versionData.dependencies).length} ${pluralize('dependency', Object.keys(versionData.dependencies).length)}`}
            </A>
          </View>
        )}
        {versionData.dist.unpackedSize && (
          <View style={[tw`flex-row gap-2`, !isSmallScreen && tw`min-w-[180px]`]}>
            <PackageSize style={tw`text-icon`} />
            <A style={tw`font-light`} href={`${urlBase}?activeTab=code`}>
              {`${formatBytes(versionData.dist.unpackedSize)} package size`}
            </A>
          </View>
        )}
      </View>
    </View>
  );
}

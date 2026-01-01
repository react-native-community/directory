import { type ReactNode } from 'react';
import { View } from 'react-native';

import { A, HoverEffect, P, useLayout } from '~/common/styleguide';
import CompatibilityTags from '~/components/CompatibilityTags';
import { GitHub } from '~/components/Icons';
import LibraryDescription from '~/components/Library/LibraryDescription';
import UnmaintainedLabel from '~/components/Library/UnmaintainedLabel';
import TrustedBadge from '~/components/Package/TrustedBadge';
import UserAvatar from '~/components/Package/UserAvatar';
import Tooltip from '~/components/Tooltip';
import { type LibraryType, type NpmRegistryVersionData } from '~/types';
import tw from '~/util/tailwind';

type Props = {
  library: LibraryType;
  registryData?: NpmRegistryVersionData;
  rightSlot?: ReactNode;
};

export default function PackageHeader({ library, registryData, rightSlot }: Props) {
  const { isSmallScreen } = useLayout();

  const ghUsername = library.github.fullName.split('/')[0];

  return (
    <>
      {library.unmaintained && <UnmaintainedLabel block />}
      <View
        style={[
          tw`flex-row items-center justify-between min-h-[26px]`,
          isSmallScreen && tw`gap-y-2.5 items-start flex-col`,
        ]}>
        <View style={tw`flex-row flex-wrap items-center gap-x-2 gap-y-1`}>
          <Tooltip
            sideOffset={2}
            delayDuration={100}
            trigger={
              <UserAvatar
                src={`https://github.com/${ghUsername}.png`}
                style={tw`size-6 rounded-md border border-solid border-palette-gray2 dark:border-default`}
                alt={`${ghUsername} avatar`}
              />
            }>
            {ghUsername}
          </Tooltip>
          <P style={tw`text-xl leading-[26px] font-semibold -mt-0.5`}>{library.npmPkg}</P>
          {registryData && (
            <View style={tw`flex-row items-center gap-x-1`}>
              <P style={tw`text-palette-gray5 dark:text-secondary`}>{registryData.version}</P>
              {registryData._npmUser?.trustedPublisher && <TrustedBadge />}
            </View>
          )}
          <HoverEffect>
            <A href={library.githubUrl} style={tw`size-5`}>
              <GitHub
                width={20}
                height={20}
                style={tw`text-palette-gray5 dark:text-palette-gray4`}
              />
            </A>
          </HoverEffect>
        </View>
        {rightSlot}
      </View>
      <CompatibilityTags library={library} />
      <LibraryDescription github={library.github} />
    </>
  );
}

import { startCase } from 'es-toolkit/string';
import { type ReactNode } from 'react';
import { View } from 'react-native';

import { A, HoverEffect, P, useLayout } from '~/common/styleguide';
import BookmarkButton from '~/components/BookmarkButton';
import CompatibilityTags from '~/components/CompatibilityTags';
import { GitHubIcon } from '~/components/Icons';
import LibraryDescription from '~/components/Library/LibraryDescription';
import TrustedBadge from '~/components/Package/TrustedBadge';
import UserAvatar from '~/components/Package/UserAvatar';
import { Tooltip } from '~/components/Tooltip';
import { type LibraryType, type NpmRegistryVersionData } from '~/types';
import { getTimeSinceToday } from '~/util/datetime';
import { cx } from '~/util/tailwind';

type Props = {
  library: LibraryType;
  registryData?: NpmRegistryVersionData;
  rightSlot?: ReactNode;
  skipDescription?: boolean;
};

export default function PackageHeader({
  library,
  registryData,
  rightSlot,
  skipDescription,
}: Props) {
  const { isSmallScreen } = useLayout();

  const ghUsername = library.github.fullName.split('/')[0];
  const bookmarkId = library.npmPkg ?? library.github.fullName;

  return (
    <>
      <View
        className={cx(
          'min-h-[26px] flex-row items-center justify-between',
          cx(isSmallScreen && 'flex-col items-start gap-y-2.5')
        )}>
        <View className="flex-row flex-wrap items-center gap-x-2 gap-y-1">
          <Tooltip
            sideOffset={2}
            delayDuration={100}
            trigger={
              <UserAvatar
                src={`https://github.com/${ghUsername}.png`}
                className="border-palette-gray2 dark:border-border size-6 rounded-md border border-solid"
                alt={`${startCase(ghUsername)} avatar`}
              />
            }>
            {startCase(ghUsername)}
          </Tooltip>
          <P className="-mt-0.5 text-xl leading-[26px] font-semibold">{library.npmPkg}</P>
          {registryData && (
            <View className="flex-row items-center gap-x-1">
              {library.npm?.latestReleaseDate ? (
                <Tooltip
                  trigger={
                    <View>
                      <P className="text-secondary">{registryData.version}</P>
                    </View>
                  }
                  sideOffset={0}>
                  Released {getTimeSinceToday(library.npm.latestReleaseDate)}
                </Tooltip>
              ) : (
                <P className="text-secondary">{registryData.version}</P>
              )}
              {registryData._npmUser?.trustedPublisher && <TrustedBadge />}
            </View>
          )}
          <HoverEffect>
            <A href={library.githubUrl} className="size-5" aria-label="GitHub repository">
              <GitHubIcon className="text-palette-gray5 dark:text-palette-gray4 size-5" />
            </A>
          </HoverEffect>
          <BookmarkButton bookmarkId={bookmarkId} className="size-5" iconClassName="size-5" />
        </View>
        {rightSlot}
      </View>
      <CompatibilityTags library={library} />
      {!skipDescription && <LibraryDescription github={library.github} />}
    </>
  );
}

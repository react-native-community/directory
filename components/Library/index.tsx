import { Platform, View } from 'react-native';

import { A, HoverEffect, useLayout } from '~/common/styleguide';
import BookmarkButton from '~/components/BookmarkButton';
import CompatibilityTags from '~/components/CompatibilityTags';
import { GitHub } from '~/components/Icons';
import LibraryDescription from '~/components/Library/LibraryDescription';
import UpdatedAtView from '~/components/Library/UpdateAtView';
import Tooltip from '~/components/Tooltip';
import { type LibraryType } from '~/types';
import tw from '~/util/tailwind';

import MetaData from './MetaData';
import Thumbnail from './Thumbnail';
import TrendingMark from './TrendingMark';
import UnmaintainedLabel from './UnmaintainedLabel';

type Props = {
  library: LibraryType;
  skipMetadata?: boolean;
  skipSecondaryMetadata?: boolean;
  skipDate?: boolean;
  showTrendingMark?: boolean;
};

export default function Library({
  library,
  skipMetadata,
  skipDate,
  skipSecondaryMetadata,
  showTrendingMark,
}: Props) {
  const { github } = library;
  const { isSmallScreen, isBelowMaxWidth } = useLayout();

  const libName = library.npmPkg ?? github.name;
  const bookmarkId = library.npmPkg ?? library.github.fullName;

  const hasSecondaryMetadata =
    github.license ||
    github.urls.homepage ||
    github.newArchitecture ||
    library.newArchitecture ||
    (library.examples && library.examples.length);

  return (
    <View
      style={[
        tw`relative mb-4 flex-row overflow-hidden rounded-md border border-palette-gray2 dark:border-default`,
        isSmallScreen && tw`flex-col`,
        skipMetadata && tw`mx-[0.75%] min-h-[206px] w-[48.5%]`,
        skipMetadata && (isSmallScreen || isBelowMaxWidth) && tw`w-[98.5%] max-w-[98.5%]`,
        skipSecondaryMetadata && tw`min-h-0`,
        library.unmaintained && tw`opacity-85`,
      ]}>
      <BookmarkButton
        bookmarkId={bookmarkId}
        style={tw`absolute right-2.5 top-2.5 z-10 rounded border border-palette-gray2 p-1.5 dark:border-palette-gray6`}
      />
      <View
        style={[
          tw`flex-1 p-4 pb-3 pl-5`,
          showTrendingMark && tw`pt-3.5`,
          isSmallScreen && tw`px-3.5 pt-2.5`,
          showTrendingMark && isSmallScreen && tw`pb-2 pl-3.5 pr-4 pt-3.5`,
        ]}>
        {library.unmaintained && (
          <View
            style={
              isSmallScreen
                ? tw`mb-1.5 flex-col justify-start self-start`
                : tw`mb-1 flex-row items-start justify-between gap-6`
            }>
            <UnmaintainedLabel alternatives={library.alternatives} />
            {!skipDate && <UpdatedAtView library={library} />}
          </View>
        )}
        {showTrendingMark && library.popularity && (
          <View style={tw`mb-1 flex-row items-center justify-between gap-6 pr-8`}>
            <Tooltip sideOffset={8} trigger={<TrendingMark library={library} />}>
              Trending Score is based on the last week to last month download rate.
            </Tooltip>
            {!skipDate && !library.unmaintained && <UpdatedAtView library={library} />}
          </View>
        )}
        <View
          style={
            isSmallScreen
              ? tw`flex-col justify-start gap-2 self-start`
              : tw`flex-row items-start justify-between gap-6`
          }>
          <View style={tw`flex-row items-center gap-1.5`}>
            <A
              href={`/package/${library.npmPkg}`}
              style={tw`text-[19px] font-bold`}
              hoverStyle={tw`text-hover`}>
              {libName}
            </A>
            <HoverEffect>
              <A href={library.githubUrl} style={tw`size-5`} aria-label="GitHub repository">
                <GitHub
                  width={20}
                  height={20}
                  style={tw`text-palette-gray5 dark:text-palette-gray4`}
                />
              </A>
            </HoverEffect>
          </View>
          {!showTrendingMark && !skipDate && !library.unmaintained && (
            <UpdatedAtView library={library} />
          )}
        </View>
        <View style={tw`mt-3`}>
          <CompatibilityTags library={library} />
        </View>
        <View style={tw`mt-3`}>
          <LibraryDescription github={library.github} maxLines={skipMetadata ? 3 : undefined} />
        </View>
        {!skipMetadata && Platform.OS === 'web' && library.images && library.images.length > 0 && (
          <View style={tw`mt-2 flex-row flex-wrap items-center gap-x-0.5`}>
            {library.images.map((image, index) => (
              <Thumbnail key={`${image}-${index}`} url={image} />
            ))}
          </View>
        )}
        {!skipSecondaryMetadata && hasSecondaryMetadata ? (
          <View style={[tw`mt-auto w-full`, isSmallScreen && tw`relative mt-0 min-h-0`]}>
            <View style={[tw`mt-3 flex-row flex-wrap items-center gap-2.5 gap-y-0.5`]}>
              <MetaData library={library} secondary />
            </View>
          </View>
        ) : null}
      </View>
      {skipMetadata ? null : (
        <View
          style={[
            tw`flex-0.35 border-l border-palette-gray2 p-4 dark:border-default`,
            isSmallScreen && tw`border-l-0 border-t`,
          ]}>
          <MetaData library={library} />
        </View>
      )}
    </View>
  );
}

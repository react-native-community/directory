import { Platform, View } from 'react-native';

import { useLayout, A, HoverEffect } from '~/common/styleguide';
import { GitHub } from '~/components/Icons';
import LibraryDescription from '~/components/Library/LibraryDescription';
import UpdatedAtView from '~/components/Library/UpdateAtView';
import { type LibraryType } from '~/types';
import tw from '~/util/tailwind';

import MetaData from './MetaData';
import Thumbnail from './Thumbnail';
import TrendingMark from './TrendingMark';
import UnmaintainedLabel from './UnmaintainedLabel';
import CompatibilityTags from '../CompatibilityTags';
import Tooltip from '../Tooltip';

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
  const hasSecondaryMetadata =
    github.license ||
    github.urls.homepage ||
    github.newArchitecture ||
    library.newArchitecture ||
    (library.examples && library.examples.length);

  return (
    <View
      style={[
        tw`mb-4 border rounded-md flex-row overflow-hidden border-palette-gray2 dark:border-default`,
        isSmallScreen && tw`flex-col`,
        skipMetadata && tw`w-[48.5%] mx-[0.75%] min-h-[206px]`,
        skipMetadata && (isSmallScreen || isBelowMaxWidth) && tw`w-[98.5%] max-w-[98.5%]`,
        skipSecondaryMetadata && tw`min-h-0`,
        library.unmaintained && tw`opacity-85`,
      ]}>
      <View style={[tw`pb-3.5 flex-1 p-4 pl-5`, isSmallScreen && tw`pt-2.5 pb-3 px-3.5`]}>
        {library.unmaintained && (
          <View
            style={
              isSmallScreen
                ? tw`flex-col justify-start self-start mb-1.5`
                : tw`flex-row justify-between items-start gap-6 mb-1`
            }>
            <UnmaintainedLabel alternatives={library.alternatives} />
            {!skipDate && <UpdatedAtView library={library} />}
          </View>
        )}
        {showTrendingMark && library.popularity && (
          <View style={tw`flex-row justify-between items-center gap-6 mb-1`}>
            <Tooltip sideOffset={8} trigger={<TrendingMark library={library} />}>
              Trending Score is based on the last week to last month download rate.
            </Tooltip>
            {!skipDate && !library.unmaintained && <UpdatedAtView library={library} />}
          </View>
        )}
        <View
          style={
            isSmallScreen
              ? tw`flex-col gap-2 justify-start self-start`
              : tw`flex-row justify-between items-start gap-6`
          }>
          <View style={tw`flex-row items-center gap-1.5`}>
            <A
              href={`/package/${library.npmPkg}`}
              style={tw`font-bold text-[19px]`}
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
          <View style={tw`flex-row items-center gap-x-0.5 flex-wrap mt-2`}>
            {library.images.map((image, index) => (
              <Thumbnail key={`${image}-${index}`} url={image} />
            ))}
          </View>
        )}
        {hasSecondaryMetadata ? (
          <View style={[tw`w-full mt-auto`, isSmallScreen && tw`relative min-h-0 mt-0`]}>
            <View style={[tw`flex-row items-center mt-3 flex-wrap gap-2.5 gap-y-0.5`]}>
              <MetaData library={library} secondary />
            </View>
          </View>
        ) : null}
      </View>
      {skipMetadata ? null : (
        <View
          style={[
            tw`flex-0.35 p-4 border-l border-palette-gray2 dark:border-default`,
            isSmallScreen && tw`border-l-0 border-t`,
          ]}>
          <MetaData library={library} />
        </View>
      )}
    </View>
  );
}

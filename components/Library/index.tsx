import { Platform, View } from 'react-native';

import { A, HoverEffect, useLayout } from '~/common/styleguide';
import BookmarkButton from '~/components/BookmarkButton';
import CompatibilityTags from '~/components/CompatibilityTags';
import { GitHubIcon } from '~/components/Icons';
import LibraryDescription from '~/components/Library/LibraryDescription';
import UpdatedAtView from '~/components/Library/UpdatedAtView';
import { Tooltip } from '~/components/Tooltip';
import { type LibraryType } from '~/types';
import { cx } from '~/util/tailwind';

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

function Library({
  library,
  skipMetadata,
  skipDate,
  skipSecondaryMetadata,
  showTrendingMark,
}: Props) {
  const { github } = library;
  const { isSmallScreen, isBelowMaxWidth } = useLayout();

  const libName = library.npmPkg ?? github.fullName;

  const hasSecondaryMetadata =
    github.license ||
    github.urls.homepage ||
    github.newArchitecture ||
    library.newArchitecture ||
    library.examples?.length;

  return (
    <View
      className={cx(
        'relative mb-4 flex-row overflow-hidden rounded-md border border-palette-gray2 dark:border-border',
        cx(isSmallScreen && 'flex-col'),
        cx(skipMetadata && 'mx-[0.75%] min-h-[206px] w-[48.5%]'),
        cx(skipMetadata && (isSmallScreen || isBelowMaxWidth) && 'w-[98.5%] max-w-[98.5%]'),
        cx(skipSecondaryMetadata && 'min-h-0'),
        cx(library.unmaintained && 'opacity-85')
      )}>
      {!isSmallScreen && (
        <BookmarkButton
          bookmarkId={libName}
          className="border-palette-gray2 dark:border-palette-gray6 absolute top-2.5 right-2.5 z-10 rounded border p-1.5"
        />
      )}
      <View
        className={cx(
          'flex-1 p-4 pb-3 pl-5',
          cx(showTrendingMark && 'pt-3.5'),
          cx(isSmallScreen && 'px-3.5 pt-2.5'),
          cx(showTrendingMark && isSmallScreen && 'pb-2 pl-3.5 pr-4 pt-3.5')
        )}>
        {library.unmaintained && (
          <View
            className={cx(
              isSmallScreen
                ? 'mb-1.5 flex-col justify-start self-start'
                : 'mb-1 flex-row items-start justify-between gap-6'
            )}>
            <UnmaintainedLabel alternatives={library.alternatives} />
            {!skipDate && <UpdatedAtView library={library} />}
          </View>
        )}
        {showTrendingMark && library.popularity && (
          <View
            className={cx(
              'mb-0.5 flex-row items-center justify-between gap-6',
              cx(!isSmallScreen && skipMetadata && 'pr-8')
            )}>
            <Tooltip sideOffset={8} trigger={<TrendingMark library={library} />}>
              Trending Score is based on the last week to last month download rate.
            </Tooltip>
            {!skipDate && !library.unmaintained && <UpdatedAtView library={library} />}
          </View>
        )}
        <View
          className={cx(
            isSmallScreen
              ? 'w-full flex-col justify-start gap-2 self-start'
              : 'flex-row items-start justify-between gap-6'
          )}>
          <View className="flex-row items-center gap-1.5">
            <A
              href={`/package/${library.npmPkg}`}
              className="text-[19px] font-bold"
              hoverStyle="text-hover">
              {libName}
            </A>
            <HoverEffect>
              <A href={library.githubUrl} className="size-5" aria-label="GitHub repository">
                <GitHubIcon className="text-palette-gray5 dark:text-palette-gray4 size-5" />
              </A>
            </HoverEffect>
            {isSmallScreen && (
              <BookmarkButton
                bookmarkId={libName}
                className="border-palette-gray2 dark:border-palette-gray6 -mr-1 ml-auto size-7 items-center justify-center rounded border p-1"
              />
            )}
          </View>
          {!showTrendingMark && !skipDate && !library.unmaintained && (
            <UpdatedAtView library={library} />
          )}
        </View>
        <View className="mt-3">
          <CompatibilityTags library={library} />
        </View>
        <View className="mt-3">
          <LibraryDescription github={library.github} maxLines={skipMetadata ? 3 : undefined} />
        </View>
        {!skipMetadata && Platform.OS === 'web' && library.images && library.images.length > 0 && (
          <View className="mt-2 flex-row flex-wrap items-center gap-x-0.5">
            {library.images.map((image, i) => (
              <Thumbnail key={image} url={image} alt={`${library.npmPkg} screenshot ${i + 1}`} />
            ))}
          </View>
        )}
        {!skipSecondaryMetadata && hasSecondaryMetadata && (
          <View className={cx('mt-auto w-full', cx(isSmallScreen && 'relative mt-0 min-h-0'))}>
            <View className="mt-3 flex-row flex-wrap items-center gap-2.5 gap-y-0.5">
              <MetaData library={library} secondary />
            </View>
          </View>
        )}
      </View>
      {skipMetadata ? null : (
        <View
          className={cx(
            'flex-[0.35] border-l border-palette-gray2 p-4 dark:border-border',
            cx(isSmallScreen && 'border-l-0 border-t')
          )}>
          <MetaData library={library} />
        </View>
      )}
    </View>
  );
}

export default Library;

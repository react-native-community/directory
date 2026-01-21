import { type StyleProp, View, type ViewStyle } from 'react-native';

import FiltersSection from '~/components/Filters/FiltersSection';
import { Tag } from '~/components/Tag';
import { useBookmarks } from '~/context/BookmarksContext';
import { type Query } from '~/types';
import { getPageQuery } from '~/util/search';
import tw from '~/util/tailwind';

import {
  FILTER_BOOKMARKS,
  FILTER_COMPATIBILITY,
  FILTER_MODULE_TYPE,
  FILTER_PLATFORMS,
  FILTER_REQUIRES_MAIN_SEARCH,
  FILTER_STATUS,
  FILTER_TYPE,
} from './helpers';
import { ToggleLink } from './ToggleLink';

type FiltersProps = {
  query: Query;
  style?: StyleProp<ViewStyle>;
  basePath?: string;
};

export function Filters({ query, style, basePath = '/packages' }: FiltersProps) {
  const pageQuery = getPageQuery(basePath, query);
  const isMainSearch = basePath === '/packages';
  const { bookmarkedIds } = useBookmarks();
  const hasBookmarks = bookmarkedIds.size > 0;

  return (
    <View style={[tw`flex-1 items-center bg-palette-gray1 py-2 dark:bg-very-dark`, style]}>
      <View style={tw`w-full max-w-layout flex-row flex-wrap content-start`}>
        <FiltersSection title="Platform">
          {FILTER_PLATFORMS.map(platform => (
            <ToggleLink
              key={platform.param}
              query={pageQuery}
              filterParam={platform}
              basePath={basePath}
            />
          ))}
        </FiltersSection>
        <FiltersSection title="Type">
          {FILTER_TYPE.map(entryType => (
            <ToggleLink
              key={entryType.param}
              query={pageQuery}
              filterParam={entryType}
              basePath={basePath}
            />
          ))}
          {hasBookmarks && (
            <ToggleLink query={pageQuery} filterParam={FILTER_BOOKMARKS} basePath={basePath} />
          )}
        </FiltersSection>
      </View>
      <FiltersSection title="Status">
        {isMainSearch &&
          FILTER_REQUIRES_MAIN_SEARCH.map(status => (
            <ToggleLink
              key={status.param}
              query={pageQuery}
              filterParam={status}
              basePath={basePath}
            />
          ))}
        {FILTER_STATUS.map(status => (
          <ToggleLink
            key={status.param}
            query={pageQuery}
            filterParam={status}
            basePath={basePath}
          />
        ))}
      </FiltersSection>
      <View style={tw`w-full max-w-layout flex-row flex-wrap content-start`}>
        <FiltersSection title="Compatibility">
          {FILTER_COMPATIBILITY.map(compatibility => (
            <ToggleLink
              key={compatibility.param}
              query={pageQuery}
              filterParam={compatibility}
              basePath={basePath}
            />
          ))}
        </FiltersSection>
        <FiltersSection
          title="Module type"
          rightSlot={
            <Tag
              label="Experimental"
              tagStyle={tw`min-h-5.5 -top-px ml-2 border-[#d9c8fa] bg-[#ece3fc] py-0 dark:border-[#3d2861] dark:bg-[#261a3d]`}
              icon={null}
            />
          }>
          {FILTER_MODULE_TYPE.map(moduleType => (
            <ToggleLink
              key={moduleType.param}
              query={pageQuery}
              filterParam={moduleType}
              basePath={basePath}
            />
          ))}
        </FiltersSection>
      </View>
    </View>
  );
}

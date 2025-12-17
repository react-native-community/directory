import { type StyleProp, View, type ViewStyle } from 'react-native';

import FiltersSection from '~/components/Filters/FiltersSection';
import { Tag } from '~/components/Tag';
import { type Query } from '~/types';
import { getPageQuery } from '~/util/search';
import tw from '~/util/tailwind';

import { ToggleLink } from './ToggleLink';
import {
  FILTER_COMPATIBILITY,
  FILTER_PLATFORMS,
  FILTER_REQUIRES_MAIN_SEARCH,
  FILTER_STATUS,
  FILTER_MODULE_TYPE,
  FILTER_TYPE,
} from './helpers';

type FiltersProps = {
  query: Query;
  style?: StyleProp<ViewStyle>;
  basePath?: string;
};

export function Filters({ query, style, basePath = '/' }: FiltersProps) {
  const pageQuery = getPageQuery(basePath, query);
  const isMainSearch = basePath === '/';

  return (
    <View style={[tw`py-2 flex-1 items-center bg-palette-gray1 dark:bg-very-dark`, style]}>
      <View style={tw`w-full max-w-layout content-start flex-row flex-wrap`}>
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
      <View style={tw`w-full max-w-layout content-start flex-row flex-wrap`}>
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
              tagStyle={tw`ml-2 -top-px py-0 min-h-5.5 bg-[#ece3fc] border-[#d9c8fa] dark:bg-[#261a3d] dark:border-[#3d2861]`}
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

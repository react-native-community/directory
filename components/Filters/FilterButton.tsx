import { type StyleProp, View, type ViewStyle } from 'react-native';

import { P } from '~/common/styleguide';
import { Button } from '~/components/Button';
import { Filter as FilterIcon } from '~/components/Icons';
import { type Query } from '~/types';
import tw from '~/util/tailwind';

import { ClearButton } from './ClearButton';
import {
  FILTER_BOOKMARKS,
  FILTER_COMPATIBILITY,
  FILTER_MODULE_TYPE,
  FILTER_PLATFORMS,
  FILTER_REQUIRES_MAIN_SEARCH,
  FILTER_STATUS,
  FILTER_TYPE,
} from './helpers';

type Props = {
  query: Query;
  onPress: () => void;
  onClearAllPress: () => void;
  isFilterVisible: boolean;
  style?: StyleProp<ViewStyle>;
};

export function FilterButton({ isFilterVisible, query, onPress, onClearAllPress, style }: Props) {
  const params = [
    ...FILTER_PLATFORMS.map(platform => platform.param),
    ...FILTER_REQUIRES_MAIN_SEARCH.map(filter => filter.param),
    ...FILTER_STATUS.map(status => status.param),
    ...FILTER_COMPATIBILITY.map(compatibility => compatibility.param),
    ...FILTER_TYPE.map(entryType => entryType.param),
    ...FILTER_MODULE_TYPE.map(moduleType => moduleType.param),
    FILTER_BOOKMARKS.param,
  ];

  const filterCount = Object.keys(query).reduce(
    (acc, q) => (params.includes(q as keyof Query) ? acc + 1 : acc),
    0
  );
  const isFilterCount = !!filterCount;

  return (
    <View style={[tw`flex-row items-center rounded`, style]}>
      <Button
        onPress={onPress}
        containerStyle={tw`h-full flex-grow`}
        style={[
          tw`h-full bg-accented px-2`,
          isFilterVisible && tw`bg-primary-dark`,
          isFilterCount && tw`rounded-r-none`,
        ]}>
        <View style={tw`flex-row items-center`}>
          <View style={tw`top-px`}>
            <FilterIcon
              style={[tw`text-white`, !isFilterVisible && isFilterCount && tw`text-primary`]}
              width={14}
              height={12}
            />
          </View>
          <P style={tw`ml-1.5 select-none text-sm text-white`}>
            Filters{isFilterCount ? `: ${filterCount}` : ''}
          </P>
        </View>
      </Button>
      {filterCount > 0 && (
        <View
          style={tw`h-full items-center justify-center rounded-r border-l border-palette-gray6 bg-accented dark:border-dark`}>
          <ClearButton onPress={onClearAllPress} />
        </View>
      )}
    </View>
  );
}

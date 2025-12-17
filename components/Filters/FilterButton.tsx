import { View, type ViewStyle } from 'react-native';

import { colors, P } from '~/common/styleguide';
import { type Query } from '~/types';
import tw from '~/util/tailwind';

import { ClearButton } from './ClearButton';
import {
  FILTER_COMPATIBILITY,
  FILTER_MODULE_TYPE,
  FILTER_PLATFORMS,
  FILTER_REQUIRES_MAIN_SEARCH,
  FILTER_STATUS,
  FILTER_TYPE,
} from './helpers';
import { Button } from '../Button';
import { Filter as FilterIcon } from '../Icons';

type Props = {
  query: Query;
  onPress: () => void;
  onClearAllPress: () => void;
  isFilterVisible: boolean;
  containerStyle?: ViewStyle;
  style?: ViewStyle;
};

export function FilterButton({
  isFilterVisible,
  query,
  onPress,
  onClearAllPress,
  containerStyle,
  style,
}: Props) {
  const params = [
    ...FILTER_PLATFORMS.map(platform => platform.param),
    ...FILTER_REQUIRES_MAIN_SEARCH.map(filter => filter.param),
    ...FILTER_STATUS.map(status => status.param),
    ...FILTER_COMPATIBILITY.map(compatibility => compatibility.param),
    ...FILTER_TYPE.map(entryType => entryType.param),
    ...FILTER_MODULE_TYPE.map(moduleType => moduleType.param),
  ];

  const filterCount = Object.keys(query).reduce(
    (acc, q) => (params.includes(q as keyof Query) ? acc + 1 : acc),
    0
  );
  const isFilterCount = !!filterCount;

  return (
    <View style={[tw`flex-row items-center rounded`, containerStyle]}>
      <Button
        onPress={onPress}
        style={[
          tw`h-full px-2 bg-palette-gray5 dark:bg-dark-brighter`,
          isFilterVisible && tw`bg-primary-dark`,
          isFilterCount && tw`rounded-r-none`,
          style,
        ]}>
        <View style={tw`flex-row items-center`}>
          <View style={tw`top-px`}>
            <FilterIcon
              fill={isFilterVisible ? colors.white : isFilterCount ? colors.primary : colors.white}
              width={14}
              height={12}
            />
          </View>
          <P style={tw`text-sm ml-1.5 text-white select-none`}>
            Filters{isFilterCount ? `: ${filterCount}` : ''}
          </P>
        </View>
      </Button>
      {filterCount > 0 && (
        <View
          style={tw`h-full justify-center items-center rounded-r border-l border-palette-gray6 bg-palette-gray5 dark:bg-dark-brighter dark:border-dark`}>
          <ClearButton onPress={onClearAllPress} />
        </View>
      )}
    </View>
  );
}

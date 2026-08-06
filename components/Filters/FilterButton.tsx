import { intersection } from 'es-toolkit/array';
import { type StyleProp, View, type ViewStyle } from 'react-native';

import { P } from '~/common/styleguide';
import { Button } from '~/components/Button';
import { FilterIcon } from '~/components/Icons';
import { type Query } from '~/types';
import tw from '~/util/tailwind';

import { ClearButton } from './ClearButton';
import { ALL_FILTERS_PARAMS } from './helpers';

type Props = {
  query: Query;
  onPress: () => void;
  onClearAllPress: () => void;
  isFilterVisible: boolean;
  style?: StyleProp<ViewStyle>;
};

export function FilterButton({ isFilterVisible, query, onPress, onClearAllPress, style }: Props) {
  const filterCount = intersection(Object.keys(query), ALL_FILTERS_PARAMS).length;
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
              style={[
                tw`h-3 w-3.5 text-white`,
                !isFilterVisible && isFilterCount && tw`text-primary`,
              ]}
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

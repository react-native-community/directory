import { intersection } from 'es-toolkit/array';
import { type StyleProp, View, type ViewStyle } from 'react-native';

import { P } from '~/common/styleguide';
import { Button } from '~/components/Button';
import { FilterIcon } from '~/components/Icons';
import { type Query } from '~/types';
import { cx } from '~/util/tailwind';

import { ClearButton } from './ClearButton';
import { ALL_FILTERS_PARAMS } from './helpers';

type Props = {
  query: Query;
  onPress: () => void;
  onClearAllPress: () => void;
  isFilterVisible: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

export function FilterButton({
  isFilterVisible,
  query,
  onPress,
  onClearAllPress,
  className,
  style,
}: Props) {
  const filterCount = intersection(Object.keys(query), ALL_FILTERS_PARAMS).length;
  const isFilterCount = !!filterCount;

  return (
    <View className={cx('flex-row items-center rounded', className)} style={style}>
      <Button
        onPress={onPress}
        containerClassName="h-full flex-grow"
        className={cx(
          'h-full bg-accented px-2',
          cx(isFilterVisible && 'bg-primary-dark'),
          cx(isFilterCount && 'rounded-r-none')
        )}>
        <View className="flex-row items-center">
          <View className="top-px">
            <FilterIcon
              className={cx(
                'h-3 w-3.5 text-white',
                cx(!isFilterVisible && isFilterCount && 'text-primary')
              )}
            />
          </View>
          <P className="ml-1.5 text-sm text-white select-none">
            Filters{isFilterCount ? `: ${filterCount}` : ''}
          </P>
        </View>
      </Button>
      {filterCount > 0 && (
        <View className="border-palette-gray6 bg-accented dark:border-dark h-full items-center justify-center rounded-r border-l">
          <ClearButton onPress={onClearAllPress} />
        </View>
      )}
    </View>
  );
}

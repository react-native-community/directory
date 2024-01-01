import { useContext } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { FILTER_PLATFORMS } from './helpers';
import { colors, darkColors, P } from '../../common/styleguide';
import CustomAppearanceContext from '../../context/CustomAppearanceContext';
import { Query } from '../../types';
import { Button } from '../Button';
import { Filter as FilterIcon } from '../Icons';

type FilterButtonProps = {
  query: Query;
  onPress: () => void;
  isFilterVisible: boolean;
  style?: ViewStyle;
};

export const FilterButton = ({ isFilterVisible, query, onPress, style }: FilterButtonProps) => {
  const { isDark } = useContext(CustomAppearanceContext);

  const params = [
    ...FILTER_PLATFORMS.map(platform => platform.param),
    'hasExample',
    'hasImage',
    'hasTypes',
    'isMaintained',
    'isPopular',
    'isRecommended',
    'wasRecentlyUpdated',
    'newArchitecture',
  ];

  const filterCount = Object.keys(query).reduce(
    (acc, q) => (params.includes(q) ? acc + 1 : acc),
    0
  );

  return (
    <Button
      onPress={onPress}
      style={[
        styles.button,
        { backgroundColor: isDark ? darkColors.border : colors.gray5 },
        isFilterVisible && styles.activeButton,
        style,
      ]}>
      <View style={styles.displayHorizontal}>
        <View style={styles.iconContainer}>
          <FilterIcon
            fill={isFilterVisible ? colors.gray7 : filterCount > 0 ? colors.primary : colors.white}
            width={14}
            height={12}
          />
        </View>
        <P style={[styles.buttonText, isFilterVisible && styles.activeButtonText]}>
          Filters{filterCount > 0 ? `: ${filterCount}` : ''}
        </P>
      </View>
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 24,
    paddingHorizontal: 8,
  },
  activeButton: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    fontSize: 14,
    color: colors.white,
    marginLeft: 6,
    fontWeight: '500',
    userSelect: 'none',
  },
  activeButtonText: {
    color: colors.gray7,
  },
  iconContainer: {
    top: 1,
  },
  displayHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

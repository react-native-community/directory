import { useContext } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { ClearButton } from './ClearButton';
import { FILTER_PLATFORMS } from './helpers';
import { colors, darkColors, P } from '../../common/styleguide';
import CustomAppearanceContext from '../../context/CustomAppearanceContext';
import { Query } from '../../types';
import { Button } from '../Button';
import { Filter as FilterIcon } from '../Icons';

type FilterButtonProps = {
  query: Query;
  onPress: () => void;
  onClearAllPress: () => void;
  isFilterVisible: boolean;
  containerStyle?: ViewStyle;
  style?: ViewStyle;
};

export const FilterButton = ({
  isFilterVisible,
  query,
  onPress,
  onClearAllPress,
  containerStyle,
  style,
}: FilterButtonProps) => {
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
  const isFilterCount = !!filterCount;

  const backgroundColor = isDark ? darkColors.border : colors.gray5;
  const borderLeftColor = isDark ? darkColors.dark : colors.gray6;

  return (
    <View style={[styles.container, containerStyle]}>
      <Button
        onPress={onPress}
        style={[
          styles.button,
          { backgroundColor },
          isFilterVisible && styles.activeButton,
          isFilterCount && styles.leftBorderRadiusOnly,
          style,
        ]}>
        <View style={styles.displayHorizontal}>
          <View style={styles.iconContainer}>
            <FilterIcon
              fill={isFilterVisible ? colors.gray7 : isFilterCount ? colors.primary : colors.white}
              width={14}
              height={12}
            />
          </View>
          <P style={[styles.buttonText, isFilterVisible && styles.activeButtonText]}>
            Filters{isFilterCount ? `: ${filterCount}` : ''}
          </P>
        </View>
      </Button>
      {filterCount > 0 && (
        <View style={[styles.clearButtonContainer, { backgroundColor, borderLeftColor }]}>
          <ClearButton onPress={onClearAllPress} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
  },
  button: {
    height: '100%',
    paddingHorizontal: 8,
  },
  activeButton: {
    backgroundColor: colors.primary,
  },
  leftBorderRadiusOnly: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
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
  clearButtonContainer: {
    height: '100%',
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    borderLeftWidth: 1,
  },
});

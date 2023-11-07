import Link from 'next/link';
import { useContext } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { Arrow } from './Icons';
import { colors, Caption, darkColors, HoverEffect } from '../common/styleguide';
import CustomAppearanceContext from '../context/CustomAppearanceContext';
import { Query } from '../types';
import { NUM_PER_PAGE } from '../util/Constants';
import urlWithQuery from '../util/urlWithQuery';

type Props = {
  query: Query;
  total: number | null;
  style?: ViewStyle;
};

const Pagination = ({ query, total, style }: Props) => {
  const { isDark } = useContext(CustomAppearanceContext);
  const totalPages = Math.ceil(total / NUM_PER_PAGE);
  const currentOffset = query.offset ? parseInt(query.offset.toString(), 10) : 0;
  const currentPage = Math.floor(currentOffset / NUM_PER_PAGE) + 1;

  if (total < 1 || currentOffset >= total) return null;

  const backDisabled = currentPage <= 1;
  const forwardDisabled = currentPage >= totalPages;

  const backArrow = isDark => (
    <View
      style={[
        styles.rotate,
        styles.arrowContainer,
        {
          backgroundColor: isDark ? darkColors.border : colors.gray2,
        },
        backDisabled && styles.disabled,
      ]}>
      <Arrow height={12} width={9} fill={isDark ? colors.white : colors.black} />
    </View>
  );

  const forwardArrow = isDark => (
    <View
      style={[
        styles.arrowContainer,
        {
          backgroundColor: isDark ? darkColors.border : colors.gray2,
        },
        forwardDisabled && styles.disabled,
      ]}>
      <Arrow height={12} width={9} fill={isDark ? colors.white : colors.black} />
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      {backDisabled ? (
        backArrow(isDark)
      ) : (
        <HoverEffect>
          <Link
            href={urlWithQuery('/', { ...query, offset: currentOffset - NUM_PER_PAGE })}
            style={{ borderRadius: 4 }}
            aria-label="Previous page">
            {backArrow(isDark)}
          </Link>
        </HoverEffect>
      )}

      <Caption style={styles.text}>
        {currentPage > 0 ? currentPage : '1'} of {totalPages}
      </Caption>
      {forwardDisabled ? (
        forwardArrow(isDark)
      ) : (
        <HoverEffect>
          <Link
            href={urlWithQuery('/', { ...query, offset: currentOffset + NUM_PER_PAGE })}
            style={{ borderRadius: 4 }}
            aria-label="Next page">
            {forwardArrow(isDark)}
          </Link>
        </HoverEffect>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexGrow: 0,
    flexBasis: 1,
    minHeight: 28,
  },
  arrowContainer: {
    height: 24,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  rotate: {
    transform: 'rotate(180deg)',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    marginHorizontal: 6,
    minWidth: 60,
    textAlign: 'center',
  },
});

export default Pagination;

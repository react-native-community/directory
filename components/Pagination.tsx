import Link from 'next/link';
import * as React from 'react';
import { StyleSheet, View, ViewStyle, TouchableOpacity } from 'react-native';

import { colors, Caption, darkColors } from '../common/styleguide';
import CustomAppearanceContext from '../context/CustomAppearanceContext';
import { Query } from '../types';
import { NUM_PER_PAGE } from '../util/Constants';
import urlWithQuery from '../util/urlWithQuery';
import { Arrow } from './Icons';

type Props = {
  query: Query;
  total: number | null;
  style?: ViewStyle;
};

export default function Pagination(props: Props) {
  const { query, total, style } = props;
  const totalPages = Math.ceil(total / NUM_PER_PAGE);
  const currentOffset = parseInt(query.offset ? query.offset : '0', 10);
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
    <CustomAppearanceContext.Consumer>
      {context => (
        <View style={[styles.container, style]}>
          {backDisabled ? (
            backArrow(context.isDark)
          ) : (
            <TouchableOpacity>
              <Link href={urlWithQuery('/', { ...query, offset: currentOffset - NUM_PER_PAGE })}>
                {backArrow(context.isDark)}
              </Link>
            </TouchableOpacity>
          )}

          <Caption style={styles.text}>
            {currentPage > 0 ? currentPage : '1'} of {totalPages}
          </Caption>
          {forwardDisabled ? (
            forwardArrow(context.isDark)
          ) : (
            <TouchableOpacity>
              <Link href={urlWithQuery('/', { ...query, offset: currentOffset + NUM_PER_PAGE })}>
                {forwardArrow(context.isDark)}
              </Link>
            </TouchableOpacity>
          )}
        </View>
      )}
    </CustomAppearanceContext.Consumer>
  );
}

let styles = StyleSheet.create({
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
  },
  rotate: {
    transform: [{ rotate: '180deg' }],
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    marginHorizontal: 6,
  },
});

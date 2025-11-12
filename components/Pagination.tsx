import Link from 'next/link';
import { useContext } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { colors, Caption, darkColors, HoverEffect } from '~/common/styleguide';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';
import { type Query } from '~/types';
import { NUM_PER_PAGE } from '~/util/Constants';
import { getPageQuery } from '~/util/search';
import urlWithQuery from '~/util/urlWithQuery';

import { Arrow } from './Icons';

type Props = {
  query: Query;
  total?: number | null;
  style?: ViewStyle;
  basePath?: string;
};

type ArrowButtonProps = {
  disabled?: boolean;
};

function BackArrow({ disabled }: ArrowButtonProps) {
  const { isDark } = useContext(CustomAppearanceContext);
  return (
    <View
      style={[
        styles.rotate,
        styles.arrowContainer,
        {
          backgroundColor: isDark ? darkColors.border : colors.gray2,
        },
        disabled && styles.disabled,
      ]}>
      <Arrow height={12} width={9} fill={isDark ? colors.white : colors.black} />
    </View>
  );
}

function ForwardArrow({ disabled }: ArrowButtonProps) {
  const { isDark } = useContext(CustomAppearanceContext);
  return (
    <View
      style={[
        styles.arrowContainer,
        {
          backgroundColor: isDark ? darkColors.border : colors.gray2,
        },
        disabled && styles.disabled,
      ]}>
      <Arrow height={12} width={9} fill={isDark ? colors.white : colors.black} />
    </View>
  );
}

export default function Pagination({ query, total, style, basePath = '/' }: Props) {
  const currentOffset = query.offset ? parseInt(query.offset, 10) : 0;
  const currentPage = Math.floor(currentOffset / NUM_PER_PAGE) + 1;

  if (!total || total < 1 || currentOffset >= total) {
    return null;
  }

  const backDisabled = currentPage <= 1;
  const totalPages = Math.ceil(total / NUM_PER_PAGE);
  const forwardDisabled = currentPage >= totalPages;

  const pageQuery = getPageQuery(basePath, query);

  return (
    <View style={[styles.container, style]}>
      {backDisabled ? (
        <BackArrow disabled />
      ) : (
        <HoverEffect>
          <Link
            href={urlWithQuery(basePath, {
              ...pageQuery,
              offset: (currentOffset - NUM_PER_PAGE).toString(),
            })}
            style={{ borderRadius: 4 }}
            aria-label="Previous page">
            <BackArrow />
          </Link>
        </HoverEffect>
      )}

      <Caption style={styles.text}>
        {currentPage > 0 ? currentPage : '1'} of {totalPages}
      </Caption>
      {forwardDisabled ? (
        <ForwardArrow disabled />
      ) : (
        <HoverEffect>
          <Link
            href={urlWithQuery(basePath, {
              ...pageQuery,
              offset: (currentOffset + NUM_PER_PAGE).toString(),
            })}
            style={{ borderRadius: 4 }}
            aria-label="Next page">
            <ForwardArrow />
          </Link>
        </HoverEffect>
      )}
    </View>
  );
}

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

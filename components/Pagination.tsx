import Link from 'next/link';
import { View, type ViewStyle } from 'react-native';

import { Caption, HoverEffect } from '~/common/styleguide';
import { Arrow } from '~/components/Icons';
import SearchTag from '~/components/SearchTag';
import { type Query } from '~/types';
import { NUM_PER_PAGE } from '~/util/Constants';
import { getPageQuery } from '~/util/search';
import tw from '~/util/tailwind';
import urlWithQuery from '~/util/urlWithQuery';

type Props = {
  query: Query;
  total?: number | null;
  style?: ViewStyle;
  basePath?: string;
};

type ArrowButtonProps = {
  disabled?: boolean;
};

export default function Pagination({ query, total, style, basePath = '/packages' }: Props) {
  const currentOffset = query.offset ? Number.parseInt(query.offset, 10) : 0;
  const currentPage = Math.floor(currentOffset / NUM_PER_PAGE) + 1;

  if (!total || total < 1 || currentOffset >= total) {
    return null;
  }

  const backDisabled = currentPage <= 1;
  const totalPages = Math.ceil(total / NUM_PER_PAGE);
  const forwardDisabled = currentPage >= totalPages;

  const pageQuery = getPageQuery(basePath, query);

  return (
    <View style={tw`flex-row justify-between`}>
      {query.owner ? <SearchTag title="Owner" value={query.owner} /> : <View />}
      <View style={[tw`flex-row items-center justify-end`, style]}>
        {backDisabled ? (
          <BackArrow disabled />
        ) : (
          <HoverEffect>
            <Link
              href={urlWithQuery(basePath, {
                ...pageQuery,
                offset: (currentOffset - NUM_PER_PAGE).toString(),
              })}
              style={tw`rounded`}
              aria-label="Previous page">
              <BackArrow />
            </Link>
          </HoverEffect>
        )}
        <Caption style={tw`mx-1.5 min-w-15 text-center`}>
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
              style={tw`rounded`}
              aria-label="Next page">
              <ForwardArrow />
            </Link>
          </HoverEffect>
        )}
      </View>
    </View>
  );
}

function BackArrow({ disabled }: ArrowButtonProps) {
  return (
    <View
      style={[
        tw`size-6 items-center justify-center rounded rotate-180 bg-palette-gray2 dark:bg-accented`,
        disabled && tw`opacity-50`,
      ]}>
      <Arrow height={12} width={9} style={tw`text-black dark:text-white`} />
    </View>
  );
}

function ForwardArrow({ disabled }: ArrowButtonProps) {
  return (
    <View
      style={[
        tw`size-6 items-center justify-center rounded bg-palette-gray2 dark:bg-accented`,
        disabled && tw`opacity-50`,
      ]}>
      <Arrow height={12} width={9} style={tw`text-black dark:text-white`} />
    </View>
  );
}

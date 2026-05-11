import Link from 'next/link';
import { View, type ViewStyle } from 'react-native';

import { Caption, HoverEffect } from '~/common/styleguide';
import { ArrowIcon } from '~/components/Icons';
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
  noTags?: boolean;
  basePath?: string;
};

type ArrowButtonProps = {
  disabled?: boolean;
  back?: boolean;
};

export default function Pagination({ query, total, style, noTags, basePath = '/packages' }: Props) {
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
      {!noTags ? (
        <View>
          {query.owner && <SearchTag title="Owner" value={query.owner} />}
          {query.minPopularity && (
            <SearchTag title="Minimal popularity" value={query.minPopularity} />
          )}
        </View>
      ) : (
        <View />
      )}
      <View style={[tw`flex-row items-center justify-end`, style]}>
        {backDisabled ? (
          <PaginationArrow back disabled />
        ) : (
          <HoverEffect>
            <Link
              href={urlWithQuery(basePath, {
                ...pageQuery,
                offset: (currentOffset - NUM_PER_PAGE).toString(),
              })}
              style={tw`rounded`}
              aria-label="Previous page">
              <PaginationArrow back />
            </Link>
          </HoverEffect>
        )}
        <Caption style={tw`min-w-15 mx-1.5 text-center`}>
          {currentPage > 0 ? currentPage : '1'} of {totalPages}
        </Caption>
        {forwardDisabled ? (
          <PaginationArrow disabled />
        ) : (
          <HoverEffect>
            <Link
              href={urlWithQuery(basePath, {
                ...pageQuery,
                offset: (currentOffset + NUM_PER_PAGE).toString(),
              })}
              style={tw`rounded`}
              aria-label="Next page">
              <PaginationArrow />
            </Link>
          </HoverEffect>
        )}
      </View>
    </View>
  );
}

function PaginationArrow({ disabled, back }: ArrowButtonProps) {
  return (
    <View
      style={[
        tw`size-6 items-center justify-center rounded bg-palette-gray2 dark:bg-accented`,
        back && tw`rotate-180`,
        disabled && tw`opacity-50`,
      ]}>
      <ArrowIcon style={tw`h-3 text-black dark:text-white`} />
    </View>
  );
}

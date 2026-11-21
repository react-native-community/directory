import { startCase } from 'es-toolkit/string';
import Link from 'next/link';
import { View, type ViewStyle } from 'react-native';

import { Caption, HoverEffect } from '~/common/styleguide';
import { ArrowIcon } from '~/components/Icons';
import SearchTag from '~/components/SearchTag';
import { type Query } from '~/types';
import { NUM_PER_PAGE } from '~/util/Constants';
import { getPageQuery } from '~/util/search';
import { cx } from '~/util/tailwind';
import urlWithQuery from '~/util/urlWithQuery';

type Props = {
  query: Query;
  total?: number | null;
  style?: ViewStyle;
  noTags?: boolean;
  basePath?: string;
  shallow?: boolean;
  hash?: string;
};

type ArrowButtonProps = {
  disabled?: boolean;
  back?: boolean;
};

export default function Pagination({
  query,
  total,
  style,
  noTags,
  basePath = '/packages',
  shallow,
  hash,
}: Props) {
  const currentOffset = query.offset ? Number.parseInt(query.offset, 10) : 0;
  const currentPage = Math.floor(currentOffset / NUM_PER_PAGE) + 1;

  if (!total || total < 1 || currentOffset >= total) {
    return null;
  }

  const backDisabled = currentPage <= 1;
  const totalPages = Math.ceil(total / NUM_PER_PAGE);
  const forwardDisabled = currentPage >= totalPages;

  const pageQuery = getPageQuery(basePath, query);
  const hashSuffix = hash ? `#${hash}` : '';

  return (
    <View className="flex-row justify-between">
      {!noTags ? (
        <View>
          {query.owner && <SearchTag title="Owner" value={startCase(query.owner)} />}
          {query.dependantsOf && <SearchTag title="Depends on" value={query.dependantsOf} />}
          {query.minPopularity && (
            <SearchTag title="Minimal popularity" value={query.minPopularity} />
          )}
        </View>
      ) : (
        <View />
      )}
      <View className={cx('flex-row items-center justify-end')} style={[style]}>
        {backDisabled ? (
          <PaginationArrow back disabled />
        ) : (
          <HoverEffect>
            <Link
              href={`${urlWithQuery(basePath, {
                ...pageQuery,
                offset: (currentOffset - NUM_PER_PAGE).toString(),
              })}${hashSuffix}`}
              shallow={shallow}
              className="rounded"
              aria-label="Previous page">
              <PaginationArrow back />
            </Link>
          </HoverEffect>
        )}
        <Caption className="mx-1.5 min-w-15 text-center">
          {currentPage} of {totalPages}
        </Caption>
        {forwardDisabled ? (
          <PaginationArrow disabled />
        ) : (
          <HoverEffect>
            <Link
              href={`${urlWithQuery(basePath, {
                ...pageQuery,
                offset: (currentOffset + NUM_PER_PAGE).toString(),
              })}${hashSuffix}`}
              shallow={shallow}
              className="rounded"
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
      className={cx(
        'size-6 items-center justify-center rounded bg-palette-gray2 dark:bg-accented',
        cx(back && 'rotate-180'),
        cx(disabled && 'opacity-50 dark:opacity-40')
      )}>
      <ArrowIcon className={cx('h-3 text-black dark:text-white', cx(disabled && 'text-icon'))} />
    </View>
  );
}

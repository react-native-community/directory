import { createElement, type FunctionComponent } from 'react';
import { View } from 'react-native';

import { A, H3, P } from '~/common/styleguide';
import { type IconProps } from '~/components/Icons';
import { LibraryWithLoading } from '~/components/Library/LibraryWithLoading';
import { type LibraryType, type Query } from '~/types';
import { POPULAR_QUERY_BASE } from '~/util/Constants';
import { TimeRange } from '~/util/datetime';
import urlWithQuery from '~/util/urlWithQuery';

type Props = {
  data: LibraryType[];
  title: string;
  icon?: FunctionComponent<IconProps>;
  queryParams?: Query;
};

const UPDATED_IN = 1000 * TimeRange.MONTH * 3;

export default function ExploreSection({ data, title, icon, queryParams }: Props) {
  const hashLink = title.replace(/\s/g, '').toLowerCase();

  return (
    <>
      <H3 className="flex items-center gap-3 px-2 pt-3 pb-2" id={hashLink}>
        {icon && createElement(icon, { className: 'text-icon mt-px size-7.5' })}
        <A
          href={`#${hashLink}`}
          target="_self"
          className="text-icon no-underline"
          hoverStyle="text-palette-gray4 dark:text-palette-gray5">
          {title}
        </A>
      </H3>
      <View className="flex-1 flex-row flex-wrap pt-3">
        <ExploreLibrariesList list={data} />
      </View>
      <P className="text-secondary px-6 pt-2 pb-6 text-sm font-light">
        Want to see more? Check out other{' '}
        <A
          href={urlWithQuery('/packages', {
            [title.toLowerCase()]: true,
            ...queryParams,
            ...POPULAR_QUERY_BASE,
          })}
          target="_self">
          {title} libraries
        </A>{' '}
        in the directory!
      </P>
    </>
  );
}

type ExploreLibrariesListProps = { list: LibraryType[] };

function ExploreLibrariesList({ list }: ExploreLibrariesListProps) {
  const now = Date.now();
  return list
    .filter(({ github }) => now - new Date(github.stats.updatedAt).getTime() < UPDATED_IN)
    .map(item => (
      <LibraryWithLoading
        key={`explore-item-${item.npmPkg}`}
        library={item}
        loadingVariant="grid"
        showTrendingMark
        skipMetadata
      />
    ));
}

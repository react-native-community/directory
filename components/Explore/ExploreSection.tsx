import dynamic from 'next/dynamic';
import { createElement, type FunctionComponent } from 'react';
import { View } from 'react-native';

import { A, H3, P } from '~/common/styleguide';
import { type IconProps } from '~/components/Icons';
import LoadingContent from '~/components/Library/LoadingContent';
import { type LibraryType, type Query } from '~/types';
import { POPULAR_QUERY_BASE } from '~/util/Constants';
import { TimeRange } from '~/util/datetime';
import tw from '~/util/tailwind';
import urlWithQuery from '~/util/urlWithQuery';

const LibraryWithLoading = dynamic(() => import('~/components/Library'), {
  loading: () => <LoadingContent width="48.5%" height={210} wrapperStyle={tw`mx-[0.75%]`} />,
});

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
      <H3 style={tw`flex items-center gap-3 px-2 pb-2 pt-3`} id={hashLink}>
        {icon && createElement(icon, { style: tw`size-7.5 mt-px text-icon` })}
        <A
          href={`#${hashLink}`}
          target="_self"
          style={tw`text-icon no-underline`}
          hoverStyle={tw`text-palette-gray4 dark:text-palette-gray5`}>
          {title}
        </A>
      </H3>
      <View style={tw`flex-1 flex-row flex-wrap pt-3`}>{renderLibs(data)}</View>
      <P style={tw`px-6 pb-6 pt-2 text-sm font-light text-secondary`}>
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

function renderLibs(list: LibraryType[]) {
  const now = Date.now();
  return list
    .filter(({ github }) => now - new Date(github.stats.updatedAt).getTime() < UPDATED_IN)
    .map((item: LibraryType, index: number) => (
      <LibraryWithLoading
        key={`explore-item-${index}-${item.github.name}`}
        library={item}
        showTrendingMark
        skipMetadata
      />
    ));
}

import dynamic from 'next/dynamic';
import { createElement, type FunctionComponent } from 'react';
import { View } from 'react-native';

import { A, H3, P } from '~/common/styleguide';
import { type IconProps } from '~/components/Icons';
import LoadingContent from '~/components/Library/LoadingContent';
import { type LibraryType, type Query } from '~/types';
import tw from '~/util/tailwind';
import urlWithQuery from '~/util/urlWithQuery';

const LibraryWithLoading = dynamic(() => import('~/components/Library'), {
  loading: () => <LoadingContent width="48.5%" height={210} wrapperStyle={tw`mx-[0.75%]`} />,
});

type Props = {
  data: LibraryType[];
  title: string;
  filter: (library: LibraryType) => boolean;
  icon?: FunctionComponent<IconProps>;
  count?: number;
  queryParams?: Query;
};

const UPDATED_IN = 1000 * 60 * 60 * 24 * 90; // 90 days
const DEFAULT_PARAMS: Query = {
  wasRecentlyUpdated: 'true',
  isMaintained: 'true',
  order: 'popularity',
};

export default function ExploreSection({
  data,
  title,
  filter,
  icon,
  count = 4,
  queryParams = { [title.toLowerCase()]: true },
}: Props) {
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
      <View style={tw`flex-1 flex-row flex-wrap pt-3`}>
        {renderLibs(data.filter(filter), count)}
      </View>
      <P style={tw`px-6 pb-6 pt-2 text-sm font-light text-secondary`}>
        Want to see more? Check out other{' '}
        <A href={urlWithQuery('/packages', { ...queryParams, ...DEFAULT_PARAMS })} target="_self">
          {title} libraries
        </A>{' '}
        in the directory!
      </P>
    </>
  );
}

function renderLibs(list: LibraryType[], count = 4) {
  const now = Date.now();
  return list
    .filter(({ github }) => now - new Date(github.stats.updatedAt).getTime() < UPDATED_IN)
    .splice(0, count)
    .map((item: LibraryType, index: number) => (
      <LibraryWithLoading
        key={`explore-item-${index}-${item.github.name}`}
        library={item}
        showTrendingMark
        skipMetadata
      />
    ));
}

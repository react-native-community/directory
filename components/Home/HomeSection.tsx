import dynamic from 'next/dynamic';
import { createElement, type FunctionComponent } from 'react';
import { View } from 'react-native';

import { A, H4, P } from '~/common/styleguide';
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
  filter?: (library: LibraryType) => boolean;
  icon?: FunctionComponent<IconProps>;
  count?: number;
  queryParams?: Query;
};

export default function HomeSection({
  data,
  title,
  filter,
  icon,
  count = 6,
  queryParams = {},
}: Props) {
  const hashLink = title.replace(/\s/g, '').toLowerCase();

  return (
    <>
      <H4 style={tw`flex gap-3 pt-3 pb-2 px-2 items-center font-medium`} id={hashLink}>
        {icon && createElement(icon, { style: tw`size-5 text-icon mt-px` })}
        <A
          href={`#${hashLink}`}
          target="_self"
          style={tw`no-underline text-icon`}
          hoverStyle={tw`text-palette-gray4 dark:text-palette-gray5`}>
          {title}
        </A>
      </H4>
      <View style={tw`pt-3 flex-1 flex-row flex-wrap`}>
        {renderLibs(data.filter(filter ?? (() => true)), count)}
      </View>
      <P style={tw`px-6 pt-2 pb-6 text-sm font-light text-secondary`}>
        Want to see more? Check out other{' '}
        <A href={urlWithQuery('/packages', { ...queryParams })} target="_self">
          {title.toLowerCase()} libraries
        </A>{' '}
        in the directory!
      </P>
    </>
  );
}

function renderLibs(list: LibraryType[], count = 6) {
  return list
    .splice(0, count)
    .map((item: LibraryType, index: number) => (
      <LibraryWithLoading
        key={`explore-item-${index}-${item.github.name}`}
        library={item}
        skipMetadata
        skipDate
      />
    ));
}

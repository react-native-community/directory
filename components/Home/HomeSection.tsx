import dynamic from 'next/dynamic';
import { type ComponentType, createElement } from 'react';
import { View } from 'react-native';

import { A, H4, HoverEffect, P } from '~/common/styleguide';
import { type IconProps, RSS } from '~/components/Icons';
import LoadingContent from '~/components/Library/LoadingContent';
import Tooltip from '~/components/Tooltip';
import { type LibraryType, type Query } from '~/types';
import tw from '~/util/tailwind';
import urlWithQuery from '~/util/urlWithQuery';

const LibraryWithLoading = dynamic(() => import('~/components/Library'), {
  loading: () => <LoadingContent width="48.5%" height={210} wrapperStyle={tw`mx-[0.75%]`} />,
});

type Props = {
  data: LibraryType[];
  title: string;
  Icon?: ComponentType<IconProps>;
  count?: number;
  queryParams?: Query;
  rss?: string;
};

export default function HomeSection({
  data,
  title,
  Icon,
  rss,
  count = 8,
  queryParams = {},
}: Props) {
  const hashLink = title.replace(/\s/g, '').toLowerCase();

  return (
    <>
      <H4 style={tw`flex items-center gap-2.5 px-2 pb-2 pt-3 font-medium`} id={hashLink}>
        {Icon && createElement(Icon, { style: tw`mt-px size-5 text-icon` })}
        <A
          href={`#${hashLink}`}
          target="_self"
          style={tw`text-icon no-underline`}
          hoverStyle={tw`text-palette-gray4 dark:text-palette-gray5`}>
          {title}
        </A>
        {rss && (
          <Tooltip
            trigger={
              <HoverEffect style={tw`ml-auto`}>
                <A href={rss} target="_blank" style={tw`h-5.5`} aria-label={`${title} RSS feed`}>
                  <RSS style={tw`text-icon`} />
                </A>
              </HoverEffect>
            }>
            RSS feed
          </Tooltip>
        )}
      </H4>
      <View style={tw`flex-1 flex-row flex-wrap pt-3`}>{renderLibs(data, count)}</View>
      <P style={tw`px-6 pb-6 pt-2 text-sm font-light text-secondary`}>
        Want to see more? Check out other{' '}
        <A href={urlWithQuery('/packages', { ...queryParams })} target="_self">
          {title.toLowerCase()} libraries
        </A>{' '}
        in the directory!
      </P>
    </>
  );
}

function renderLibs(list: LibraryType[], count: number) {
  return list
    .splice(0, count)
    .map(item => (
      <LibraryWithLoading
        key={`home-item-${item.npmPkg}`}
        library={item}
        skipMetadata
        skipSecondaryMetadata
        skipDate
      />
    ));
}

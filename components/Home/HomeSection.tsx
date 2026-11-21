import { type ComponentType, createElement } from 'react';
import { View } from 'react-native';

import { A, H4, HoverEffect, P } from '~/common/styleguide';
import { type IconProps, RSSIcon } from '~/components/Icons';
import { LibraryWithLoading } from '~/components/Library/LibraryWithLoading';
import { Tooltip } from '~/components/Tooltip';
import { type LibraryType, type Query } from '~/types';
import urlWithQuery from '~/util/urlWithQuery';

type Props = {
  data: LibraryType[];
  title: string;
  Icon?: ComponentType<IconProps>;
  count?: number;
  queryParams?: Query;
  rss?: string;
};

export default function HomeSection({ data, title, Icon, rss, count = 8, queryParams }: Props) {
  const hashLink = title.replace(/\s/g, '').toLowerCase();

  return (
    <>
      <H4 className="flex items-center gap-2.5 px-2 pt-3 pb-2 font-medium" id={hashLink}>
        {Icon && createElement(Icon, { className: 'text-icon mt-px size-5' })}
        <A
          href={`#${hashLink}`}
          target="_self"
          className="text-icon no-underline"
          hoverStyle="text-palette-gray4 dark:text-palette-gray5">
          {title}
        </A>
        {rss && (
          <Tooltip
            trigger={
              <HoverEffect className="ml-auto">
                <A href={rss} target="_blank" className="h-5.5" aria-label={`${title} RSS feed`}>
                  <RSSIcon className="text-icon" />
                </A>
              </HoverEffect>
            }>
            RSS feed
          </Tooltip>
        )}
      </H4>
      <View className="flex-1 flex-row flex-wrap pt-3">
        <HomeLibrariesList list={data} count={count} />
      </View>
      <P className="text-secondary px-6 pt-2 pb-6 text-sm font-light">
        Want to see more? Check out other{' '}
        <A href={urlWithQuery('/packages', { ...queryParams })} target="_self">
          {title.toLowerCase()} libraries
        </A>{' '}
        in the directory!
      </P>
    </>
  );
}

type HomeLibrariesListProps = { list: LibraryType[]; count: number };

function HomeLibrariesList({ list, count }: HomeLibrariesListProps) {
  return list
    .slice(0, count)
    .map(item => (
      <LibraryWithLoading
        key={`home-item-${item.npmPkg}`}
        library={item}
        loadingVariant="home"
        skipMetadata
        skipSecondaryMetadata
        skipDate
      />
    ));
}

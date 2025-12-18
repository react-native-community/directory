import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { P } from '~/common/styleguide';
import { type Query, type QueryOrder, type QueryOrderDirection } from '~/types';
import tw from '~/util/tailwind';
import urlWithQuery from '~/util/urlWithQuery';

import { Sort as SortIcon } from './Icons';
import Tooltip from './Tooltip';

type SortButtonProps = {
  query: Query;
};

export function SortButton({ query: { order, direction, search }, query }: SortButtonProps) {
  const [isSortIconHovered, setIsSortIconHovered] = useState(false);

  const { asPath, push } = useRouter();

  const currentSortValue: QueryOrder | undefined = order;
  const currentDirection: QueryOrderDirection | undefined = direction;

  function updatePath(url: string) {
    if (url !== asPath) {
      void push(url);
    }
  }

  return (
    <View
      style={tw`flex-row items-center bg-palette-gray5 h-6 ml-2 pl-2 rounded dark:bg-dark-brighter`}>
      <View style={tw`flex-row items-center`}>
        <Tooltip
          sideOffset={8}
          trigger={
            <Pressable
              onHoverIn={() => setIsSortIconHovered(true)}
              onHoverOut={() => setIsSortIconHovered(false)}
              style={currentDirection === 'ascending' && tw`-scale-y-100`}
              aria-label="Toggle sort direction"
              role="button"
              onPress={() => {
                updatePath(
                  urlWithQuery('/', {
                    ...query,
                    direction: currentDirection === 'ascending' ? 'descending' : 'ascending',
                  })
                );
              }}>
              <SortIcon style={isSortIconHovered ? tw`text-primary` : tw`text-white`} />
            </Pressable>
          }>
          Toggle sort order
        </Tooltip>
        <P style={tw`text-sm text-white ml-1.5 mr-0.5 select-none`}>Sort:</P>
      </View>
      <View style={tw`top-px`}>
        <Picker
          id="sort-order"
          aria-label="Sort order"
          selectedValue={currentSortValue ?? (search ? 'relevance' : 'updated')}
          style={tw`text-white border-0 rounded text-sm relative -top-px font-semibold bg-transparent`}
          onValueChange={value => {
            updatePath(
              urlWithQuery('/', {
                ...query,
                order: value,
                offset: null,
              })
            );
          }}>
          {SORTS.map(sort => (
            <Picker.Item key={sort.param} value={sort.param} label={sort.label} />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const SORTS: { param: QueryOrder; label: string }[] = [
  {
    param: 'relevance',
    label: 'Relevance',
  },
  {
    param: 'updated',
    label: 'Last Updated',
  },
  {
    param: 'added',
    label: 'Recently Added',
  },
  {
    param: 'released',
    label: 'Recently Released',
  },
  {
    param: 'quality',
    label: 'Quality',
  },
  {
    param: 'popularity',
    label: 'Popularity Gain',
  },
  {
    param: 'downloads',
    label: 'Downloads',
  },
  {
    param: 'stars',
    label: 'Stars',
  },
  {
    param: 'issues',
    label: 'Issues',
  },
  {
    param: 'dependencies',
    label: 'Dependencies',
  },
  {
    param: 'size',
    label: 'Bundle Size',
  },
];

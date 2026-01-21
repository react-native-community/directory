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
    <View style={tw`ml-2 h-6 flex-row items-center rounded bg-accented pl-2`}>
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
                  urlWithQuery('/packages', {
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
        <P style={tw`ml-1.5 mr-0.5 select-none text-sm text-white`}>Sort:</P>
      </View>
      <View style={tw`top-px`}>
        <Picker
          id="sort-order"
          aria-label="Sort order"
          selectedValue={currentSortValue ?? (search ? 'relevance' : 'updated')}
          style={tw`relative -top-px rounded border-0 bg-transparent text-sm font-semibold text-white`}
          onValueChange={value => {
            updatePath(
              urlWithQuery('/packages', {
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

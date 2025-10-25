import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, darkColors, P } from '~/common/styleguide';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';
import { type Query, type QueryOrder, type QueryOrderDirection } from '~/types';
import urlWithQuery from '~/util/urlWithQuery';

import { Sort as SortIcon } from './Icons';
import Tooltip from './Tooltip';

type SortButtonProps = {
  query: Query;
};

const sorts: { param: QueryOrder; label: string }[] = [
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

export const SortButton = ({ query: { order, direction, offset }, query }: SortButtonProps) => {
  const [sortValue, setSortValue] = useState<QueryOrder | undefined>(order);
  const [sortDirection, setSortDirection] = useState<QueryOrderDirection | undefined>(direction);
  const [paginationOffset, setPaginationOffset] = useState<string | null | undefined>(
    typeof offset === 'string' ? offset : offset
  );
  const [isSortIconHovered, setIsSortIconHovered] = useState(false);

  const { pathname, push } = useRouter();
  const { isDark } = useContext(CustomAppearanceContext);

  useEffect(() => {
    const url = urlWithQuery('/', {
      ...query,
      order: sortValue,
      direction: sortDirection,
      offset: paginationOffset,
    });
    if (url !== pathname) {
      void push(url);
    }
  }, [sortValue, sortDirection, paginationOffset]);

  return (
    <View
      style={[
        styles.container,
        styles.displayHorizontal,
        { backgroundColor: isDark ? darkColors.border : colors.gray5 },
      ]}>
      <View style={styles.displayHorizontal}>
        <Tooltip
          sideOffset={8}
          trigger={
            <Pressable
              onHoverIn={() => setIsSortIconHovered(true)}
              onHoverOut={() => setIsSortIconHovered(false)}
              style={sortDirection === 'ascending' && styles.flippedIcon}
              aria-label="Toggle sort direction"
              role="button"
              onPress={() => {
                setSortDirection(previousOrder =>
                  previousOrder === 'ascending' ? 'descending' : 'ascending'
                );
                if (!sortValue) {
                  setSortValue('relevance');
                }
              }}>
              <SortIcon fill={isSortIconHovered ? colors.primary : colors.white} />
            </Pressable>
          }>
          Toggle sort order
        </Tooltip>
        <P style={styles.title}>Sort:</P>
      </View>
      <View style={styles.pickerContainer}>
        <Picker
          id="sort-order"
          aria-label="Sort order"
          selectedValue={sortValue}
          style={[
            styles.picker,
            {
              backgroundColor: isDark ? darkColors.border : 'transparent',
            },
          ]}
          onValueChange={value => {
            setPaginationOffset(null);
            setSortValue(value);
          }}>
          {sorts.map(sort => (
            <Picker.Item
              key={sort.param}
              value={sort.param}
              label={sort.label}
              color={isDark ? colors.white : colors.black}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray5,
    height: 24,
    marginLeft: 8,
    paddingLeft: 8,
    borderRadius: 4,
  },
  displayHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: colors.white,
    fontWeight: 400,
    marginLeft: 6,
    marginRight: 2,
    fontSize: 14,
    userSelect: 'none',
  },
  pickerContainer: {
    top: 1,
  },
  picker: {
    color: colors.white,
    borderWidth: 0,
    borderRadius: 4,
    position: 'relative',
    top: -1,
    fontSize: 14,
    fontFamily: 'inherit',
    cursor: 'pointer',
    fontWeight: 600,
  },
  flippedIcon: {
    transform: 'scaleY(-1)',
  },
});

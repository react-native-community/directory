import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useHover } from 'react-native-web-hooks';

import { Sort as SortIcon } from './Icons';
import { colors, darkColors, P } from '../common/styleguide';
import CustomAppearanceContext from '../context/CustomAppearanceContext';
import { Query, QueryOrder, QueryOrderDirection } from '../types';
import urlWithQuery from '../util/urlWithQuery';

type SortButtonProps = {
  query: Query;
};

const sorts = [
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
    param: 'recommended',
    label: 'Recommended',
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
    param: 'issues',
    label: 'Issues',
  },
  {
    param: 'downloads',
    label: 'Downloads',
  },
  {
    param: 'stars',
    label: 'Stars',
  },
];

export const SortButton = ({ query: { order, direction }, query }: SortButtonProps) => {
  const [sortValue, setSortValue] = useState<QueryOrder>(order ?? 'relevance');
  const [sortDirection, setSortDirection] = useState<QueryOrderDirection>(
    direction ?? 'descending'
  );
  const { isDark } = useContext(CustomAppearanceContext);
  const router = useRouter();

  const sortIconRef = useRef();
  const isSortIconHovered = useHover(sortIconRef);

  useEffect(() => {
    router.push(
      urlWithQuery('/', {
        ...query,
        order: sortValue !== 'relevance' ? sortValue : undefined,
        direction: sortDirection !== 'descending' ? sortDirection : undefined,
        offset: null,
      })
    );
  }, [sortValue, sortDirection]);

  return (
    <View
      style={[
        styles.container,
        styles.displayHorizontal,
        { backgroundColor: isDark ? darkColors.border : colors.gray5 },
      ]}>
      <View style={styles.displayHorizontal}>
        <Pressable
          ref={sortIconRef}
          style={sortDirection === 'ascending' && styles.flippedIcon}
          aria-label="Toggle sort direction"
          onPress={() => {
            setSortDirection(previousOrder =>
              previousOrder === 'ascending' ? 'descending' : 'ascending'
            );
          }}>
          <SortIcon fill={isSortIconHovered ? colors.primary : colors.white} />
        </Pressable>
        <P style={styles.title}>Sort:</P>
      </View>
      <View style={styles.pickerContainer}>
        <P style={styles.title}>
          <Picker
            selectedValue={sortValue}
            style={[
              styles.picker,
              {
                backgroundColor: isDark ? darkColors.border : 'transparent',
              },
            ]}
            onValueChange={setSortValue}>
            {sorts.map(sort => (
              <Picker.Item
                key={sort.param}
                value={sort.param}
                label={sort.label}
                color={isDark ? colors.white : colors.black}
              />
            ))}
          </Picker>
        </P>
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
    fontWeight: '500',
    marginLeft: 6,
    fontSize: 14,
  },
  pickerContainer: {
    top: 1,
    left: -4,
  },
  picker: {
    color: colors.white,
    borderWidth: 0,
    position: 'relative',
    top: -1,
    fontSize: 14,
    fontFamily: 'inherit',
    cursor: 'pointer',
  },
  flippedIcon: {
    transform: 'scaleY(-1)',
  },
});

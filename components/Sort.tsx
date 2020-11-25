import Router from 'next/router';
import React, { useContext, useState } from 'react';
import { StyleSheet, View, Picker } from 'react-native';

import { colors, darkColors, P } from '../common/styleguide';
import CustomAppearanceContext from '../context/CustomAppearanceContext';
import { Query } from '../types';
import urlWithQuery from '../util/urlWithQuery';
import { Sort as SortIcon } from './Icons';

type SortButtonProps = {
  query: Query;
};

const sorts = [
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

export const SortButton = (props: SortButtonProps) => {
  const {
    query: { order },
    query,
  } = props;
  const [sortValue, setSortValue] = useState(order || 'updated');
  const { isDark } = useContext(CustomAppearanceContext);

  function onPickerChange(param: string) {
    Router.push(urlWithQuery('/', { ...query, order: param, offset: null }));
    setSortValue(param);
  }

  return (
    <View
      style={[
        styles.container,
        styles.displayHorizontal,
        { backgroundColor: isDark ? darkColors.border : colors.gray5 },
      ]}>
      <View style={styles.displayHorizontal}>
        <SortIcon fill={colors.white} />
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
            onValueChange={onPickerChange}>
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

let styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray5,
    height: 24,
    marginLeft: 8,
    paddingLeft: 8,
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
  },
});

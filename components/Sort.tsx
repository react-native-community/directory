import React, { useState } from 'react';
import { StyleSheet, View, Picker } from 'react-native';
import Router from 'next/router';
import { colors, P } from '../common/styleguide';
import { Sort as SortIcon } from './Icons';
import urlWithQuery from '../util/urlWithQuery';

type SortButtonProps = {
  query: { [key: string]: any };
};

const sorts = [
  {
    param: 'last-updated',
    label: 'Last Updated',
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
  const [sortValue, setSortValue] = useState(order || 'last-updated');

  function onPickerChange(param: string) {
    if (param === 'last-updated') {
      Router.push(urlWithQuery('/', { ...query, order: null, offset: null }));
    } else {
      Router.push(urlWithQuery('/', { ...query, order: param, offset: null }));
    }

    setSortValue(param);
  }

  return (
    <View style={[styles.container, styles.displayHorizontal]}>
      <View style={styles.displayHorizontal}>
        <SortIcon fill={colors.white} />
        <P style={styles.title}>Sort:</P>
      </View>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={sortValue} style={styles.picker} onValueChange={onPickerChange}>
          {sorts.map(sort => (
            <Picker.Item key={sort.param} value={sort.param} label={sort.label} />
          ))}
        </Picker>
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
    paddingRight: 2,
  },
  displayHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: colors.white,
    marginLeft: 6,
    fontSize: 14,
  },
  pickerContainer: {
    top: 1,
    left: -2,
  },
  picker: {
    backgroundColor: 'transparent',
    color: colors.white,
    borderWidth: 0,
    fontSize: 14,
  },
});

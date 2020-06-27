import Link from 'next/link';
import * as React from 'react';
import { Platform, StyleSheet, View, CheckBox } from 'react-native';

import { colors, P, Headline, layout } from '../common/styleguide';
import { Query } from '../types';
import urlWithQuery from '../util/urlWithQuery';
import { Button } from './Button';
import { Filter as FilterIcon } from './Icons';

type FiltersProps = {
  query: Query;
};

type FilterButtonProps = {
  query: Query;
  onPress: () => void;
  isFilterVisible: boolean;
};

const platforms = [
  {
    param: 'android',
    title: 'Android',
  },
  {
    param: 'expo',
    title: 'Expo Client',
  },
  {
    param: 'ios',
    title: 'iOS',
  },
  {
    param: 'macos',
    title: 'macOS',
  },
  {
    param: 'web',
    title: 'Web',
  },
  {
    param: 'windows',
    title: 'Windows',
  },
];

function ToggleLink({ query, paramName, title }) {
  let isSelected = !!query[paramName];

  return (
    <Link
      href={urlWithQuery('/', {
        ...query,
        [paramName]: !isSelected,
        offset: null,
      })}>
      <View style={styles.link}>
        <CheckBox
          value={isSelected}
          {...{
            color: colors.primaryDark,
            style: { marginRight: 6 },
          }}
        />
        <P>{title}</P>
      </View>
    </Link>
  );
}

export const FilterButton = (props: FilterButtonProps) => {
  const { isFilterVisible, query, onPress } = props;
  const params = [...platforms.map(platform => platform.param), 'maintained'];
  const filterCount = Object.keys(query).reduce(
    (acc, q) => (params.includes(q) ? acc + 1 : acc),
    0
  );

  return (
    <Button onPress={onPress} style={[styles.button, isFilterVisible && styles.activeButton]}>
      <>
        <View style={styles.displayHorizontal}>
          <View style={styles.iconContainer}>
            <FilterIcon
              fill={isFilterVisible ? colors.gray7 : colors.white}
              width={14}
              height={12}
            />
          </View>
          <P style={[styles.buttonText, isFilterVisible && styles.activeButtonText]}>
            Filters{filterCount > 0 ? `: ${filterCount}` : ''}
          </P>
        </View>
      </>
    </Button>
  );
};

export const Filters = (props: FiltersProps) => {
  const { query } = props;
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Headline style={styles.title}>Platform</Headline>
        <View style={styles.optionsContainer}>
          {platforms.map(platform => (
            <ToggleLink
              key={platform.param}
              query={query}
              paramName={platform.param}
              title={platform.title}
            />
          ))}
        </View>
      </View>
      <View style={styles.container}>
        <Headline style={styles.title}>Status</Headline>
        <View style={styles.optionsContainer}>
          <ToggleLink key="maintained" query={query} paramName="maintained" title="Maintained" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.gray1,
    paddingVertical: 8,
    flex: 1,
    alignItems: 'center',
  },
  container: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxWidth: layout.maxWidth,
  },
  optionsContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  title: {
    marginBottom: 8,
  },
  link: {
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
    marginRight: 16,
    marginVertical: 4,
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    height: 24,
    backgroundColor: colors.gray5,
    paddingHorizontal: 8,
  },
  activeButton: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    fontSize: 14,
    color: colors.white,
    marginLeft: 6,
    fontWeight: '500',
  },
  activeButtonText: {
    color: colors.gray7,
  },
  iconContainer: {
    top: 1,
  },
  displayHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

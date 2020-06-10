import * as React from 'react';
import { Platform, StyleSheet, View, CheckBox } from 'react-native';
import Link from 'next/link';
import { Query } from '../types';
import urlWithQuery from '../util/urlWithQuery';
import { colors, P, Headline, layout } from '../common/styleguide';
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
    param: 'ios',
    title: 'iOS',
  },
  {
    param: 'android',
    title: 'Android',
  },
  {
    param: 'web',
    title: 'Web',
  },
  {
    param: 'windows',
    title: 'Windows',
  },
  {
    param: 'macos',
    title: 'macOS',
  },
  {
    param: 'expo',
    title: 'Expo Client',
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
  const platformParams = platforms.map(platform => platform.param);
  const filterCount = Object.keys(query).reduce(
    (acc, q) => (platformParams.includes(q) ? acc + 1 : acc),
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
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.gray1,
    flex: 1,
    alignItems: 'center',
  },
  container: {
    width: '100%',
    padding: 16,
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
    fontSize: 14,
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

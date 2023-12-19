import Link from 'next/link';
import { useContext } from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';

import { Button } from './Button';
import { CheckBox } from './CheckBox';
import { Filter as FilterIcon } from './Icons';
import { colors, P, Headline, layout, darkColors } from '../common/styleguide';
import CustomAppearanceContext from '../context/CustomAppearanceContext';
import { Query } from '../types';
import urlWithQuery from '../util/urlWithQuery';

type FiltersProps = {
  query: Query;
  style?: ViewStyle | ViewStyle[];
  basePath?: string;
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
    title: 'Expo Go',
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
    param: 'tvos',
    title: 'tvOS',
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

const ToggleLink = ({ query, paramName, title, basePath = '/' }) => {
  const isSelected = !!query[paramName];

  return (
    <Link
      href={urlWithQuery(basePath, {
        ...query,
        [paramName]: !isSelected,
        offset: null,
      })}
      style={{ textDecoration: 'none' }}>
      <View style={styles.link}>
        <CheckBox value={isSelected} color={colors.primaryDark} />
        <P style={{ fontSize: 14 }}>{title}</P>
      </View>
    </Link>
  );
};

export const FilterButton = ({ isFilterVisible, query, onPress }: FilterButtonProps) => {
  const { isDark } = useContext(CustomAppearanceContext);

  const params = [
    ...platforms.map(platform => platform.param),
    'hasExample',
    'hasImage',
    'hasTypes',
    'isMaintained',
    'isPopular',
    'isRecommended',
    'wasRecentlyUpdated',
    'newArchitecture',
  ];

  const filterCount = Object.keys(query).reduce(
    (acc, q) => (params.includes(q) ? acc + 1 : acc),
    0
  );

  return (
    <Button
      onPress={onPress}
      style={[
        styles.button,
        { backgroundColor: isDark ? darkColors.border : colors.gray5 },
        isFilterVisible && styles.activeButton,
      ]}>
      <View style={styles.displayHorizontal}>
        <View style={styles.iconContainer}>
          <FilterIcon
            fill={isFilterVisible ? colors.gray7 : filterCount > 0 ? colors.primary : colors.white}
            width={14}
            height={12}
          />
        </View>
        <P style={[styles.buttonText, isFilterVisible && styles.activeButtonText]}>
          Filters{filterCount > 0 ? `: ${filterCount}` : ''}
        </P>
      </View>
    </Button>
  );
};

export const Filters = ({ query, style, basePath = '/' }: FiltersProps) => {
  const { isDark } = useContext(CustomAppearanceContext);
  const isMainSearch = basePath === '/';
  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: isDark ? darkColors.veryDark : colors.gray1,
        },
        style,
      ]}>
      <View style={styles.container}>
        <Headline style={styles.title}>Platform</Headline>
        <View style={styles.optionsContainer}>
          {platforms.map(platform => (
            <ToggleLink
              key={platform.param}
              query={query}
              paramName={platform.param}
              title={platform.title}
              basePath={basePath}
            />
          ))}
        </View>
      </View>
      <View style={styles.container}>
        <Headline style={styles.title}>Status</Headline>
        <View style={styles.optionsContainer}>
          <ToggleLink
            key="hasExample"
            query={query}
            paramName="hasExample"
            title="Has example"
            basePath={basePath}
          />
          <ToggleLink
            key="hasImage"
            query={query}
            paramName="hasImage"
            title="Has image preview"
            basePath={basePath}
          />
          <ToggleLink
            key="hasTypes"
            query={query}
            paramName="hasTypes"
            title="Has TypeScript types"
            basePath={basePath}
          />
          <ToggleLink
            key="newArchitecture"
            query={query}
            paramName="newArchitecture"
            title="Supports New Architecture"
            basePath={basePath}
          />
          {isMainSearch ? (
            <ToggleLink
              key="isMaintained"
              query={query}
              paramName="isMaintained"
              title="Maintained"
              basePath={basePath}
            />
          ) : null}
          {isMainSearch ? (
            <ToggleLink
              key="isPopular"
              query={query}
              paramName="isPopular"
              title="Popular"
              basePath={basePath}
            />
          ) : null}
          <ToggleLink
            key="wasRecentlyUpdated"
            query={query}
            paramName="wasRecentlyUpdated"
            title="Recently updated"
            basePath={basePath}
          />
          {isMainSearch ? (
            <ToggleLink
              key="isRecommended"
              query={query}
              paramName="isRecommended"
              title="Recommended"
              basePath={basePath}
            />
          ) : null}
        </View>
      </View>
      <View style={styles.container}>
        <Headline style={styles.title}>Type</Headline>
        <View style={styles.optionsContainer}>
          <ToggleLink
            key="skipLibs"
            query={query}
            paramName="skipLibs"
            title="Hide libraries"
            basePath={basePath}
          />
          <ToggleLink
            key="skipTools"
            query={query}
            paramName="skipTools"
            title="Hide development tools"
            basePath={basePath}
          />
          <ToggleLink
            key="skipTemplates"
            query={query}
            paramName="skipTemplates"
            title="Hide templates"
            basePath={basePath}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 8,
    flex: 1,
    flexGrow: 0,
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

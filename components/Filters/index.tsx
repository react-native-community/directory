import { useContext } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { colors, Headline, layout, darkColors } from '~/common/styleguide';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';
import { Query } from '~/types';
import { getPageQuery } from '~/util/search';

import { ToggleLink } from './ToggleLink';
import {
  FILTER_COMPATIBILITY,
  FILTER_PLATFORMS,
  FILTER_REQUIRES_MAIN_SEARCH,
  FILTER_STATUS,
} from './helpers';

type FiltersProps = {
  query: Query;
  style?: ViewStyle | ViewStyle[];
  basePath?: string;
};

export const Filters = ({ query, style, basePath = '/' }: FiltersProps) => {
  const { isDark } = useContext(CustomAppearanceContext);
  const isMainSearch = basePath === '/';
  const pageQuery = getPageQuery(basePath, query);

  const titleColor = {
    color: isDark ? darkColors.secondary : colors.gray5,
  };

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
        <Headline style={[styles.title, titleColor]}>Platform</Headline>
        <View style={styles.optionsContainer}>
          {FILTER_PLATFORMS.map(platform => (
            <ToggleLink
              key={platform.param}
              query={pageQuery}
              paramName={platform.param}
              title={platform.title}
              basePath={basePath}
            />
          ))}
        </View>
      </View>
      <View style={styles.container}>
        <Headline style={[styles.title, titleColor]}>Status</Headline>
        <View style={styles.optionsContainer}>
          {isMainSearch &&
            FILTER_REQUIRES_MAIN_SEARCH.map(platform => (
              <ToggleLink
                key={platform.param}
                query={pageQuery}
                paramName={platform.param}
                title={platform.title}
                basePath={basePath}
              />
            ))}
          {FILTER_STATUS.map(platform => (
            <ToggleLink
              key={platform.param}
              query={pageQuery}
              paramName={platform.param}
              title={platform.title}
              basePath={basePath}
            />
          ))}
        </View>
      </View>
      <View style={styles.twoColumns}>
        <View style={styles.wrappableContainer}>
          <Headline style={[styles.title, titleColor]}>Compatibility</Headline>
          <View style={styles.optionsContainer}>
            {FILTER_COMPATIBILITY.map(platform => (
              <ToggleLink
                key={platform.param}
                query={pageQuery}
                paramName={platform.param}
                title={platform.title}
                basePath={basePath}
              />
            ))}
          </View>
        </View>
        <View style={styles.wrappableContainer}>
          <Headline style={[styles.title, titleColor]}>Type</Headline>
          <View style={styles.optionsContainer}>
            <ToggleLink
              key="skipLibs"
              query={pageQuery}
              paramName="skipLibs"
              title="Hide libraries"
              basePath={basePath}
            />
            <ToggleLink
              key="skipTools"
              query={pageQuery}
              paramName="skipTools"
              title="Hide development tools"
              basePath={basePath}
            />
            <ToggleLink
              key="skipTemplates"
              query={pageQuery}
              paramName="skipTemplates"
              title="Hide templates"
              basePath={basePath}
            />
          </View>
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
  wrappableContainer: {
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
    fontWeight: 600,
  },
  twoColumns: {
    width: '100%',
    maxWidth: layout.maxWidth,
    alignContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

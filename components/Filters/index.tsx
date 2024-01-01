import { useContext } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { ToggleLink } from './ToggleLink';
import { FILTER_PLATFORMS } from './helpers';
import { colors, Headline, layout, darkColors } from '../../common/styleguide';
import CustomAppearanceContext from '../../context/CustomAppearanceContext';
import { Query } from '../../types';

type FiltersProps = {
  query: Query;
  style?: ViewStyle | ViewStyle[];
  basePath?: string;
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
          {FILTER_PLATFORMS.map(platform => (
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
});

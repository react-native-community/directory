import { useContext } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { ToggleLink } from './ToggleLink';
import { FILTER_PLATFORMS } from './helpers';
import { colors, Headline, layout, darkColors } from '../../common/styleguide';
import CustomAppearanceContext from '../../context/CustomAppearanceContext';
import { Query } from '../../types';
import { getPageQuery } from '../../util/search';

type FiltersProps = {
  query: Query;
  style?: ViewStyle | ViewStyle[];
  basePath?: string;
};

export const Filters = ({ query, style, basePath = '/' }: FiltersProps) => {
  const { isDark } = useContext(CustomAppearanceContext);
  const isMainSearch = basePath === '/';
  const pageQuery = getPageQuery(basePath, query);

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
              query={pageQuery}
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
            query={pageQuery}
            paramName="hasExample"
            title="Has example"
            basePath={basePath}
          />
          <ToggleLink
            key="hasImage"
            query={pageQuery}
            paramName="hasImage"
            title="Has image preview"
            basePath={basePath}
          />
          <ToggleLink
            key="hasTypes"
            query={pageQuery}
            paramName="hasTypes"
            title="Has TypeScript types"
            basePath={basePath}
          />
          <ToggleLink
            key="newArchitecture"
            query={pageQuery}
            paramName="newArchitecture"
            title="Supports New Architecture"
            basePath={basePath}
          />
          {isMainSearch && (
            <ToggleLink
              key="isMaintained"
              query={pageQuery}
              paramName="isMaintained"
              title="Maintained"
              basePath={basePath}
            />
          )}
          {isMainSearch && (
            <ToggleLink
              key="isPopular"
              query={pageQuery}
              paramName="isPopular"
              title="Popular"
              basePath={basePath}
            />
          )}
          <ToggleLink
            key="wasRecentlyUpdated"
            query={pageQuery}
            paramName="wasRecentlyUpdated"
            title="Recently updated"
            basePath={basePath}
          />
          {isMainSearch && (
            <ToggleLink
              key="isRecommended"
              query={pageQuery}
              paramName="isRecommended"
              title="Recommended"
              basePath={basePath}
            />
          )}
        </View>
      </View>
      <View style={styles.container}>
        <Headline style={styles.title}>Type</Headline>
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

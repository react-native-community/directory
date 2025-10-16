import { useContext } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { colors, Headline, layout, darkColors, useLayout } from '~/common/styleguide';
import { Tag } from '~/components/Tag';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';
import { type Query } from '~/types';
import { getPageQuery } from '~/util/search';

import { ToggleLink } from './ToggleLink';
import {
  FILTER_COMPATIBILITY,
  FILTER_PLATFORMS,
  FILTER_REQUIRES_MAIN_SEARCH,
  FILTER_STATUS,
  FILTER_MODULE_TYPE,
  FILTER_TYPE,
} from './helpers';

type FiltersProps = {
  query: Query;
  style?: ViewStyle | ViewStyle[];
  basePath?: string;
};

export function Filters({ query, style, basePath = '/' }: FiltersProps) {
  const { isDark } = useContext(CustomAppearanceContext);
  const { isSmallScreen } = useLayout();
  const pageQuery = getPageQuery(basePath, query);

  const isMainSearch = basePath === '/';

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
            FILTER_REQUIRES_MAIN_SEARCH.map(status => (
              <ToggleLink
                key={status.param}
                query={pageQuery}
                paramName={status.param}
                title={status.title}
                basePath={basePath}
              />
            ))}
          {FILTER_STATUS.map(status => (
            <ToggleLink
              key={status.param}
              query={pageQuery}
              paramName={status.param}
              title={status.title}
              basePath={basePath}
            />
          ))}
        </View>
      </View>
      <View style={styles.twoColumns}>
        <View
          style={[
            styles.wrappableContainer,
            isSmallScreen && styles.wrappableContainerSmallScreen,
          ]}>
          <Headline style={[styles.title, titleColor]}>Compatibility</Headline>
          <View style={styles.optionsContainer}>
            {FILTER_COMPATIBILITY.map(compatibility => (
              <ToggleLink
                key={compatibility.param}
                query={pageQuery}
                paramName={compatibility.param}
                title={compatibility.title}
                basePath={basePath}
              />
            ))}
          </View>
        </View>
        <View
          style={[
            styles.wrappableContainer,
            isSmallScreen && styles.wrappableContainerSmallScreen,
          ]}>
          <Headline style={[styles.title, titleColor]}>Type</Headline>
          <View style={styles.optionsContainer}>
            {FILTER_TYPE.map(entryType => (
              <ToggleLink
                key={entryType.param}
                query={pageQuery}
                paramName={entryType.param}
                title={entryType.title}
                basePath={basePath}
              />
            ))}
          </View>
        </View>
        <View style={styles.container}>
          <Headline style={[styles.titleWithTag, titleColor]}>
            Module type
            <Tag
              label="Experimental"
              tagStyle={[
                styles.titleTag,
                {
                  backgroundColor: isDark ? '#261a3d' : '#ece3fc',
                  borderColor: isDark ? '#3d2861' : '#d9c8fa',
                },
              ]}
              icon={null}
            />
          </Headline>
          <View style={styles.optionsContainer}>
            {FILTER_MODULE_TYPE.map(moduleType => (
              <ToggleLink
                key={moduleType.param}
                query={pageQuery}
                paramName={moduleType.param}
                title={moduleType.title}
                basePath={basePath}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

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
  wrappableContainerSmallScreen: {
    maxWidth: '100%',
  },
  optionsContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  title: {
    marginBottom: 8,
    fontWeight: 600,
  },
  titleWithTag: {
    marginBottom: 4,
    fontWeight: 600,
  },
  titleTag: {
    marginLeft: 8,
    top: -1,
    paddingVertical: 0,
    minHeight: 22,
  },
  twoColumns: {
    width: '100%',
    maxWidth: layout.maxWidth,
    alignContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

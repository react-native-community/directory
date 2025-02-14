import dynamic from 'next/dynamic';
import { createElement, useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { A, colors, darkColors, H3, P } from '../../common/styleguide';
import CustomAppearanceContext from '../../context/CustomAppearanceContext';
import { Library as LibraryType, Query } from '../../types';
import urlWithQuery from '../../util/urlWithQuery';
import LoadingContent from '../Library/LoadingContent';

const LibraryWithLoading = dynamic(() => import('../Library'), {
  loading: () => (
    <LoadingContent
      width="48.25%"
      height={210}
      wrapperStyle={{
        marginLeft: '0.75%',
        marginRight: '0.75%',
      }}
    />
  ),
});

type ExploreSectionProps = {
  data: LibraryType[];
  title: string;
  filter: (library: LibraryType) => boolean;
  icon?: any;
  count?: number;
  queryParams?: Query;
};

const UPDATED_IN = 1000 * 60 * 60 * 24 * 90; // 90 days

const DEFAULT_PARAMS: Query = {
  wasRecentlyUpdated: 'true',
  isMaintained: 'true',
  order: 'popularity',
};

const renderLibs = (list: LibraryType[], count = 4) => {
  const now = new Date().getTime();
  return (
    <View style={styles.librariesContainer}>
      {list
        .filter(lib => now - new Date(lib.github.stats.updatedAt).getTime() < UPDATED_IN)
        .splice(0, count)
        .map((item: LibraryType, index: number) => (
          <LibraryWithLoading
            key={`explore-item-${index}-${item.github.name}`}
            library={item}
            showTrendingMark
            skipMetadata
          />
        ))}
    </View>
  );
};

const ExploreSection = ({
  data,
  title,
  filter,
  icon,
  count = 4,
  queryParams = { [title.toLowerCase()]: true },
}: ExploreSectionProps) => {
  const { isDark } = useContext(CustomAppearanceContext);
  const color = isDark ? darkColors.pewter : colors.gray5;
  const hoverColor = isDark ? colors.gray5 : colors.gray4;
  const hashLink = title.replace(/\s/g, '').toLowerCase();

  return (
    <>
      <H3 style={styles.subHeader} id={hashLink}>
        {icon && createElement(icon, { fill: color, width: 30, height: 30 })}
        <A
          href={`#${hashLink}`}
          target="_self"
          style={[styles.subHeaderTitle, { color }]}
          hoverStyle={{ color: hoverColor }}>
          {title}
        </A>
      </H3>
      <View style={styles.librariesContainer}>{renderLibs(data.filter(filter), count)}</View>
      <P style={[styles.note, { color: isDark ? darkColors.secondary : colors.gray5 }]}>
        Want to see more? Check out other{' '}
        <A href={urlWithQuery('/', { ...queryParams, ...DEFAULT_PARAMS })} target="_self">
          {title} libraries
        </A>{' '}
        in the directory!
      </P>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  librariesContainer: {
    paddingVertical: 4,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  subHeader: {
    display: 'flex',
    gap: 16,
    marginHorizontal: 8,
    marginVertical: 16,
    alignItems: 'center',
  },
  subHeaderTitle: {
    fontSize: 26,
    fontWeight: 700,
    textDecorationLine: 'none',
    backgroundColor: 'transparent',
  },
  note: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
    fontSize: 14,
  },
});

export default ExploreSection;

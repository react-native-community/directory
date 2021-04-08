import { NextPageContext } from 'next';
import dynamic from 'next/dynamic';
import React, { useContext } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { A, H4, colors, darkColors, P } from '../common/styleguide';
import ContentContainer from '../components/ContentContainer';
import { Filters } from '../components/Filters';
import LoadingContent from '../components/Library/LoadingContent';
import Navigation from '../components/Navigation';
import CustomAppearanceContext from '../context/CustomAppearanceContext';
import { Library as LibraryType } from '../types';
import getApiUrl from '../util/getApiUrl';
import urlWithQuery from '../util/urlWithQuery';

const LibraryWithLoading = dynamic(() => import('../components/Library'), {
  loading: () => <LoadingContent />,
});

const Trending = ({ data, query }) => {
  const { isDark } = useContext(CustomAppearanceContext);
  return (
    <>
      <Navigation
        title="Trending libraries"
        description="See the libraries that are trending today."
      />
      <ContentContainer style={styles.container}>
        <Filters query={query} basePath="/trending" style={styles.filtersWrapper} />
        {data.length ? (
          data.map((item: LibraryType, index: number) => (
            <LibraryWithLoading
              key={`list-item-${index}-${item.github.name}`}
              library={item}
              showPopularity
            />
          ))
        ) : (
          <View style={styles.noResultWrapper}>
            <Image style={styles.noResultImg} source={require('../assets/notfound.png')} />
            <H4>Nothing was found!</H4>
          </View>
        )}
        <P style={[styles.note, { color: isDark ? darkColors.secondary : colors.gray5 }]}>
          Unfortunately that's all, what's trending now. Want to explore more libraries? Check out
          the{' '}
          <A href={urlWithQuery('/', {})} target="_self">
            directory home page
          </A>
          .
        </P>
      </ContentContainer>
    </>
  );
};

Trending.getInitialProps = async (ctx: NextPageContext) => {
  let url = getApiUrl(
    urlWithQuery('/libraries', {
      ...ctx.query,
      ...{ limit: 9999, minPopularity: 5, order: 'popularity' },
    }),
    ctx
  );
  let response = await fetch(url);
  let result = await response.json();

  return {
    data: result.libraries,
    query: ctx.query,
  };
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filtersWrapper: {
    backgroundColor: 'transparent',
    marginBottom: 16,
    paddingTop: 0,
  },
  note: {
    padding: 24,
    fontSize: 14,
  },
  noResultWrapper: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 42,
  },
  noResult: {
    marginTop: 12,
  },
  noResultImg: {
    width: 64,
    height: 64,
  },
});

export default Trending;

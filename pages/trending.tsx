import { NextPageContext } from 'next';
import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';

import { A, colors, darkColors, P } from '../common/styleguide';
import ContentContainer from '../components/ContentContainer';
import ExploreNav from '../components/Explore/ExploreNav';
import { Filters } from '../components/Filters';
import Library from '../components/Library';
import CustomAppearanceContext from '../context/CustomAppearanceContext';
import { Library as LibraryType } from '../types';
import getApiUrl from '../util/getApiUrl';
import urlWithQuery from '../util/urlWithQuery';

const Trending = ({ data, query }) => {
  const { isDark } = useContext(CustomAppearanceContext);
  return (
    <>
      <ExploreNav
        title="Trending libraries"
        description="See which libraries are trending today, refine the list by your needs!"
      />
      <ContentContainer style={styles.container}>
        <Filters query={query} basePath="/trending" style={styles.filtersWrapper} />
        {data.map((item: LibraryType, index: number) => (
          <Library key={`list-item-${index}-${item.github.name}`} library={item} showPopularity />
        ))}
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
      ...{ limit: 9999, minPopularity: 2.5, order: 'popularity' },
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
});

export default Trending;

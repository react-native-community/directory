import { NextPageContext } from 'next';
import React from 'react';
import { StyleSheet } from 'react-native';

import ContentContainer from '../components/ContentContainer';
import ExploreNav from '../components/Explore/ExploreNav';
import { Filters } from '../components/Filters';
import Library from '../components/Library';
import getApiUrl from '../util/getApiUrl';
import urlWithQuery from '../util/urlWithQuery';

const Trending = ({ data, query }) => {
  return (
    <>
      <ExploreNav
        title="Trending libraries"
        description="See which libraries are trending today, refine the list by your needs!"
      />
      <ContentContainer style={styles.container}>
        <Filters query={query} basePath="/trending" style={styles.filtersWrapper} />
        {data.map((item: any, index: number) => (
          <Library key={`list-item-${index}-${item.github.name}`} library={item} showPopularity />
        ))}
      </ContentContainer>
    </>
  );
};

Trending.getInitialProps = async (ctx: NextPageContext) => {
  let url = getApiUrl(
    urlWithQuery('/libraries', { ...ctx.query, ...{ limit: 20, order: 'popularity' } }),
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
});

export default Trending;

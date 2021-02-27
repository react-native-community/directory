import fetch from 'isomorphic-fetch';
import { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { StyleSheet } from 'react-native';

import ContentContainer from '../components/ContentContainer';
import Libraries from '../components/Libraries';
import Pagination from '../components/Pagination';
import Search from '../components/Search';
import getApiUrl from '../util/getApiUrl';
import urlWithQuery from '../util/urlWithQuery';

const Index = ({ data, query }) => {
  const router = useRouter();
  const total = data && data.total;
  return (
    <>
      <Search query={router.query} total={total} />
      <ContentContainer style={styles.container}>
        <Pagination query={query} total={total} />
        <Libraries libraries={data && data.libraries} />
        <Pagination query={query} total={total} />
      </ContentContainer>
    </>
  );
};

Index.getInitialProps = async (ctx: NextPageContext) => {
  let url = getApiUrl(urlWithQuery('/libraries', ctx.query), ctx);
  let response = await fetch(url);
  let result = await response.json();

  return {
    data: result,
    query: ctx.query,
  };
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

export default Index;

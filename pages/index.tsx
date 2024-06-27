import fetch from 'isomorphic-fetch';
import { NextPageContext } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { View, StyleSheet } from 'react-native';

import ContentContainer from '../components/ContentContainer';
import LoadingContent from '../components/Library/LoadingContent';
import Navigation from '../components/Navigation';
import PageMeta from '../components/PageMeta';
import Pagination from '../components/Pagination';
import Search from '../components/Search';
import { StructuredData } from '../components/StructuredData';
import getApiUrl from '../util/getApiUrl';
import urlWithQuery from '../util/urlWithQuery';

const LibrariesWithLoading = dynamic(() => import('../components/Libraries'), {
  loading: () => (
    <View
      style={{
        paddingTop: 12,
      }}>
      <LoadingContent />
      <LoadingContent />
      <LoadingContent />
      <LoadingContent />
      <LoadingContent />
      <LoadingContent />
      <LoadingContent />
      <LoadingContent />
    </View>
  ),
});

const Index = ({ data, query }) => {
  const router = useRouter();
  const total = data && data.total;
  return (
    <>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'React Native Directory',
          url: 'https://reactnative.directory/',
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://reactnative.directory/?search={search_term_string}',
            },
            'query-input': 'required name=search_term_string',
          },
        }}
      />
      <PageMeta query={router.query?.search} />
      <Navigation noHeader />
      <Search query={router.query} total={total} />
      <ContentContainer style={styles.container}>
        <Pagination query={query} total={total} />
        <LibrariesWithLoading libraries={data && data.libraries} />
        <Pagination query={query} total={total} />
      </ContentContainer>
    </>
  );
};

Index.getInitialProps = async (ctx: NextPageContext) => {
  const url = getApiUrl(urlWithQuery('/libraries', ctx.query), ctx);
  const response = await fetch(url);
  const result = await response.json();

  return {
    data: result,
    query: ctx.query,
  };
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

export default Index;

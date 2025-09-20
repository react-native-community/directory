import { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import { type ParsedUrlQuery } from 'node:querystring';
import { StyleSheet } from 'react-native';

import ContentContainer from '~/components/ContentContainer';
import Libraries from '~/components/Libraries';
import Navigation from '~/components/Navigation';
import PageMeta from '~/components/PageMeta';
import Pagination from '~/components/Pagination';
import Search from '~/components/Search';
import { type APIResponseType } from '~/types';
import getApiUrl from '~/util/getApiUrl';
import urlWithQuery from '~/util/urlWithQuery';

type Props = {
  data: APIResponseType;
  query: ParsedUrlQuery;
};

const Index = ({ data, query }: Props) => {
  const router = useRouter();
  const total = data.total ?? 0;
  return (
    <>
      <PageMeta searchQuery={router.query?.search} />
      <Navigation noHeader />
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
  const url = getApiUrl(urlWithQuery('/libraries', ctx.query), ctx);
  const response = await fetch(url);
  const result: APIResponseType = await response.json();

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

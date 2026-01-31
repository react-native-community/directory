import { type NextPageContext } from 'next';
import { useRouter } from 'next/router';
import { type ParsedUrlQuery } from 'node:querystring';

import ContentContainer from '~/components/ContentContainer';
import Navigation from '~/components/Navigation';
import PageMeta from '~/components/PageMeta';
import Pagination from '~/components/Pagination';
import Search from '~/components/Search';
import Templates from '~/components/Templates';
import { type APITemplatesResponseType } from '~/types';
import getApiUrl from '~/util/getApiUrl';
import tw from '~/util/tailwind';
import urlWithQuery from '~/util/urlWithQuery';

type Props = {
  data: APITemplatesResponseType;
  query: ParsedUrlQuery;
};

function TemplatesPage({ data, query }: Props) {
  const router = useRouter();
  const total = data.total ?? 0;

  return (
    <>
      <PageMeta searchQuery={router.query?.search} />
      <Navigation header={<Search query={router.query} total={total} endpoint="/templates" />} />
      <ContentContainer style={tw`px-4 py-3`}>
        <Pagination query={query} total={total} />
        <Templates templates={data && data.templates} />
        <Pagination query={query} total={total} />
      </ContentContainer>
    </>
  );
}

TemplatesPage.getInitialProps = async (ctx: NextPageContext) => {
  const url = getApiUrl(urlWithQuery('/templates', ctx.query), ctx);

  const response = await fetch(url);
  const result: APITemplatesResponseType = await response.json();

  return {
    data: result,
    query: ctx.query,
  };
};

export default TemplatesPage;

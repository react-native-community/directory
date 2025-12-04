import { type NextPageContext } from 'next';

import PopularScene from '~/scenes/PopularScene';
import { type APIResponseType } from '~/types';
import { type PopularPageProps } from '~/types/pages';
import getApiUrl from '~/util/getApiUrl';
import urlWithQuery from '~/util/urlWithQuery';

function PopularPage({ data }: PopularPageProps) {
  return <PopularScene data={data} />;
}

PopularPage.getInitialProps = async (ctx: NextPageContext) => {
  const url = getApiUrl(
    urlWithQuery('/libraries', {
      limit: '9999',
      minPopularity: '15',
      order: 'popularity',
      skipTools: 'true',
      skipTemplates: 'true',
    }),
    ctx
  );
  const response = await fetch(url);
  const result: APIResponseType = await response.json();

  return {
    data: result.libraries,
  };
};

export default PopularPage;

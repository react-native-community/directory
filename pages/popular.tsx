import { type NextPageContext } from 'next';

import PopularScene from '~/scenes/PopularScene';
import { type PopularPageProps } from '~/types/pages';
import { POPULAR_QUERY_BASE } from '~/util/Constants';
import { ssrFetch } from '~/util/SSRFetch';

function PopularPage(props: PopularPageProps) {
  return <PopularScene {...props} />;
}

const DEFAULT_QUERY = {
  ...POPULAR_QUERY_BASE,
  limit: '4',
};

PopularPage.getInitialProps = async (ctx: NextPageContext) => {
  const coreResponse = await ssrFetch(
    '/libraries',
    { ...DEFAULT_QUERY, limit: '8', android: 'true', ios: 'true' },
    ctx
  );
  const androidResponse = await ssrFetch(
    '/libraries',
    { ...DEFAULT_QUERY, android: 'true', ios: 'false' },
    ctx
  );
  const iosResponse = await ssrFetch(
    '/libraries',
    { ...DEFAULT_QUERY, ios: 'true', android: 'false' },
    ctx
  );
  const webResponse = await ssrFetch('/libraries', { ...DEFAULT_QUERY, web: 'true' }, ctx);
  const macosResponse = await ssrFetch('/libraries', { ...DEFAULT_QUERY, macos: 'true' }, ctx);
  const tvosResponse = await ssrFetch('/libraries', { ...DEFAULT_QUERY, tvos: 'true' }, ctx);
  const visionosResponse = await ssrFetch(
    '/libraries',
    { ...DEFAULT_QUERY, visionos: 'true' },
    ctx
  );
  const windowsResponse = await ssrFetch('/libraries', { ...DEFAULT_QUERY, windows: 'true' }, ctx);
  const expoGoResponse = await ssrFetch('/libraries', { ...DEFAULT_QUERY, expoGo: 'true' }, ctx);
  const fireosResponse = await ssrFetch('/libraries', { ...DEFAULT_QUERY, fireos: 'true' }, ctx);
  const horizonResponse = await ssrFetch('/libraries', { ...DEFAULT_QUERY, horizon: 'true' }, ctx);
  const vegaosResponse = await ssrFetch('/libraries', { ...DEFAULT_QUERY, vegaos: 'true' }, ctx);

  return {
    core: await coreResponse.json(),
    android: await androidResponse.json(),
    ios: await iosResponse.json(),
    web: await webResponse.json(),
    macos: await macosResponse.json(),
    tvos: await tvosResponse.json(),
    visionos: await visionosResponse.json(),
    windows: await windowsResponse.json(),
    expoGo: await expoGoResponse.json(),
    fireos: await fireosResponse.json(),
    horizon: await horizonResponse.json(),
    vegaos: await vegaosResponse.json(),
  };
};

export default PopularPage;

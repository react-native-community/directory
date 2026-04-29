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
  const [
    coreResponse,
    androidResponse,
    iosResponse,
    webResponse,
    macosResponse,
    tvosResponse,
    visionosResponse,
    windowsResponse,
    expoGoResponse,
    fireosResponse,
    horizonResponse,
    vegaosResponse,
  ] = await Promise.all([
    ssrFetch('/libraries', { ...DEFAULT_QUERY, limit: '8', android: 'true', ios: 'true' }, ctx),
    ssrFetch('/libraries', { ...DEFAULT_QUERY, android: 'true', ios: 'false' }, ctx),
    ssrFetch('/libraries', { ...DEFAULT_QUERY, ios: 'true', android: 'false' }, ctx),
    ssrFetch('/libraries', { ...DEFAULT_QUERY, web: 'true' }, ctx),
    ssrFetch('/libraries', { ...DEFAULT_QUERY, macos: 'true' }, ctx),
    ssrFetch('/libraries', { ...DEFAULT_QUERY, tvos: 'true' }, ctx),
    ssrFetch('/libraries', { ...DEFAULT_QUERY, visionos: 'true' }, ctx),
    ssrFetch('/libraries', { ...DEFAULT_QUERY, windows: 'true' }, ctx),
    ssrFetch('/libraries', { ...DEFAULT_QUERY, expoGo: 'true' }, ctx),
    ssrFetch('/libraries', { ...DEFAULT_QUERY, fireos: 'true' }, ctx),
    ssrFetch('/libraries', { ...DEFAULT_QUERY, horizon: 'true' }, ctx),
    ssrFetch('/libraries', { ...DEFAULT_QUERY, vegaos: 'true' }, ctx),
  ]);

  const [core, android, ios, web, macos, tvos, visionos, windows, expoGo, fireos, horizon, vegaos] =
    await Promise.all([
      coreResponse.json(),
      androidResponse.json(),
      iosResponse.json(),
      webResponse.json(),
      macosResponse.json(),
      tvosResponse.json(),
      visionosResponse.json(),
      windowsResponse.json(),
      expoGoResponse.json(),
      fireosResponse.json(),
      horizonResponse.json(),
      vegaosResponse.json(),
    ]);

  return {
    core,
    android,
    ios,
    web,
    macos,
    tvos,
    visionos,
    windows,
    expoGo,
    fireos,
    horizon,
    vegaos,
  };
};

export default PopularPage;

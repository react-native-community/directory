import fetch from 'cross-fetch';
import { NextPageContext } from 'next';
import { StyleSheet } from 'react-native';

import ContentContainer from '~/components/ContentContainer';
import ExploreSection from '~/components/Explore/ExploreSection';
import {
  PlatformAndroid,
  PlatformExpo,
  PlatformIOS,
  PlatformMacOS,
  PlatformTvOS,
  PlatformVisionOS,
  PlatformWeb,
  PlatformWindows,
  ReactLogo,
} from '~/components/Icons';
import Navigation from '~/components/Navigation';
import PageMeta from '~/components/PageMeta';
import getApiUrl from '~/util/getApiUrl';
import urlWithQuery from '~/util/urlWithQuery';

const Popular = ({ data }) => {
  return (
    <>
      <PageMeta
        title="Popular libraries"
        description="Browse most popular recently libraries by platform"
        path="popular"
      />
      <Navigation
        title="Popular libraries"
        description="Browse most popular recently libraries by platform."
      />
      <ContentContainer style={styles.container}>
        <ExploreSection
          title="Core platforms"
          icon={ReactLogo}
          data={data}
          filter={lib => lib.android === true && lib.ios === true}
          count={8}
          queryParams={{ android: 'true', ios: 'true' }}
        />
        <ExploreSection
          title="Android"
          icon={PlatformAndroid}
          data={data}
          filter={lib => lib.android === true && !lib.ios}
        />
        <ExploreSection
          title="iOS"
          icon={PlatformIOS}
          data={data}
          filter={lib => lib.ios === true && !lib.android}
        />
        <ExploreSection
          title="Web"
          icon={PlatformWeb}
          data={data}
          filter={lib => lib.web === true}
        />
        <ExploreSection
          title="macOS"
          icon={PlatformMacOS}
          data={data}
          filter={lib => lib.macos === true}
        />
        <ExploreSection
          title="tvOS"
          icon={PlatformTvOS}
          data={data}
          filter={lib => lib.tvos === true}
        />
        <ExploreSection
          title="visionOS"
          icon={PlatformVisionOS}
          data={data}
          filter={lib => lib.visionos === true}
        />
        <ExploreSection
          title="Windows"
          icon={PlatformWindows}
          data={data}
          filter={lib => lib.windows === true}
        />
        <ExploreSection
          title="Expo Go"
          icon={PlatformExpo}
          data={data}
          filter={lib => lib.expoGo === true}
        />
        <ExploreSection title="Fire OS" data={data} filter={lib => lib.fireos === true} />
      </ContentContainer>
    </>
  );
};

Popular.getInitialProps = async (ctx: NextPageContext) => {
  const url = getApiUrl(
    urlWithQuery('/libraries', { limit: 9999, minPopularity: 0, order: 'popularity' }),
    ctx
  );
  const response = await fetch(url);
  const result = await response.json();

  return {
    data: result.libraries,
    query: ctx.query,
  };
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingHorizontal: 8,
    paddingBottom: 12,
  },
});

export default Popular;

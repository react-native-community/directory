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
import { type PopularPageProps } from '~/types/pages';
import tw from '~/util/tailwind';

export default function PopularScene({ data }: PopularPageProps) {
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
      <ContentContainer style={tw`px-2 py-4`}>
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
        <ExploreSection title="Vega OS" data={data} filter={lib => !!lib.vegaos} />
      </ContentContainer>
    </>
  );
}

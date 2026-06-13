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

export default function PopularScene({
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
  vegaos,
}: PopularPageProps) {
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
        <ExploreSection title="Core platforms" icon={ReactLogo} data={core.libraries} />
        <ExploreSection
          title="Android"
          icon={PlatformAndroid}
          data={android.libraries}
          queryParams={{ ios: 'false' }}
        />
        <ExploreSection
          title="iOS"
          icon={PlatformIOS}
          data={ios.libraries}
          queryParams={{ android: 'false' }}
        />
        <ExploreSection title="Web" icon={PlatformWeb} data={web.libraries} />
        <ExploreSection title="macOS" icon={PlatformMacOS} data={macos.libraries} />
        <ExploreSection title="tvOS" icon={PlatformTvOS} data={tvos.libraries} />
        <ExploreSection title="visionOS" icon={PlatformVisionOS} data={visionos.libraries} />
        <ExploreSection title="Windows" icon={PlatformWindows} data={windows.libraries} />
        <ExploreSection title="Expo Go" icon={PlatformExpo} data={expoGo.libraries} />
        <ExploreSection title="Fire OS" data={fireos.libraries} />
        <ExploreSection title="Meta Horizon OS" data={expoGo.libraries} />
        <ExploreSection title="Vega OS" data={vegaos.libraries} />
      </ContentContainer>
    </>
  );
}

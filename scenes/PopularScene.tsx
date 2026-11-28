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
  harmony,
  horizon,
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
        <ExploreSection
          title="Core platforms"
          icon={ReactLogo}
          data={core.libraries}
          queryParams={{ android: 'true', ios: 'true' }}
        />
        <ExploreSection
          title="Android"
          icon={PlatformAndroid}
          data={android.libraries}
          queryParams={{ android: 'true', ios: 'false' }}
        />
        <ExploreSection
          title="iOS"
          icon={PlatformIOS}
          data={ios.libraries}
          queryParams={{ ios: 'true', android: 'false' }}
        />
        <ExploreSection
          title="Web"
          icon={PlatformWeb}
          data={web.libraries}
          queryParams={{ web: 'true' }}
        />
        <ExploreSection
          title="macOS"
          icon={PlatformMacOS}
          data={macos.libraries}
          queryParams={{ macos: 'true' }}
        />
        <ExploreSection
          title="tvOS"
          icon={PlatformTvOS}
          data={tvos.libraries}
          queryParams={{ tvos: 'true' }}
        />
        <ExploreSection
          title="visionOS"
          icon={PlatformVisionOS}
          data={visionos.libraries}
          queryParams={{ visionos: 'true' }}
        />
        <ExploreSection
          title="Windows"
          icon={PlatformWindows}
          data={windows.libraries}
          queryParams={{ windows: 'true' }}
        />
        <ExploreSection
          title="Expo Go"
          icon={PlatformExpo}
          data={expoGo.libraries}
          queryParams={{ expoGo: 'true' }}
        />
        <ExploreSection title="Fire OS" data={fireos.libraries} queryParams={{ fireos: 'true' }} />
        {harmony.libraries.length >= 2 && (
          <ExploreSection
            title="HarmonyOS"
            data={harmony.libraries}
            queryParams={{ harmony: 'true' }}
          />
        )}
        {horizon.libraries.length >= 2 && (
          <ExploreSection
            title="Meta Horizon OS"
            data={horizon.libraries}
            queryParams={{ horizon: 'true' }}
          />
        )}
        <ExploreSection title="Vega OS" data={vegaos.libraries} queryParams={{ vegaos: 'true' }} />
      </ContentContainer>
    </>
  );
}

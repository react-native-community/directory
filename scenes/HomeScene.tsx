import { useRouter } from 'next/router';
import { View } from 'react-native';

import { A, H4, P, useLayout } from '~/common/styleguide';
import ContentContainer from '~/components/ContentContainer';
import HomeSection from '~/components/Home/HomeSection';
import PlatformRow from '~/components/Home/PlatformRow';
import {
  Calendar,
  Download,
  PlatformAndroid,
  PlatformIOS,
  PlatformMacOS,
  PlatformTvOS,
  PlatformVisionOS,
  PlatformWeb,
  PlatformWindows,
  Plus,
  Star,
} from '~/components/Icons';
import Navigation from '~/components/Navigation';
import PageMeta from '~/components/PageMeta';
import Search from '~/components/Search';
import { type HomePageProps } from '~/types/pages';
import tw from '~/util/tailwind';
import urlWithQuery from '~/util/urlWithQuery';

export default function HomeScene({
  mostDownloaded,
  recentlyAdded,
  recentlyUpdated,
  popular,
  statistic,
}: HomePageProps) {
  const router = useRouter();
  const { isSmallScreen } = useLayout();

  return (
    <>
      <PageMeta />
      <Navigation
        title="React Native packages registry"
        description="Browse thousands of open-source packages and find the best ones for your current or next project.">
        <Search
          query={router.query}
          total={statistic.total}
          style={tw`bg-transparent w-[600px] max-w-full self-center`}
          isHomePage
        />
      </Navigation>
      <ContentContainer style={[tw`px-4 py-5`, isSmallScreen && tw`pt-2`]}>
        <View style={[tw`flex-row flex-1 gap-1`, isSmallScreen && tw`flex-col`]}>
          <View style={tw`flex-1 px-2`}>
            <H4
              style={tw`flex gap-3 pt-3 pb-2 items-center font-medium text-secondary dark:text-pewter`}>
              Discover by platform
            </H4>
            <View
              style={[
                tw`min-h-[194px] px-4 py-3 gap-1 mb-4 border rounded-md border-palette-gray2 dark:border-default`,
                isSmallScreen && tw`min-h-0`,
              ]}>
              <PlatformRow platform="Android" count={statistic.android} Icon={PlatformAndroid} />
              <PlatformRow platform="iOS" count={statistic.ios} Icon={PlatformIOS} />
              <PlatformRow platform="macOS" count={statistic.macos} Icon={PlatformMacOS} />
              <PlatformRow platform="tvOS" count={statistic.tvos} Icon={PlatformTvOS} />
              <PlatformRow platform="visionOS" count={statistic.visionos} Icon={PlatformVisionOS} />
              <PlatformRow platform="Web" count={statistic.web} Icon={PlatformWeb} />
              <PlatformRow platform="Windows" count={statistic.windows} Icon={PlatformWindows} />
            </View>
          </View>
          <View style={tw`flex-1 px-2`}>
            <H4
              style={tw`flex gap-3 pt-3 pb-2 items-center font-medium text-secondary dark:text-pewter`}>
              Explore topics
            </H4>
            <View
              style={[
                tw`min-h-[194px] flex-row flex-wrap gap-x-3 gap-y-1.5 justify-center content-center px-4 py-3 mb-4 border rounded-md border-palette-gray2 dark:border-default`,
                isSmallScreen && tw`min-h-0`,
              ]}>
              <A href={urlWithQuery('/packages', { search: 'animation' })}>Animation</A>
              <A href={urlWithQuery('/packages', { search: 'audio' })}>Audio</A>
              <A href={urlWithQuery('/packages', { search: 'authentication' })}>Authentication</A>
              <A href={urlWithQuery('/packages', { search: 'camera' })}>Camera</A>
              <A href={urlWithQuery('/packages', { search: 'chart' })}>Charts</A>
              <A href={urlWithQuery('/packages', { search: 'color' })}>Color</A>
              <A href={urlWithQuery('/packages', { search: 'validation' })}>Data validation</A>
              <A href={urlWithQuery('/packages', { skipLibs: 'true', skipTemplates: 'true' })}>
                Development Tools
              </A>
              <A href={urlWithQuery('/packages', { search: 'gesture' })}>Gestures</A>
              <A href={urlWithQuery('/packages', { search: 'health' })}>Health</A>
              <A href={urlWithQuery('/packages', { search: 'icons' })}>Icons</A>
              <A href={urlWithQuery('/packages', { search: 'image' })}>Image</A>
              <A href={urlWithQuery('/packages', { search: 'location' })}>Location</A>
              <A href={urlWithQuery('/packages', { search: 'markdown' })}>Markdown</A>
              <A href={urlWithQuery('/packages', { search: 'menu' })}>Menus</A>
              <A href={urlWithQuery('/packages', { search: 'navigation' })}>Navigation</A>
              <A href={urlWithQuery('/packages', { search: 'sql' })}>SQL</A>
              <A href={urlWithQuery('/packages', { search: 'state' })}>State</A>
              <A href={urlWithQuery('/packages', { search: 'style' })}>Styling</A>
              <A href={urlWithQuery('/packages', { search: 'svg' })}>SVG</A>
              <A href={urlWithQuery('/packages', { search: 'tailwind' })}>Tailwind</A>
              <A href={urlWithQuery('/packages', { search: 'testing' })}>Testing</A>
              <A href={urlWithQuery('/packages', { search: 'ui' })}>UI</A>
              <A href={urlWithQuery('/packages', { search: 'utility' })}>Utilities</A>
              <A href={urlWithQuery('/packages', { search: 'video' })}>Video</A>
            </View>
          </View>
          <View style={tw`flex-1 px-2`}>
            <H4
              style={tw`flex gap-3 pt-3 pb-2 items-center font-medium text-secondary dark:text-pewter`}>
              Statistics
            </H4>
            <View
              style={[
                tw`min-h-[194px] gap-1.5 px-4 py-3 mb-4 border rounded-md border-palette-gray2 dark:border-default`,
                isSmallScreen && tw`min-h-0`,
              ]}>
              <View>
                <P style={tw`text-2xl font-bold text-primary-darker dark:text-primary`}>
                  {statistic.total.toLocaleString()}
                </P>
                <P style={tw`text-sm text-secondary font-light`}>packages in the directory</P>
              </View>
              <View>
                <P style={tw`text-2xl font-bold text-primary-darker dark:text-primary`}>
                  {statistic.newArchitecture.toLocaleString()}{' '}
                  <span style={tw`font-light`}>
                    ({((statistic.newArchitecture / statistic.total) * 100).toFixed(2)}%)
                  </span>
                </P>
                <P style={tw`text-sm text-secondary font-light`}>
                  packages supporting New Architecture
                </P>
              </View>
              <View>
                <P style={tw`text-2xl font-bold text-primary-darker dark:text-primary`}>
                  {statistic.downloads.toLocaleString()}
                </P>
                <P style={tw`text-sm text-secondary font-light`}>cumulative monthly downloads</P>
              </View>
            </View>
          </View>
        </View>
        <HomeSection
          data={mostDownloaded.libraries}
          title="Most downloaded"
          icon={Download}
          queryParams={{ order: 'downloads' }}
        />
        <HomeSection
          data={popular.libraries}
          title="Popular"
          icon={Star}
          queryParams={{
            order: 'popularity',
            isPopular: 'true',
            isMaintained: 'true',
            wasRecentlyUpdated: 'true',
          }}
        />
        <HomeSection
          data={recentlyUpdated.libraries}
          title="Just updated"
          icon={Calendar}
          queryParams={{ order: 'updated' }}
        />
        <HomeSection
          data={recentlyAdded.libraries}
          title="Recently added"
          icon={Plus}
          queryParams={{ order: 'added' }}
        />
      </ContentContainer>
    </>
  );
}

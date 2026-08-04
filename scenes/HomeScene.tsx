import { type ComponentType } from 'react';
import { View } from 'react-native';

import { A, H4, P, useLayout } from '~/common/styleguide';
import ContentContainer from '~/components/ContentContainer';
import HomeSection from '~/components/Home/HomeSection';
import PlatformRow from '~/components/Home/PlatformRow';
import {
  CalendarIcon,
  DownloadIcon,
  type IconProps,
  PlatformAndroid,
  PlatformIOS,
  PlatformMacOS,
  PlatformTvOS,
  PlatformVisionOS,
  PlatformWeb,
  PlatformWindows,
  PlusIcon,
  StarIcon,
} from '~/components/Icons';
import Navigation from '~/components/Navigation';
import PageMeta from '~/components/PageMeta';
import QuickSearch from '~/components/QuickSearch';
import { type StatisticResultType } from '~/types';
import { type HomePageProps } from '~/types/pages';
import tw from '~/util/tailwind';
import urlWithQuery from '~/util/urlWithQuery';

type PlatformEntry = {
  platform: string;
  stat: keyof StatisticResultType;
  Icon: ComponentType<IconProps>;
};

const PLATFORM_ROWS: PlatformEntry[] = [
  { platform: 'Android', stat: 'android', Icon: PlatformAndroid },
  { platform: 'iOS', stat: 'ios', Icon: PlatformIOS },
  { platform: 'macOS', stat: 'macos', Icon: PlatformMacOS },
  { platform: 'tvOS', stat: 'tvos', Icon: PlatformTvOS },
  { platform: 'visionOS', stat: 'visionos', Icon: PlatformVisionOS },
  { platform: 'Web', stat: 'web', Icon: PlatformWeb },
  { platform: 'Windows', stat: 'windows', Icon: PlatformWindows },
];

const EXPLORE_TOPICS: { label: string; search?: string; params?: Record<string, string> }[] = [
  { label: 'Animation', search: 'animation' },
  { label: 'Audio', search: 'audio' },
  { label: 'Authentication', search: 'authentication' },
  { label: 'Camera', search: 'camera' },
  { label: 'Charts', search: 'chart' },
  { label: 'Color', search: 'color' },
  { label: 'Data validation', search: 'validation' },
  { label: 'Development Tools', params: { skipLibs: 'true' } },
  { label: 'Gestures', search: 'gesture' },
  { label: 'Health', search: 'health' },
  { label: 'I18n', search: 'i18n' },
  { label: 'Icons', search: 'icons' },
  { label: 'Image', search: 'image' },
  { label: 'Location', search: 'location' },
  { label: 'Markdown', search: 'markdown' },
  { label: 'Menus', search: 'menu' },
  { label: 'Navigation', search: 'navigation' },
  { label: 'SQL', search: 'sql' },
  { label: 'State', search: 'state' },
  { label: 'Styling', search: 'style' },
  { label: 'SVG', search: 'svg' },
  { label: 'Tailwind', search: 'tailwind' },
  { label: 'Testing', search: 'testing' },
  { label: 'UI', search: 'ui' },
  { label: 'Utilities', search: 'utility' },
  { label: 'Video', search: 'video' },
];

export default function HomeScene({
  mostDownloaded,
  recentlyAdded,
  recentlyUpdated,
  popular,
  statistic,
}: HomePageProps) {
  const { isSmallScreen } = useLayout();

  return (
    <>
      <PageMeta>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="RSS: Recently added libraries"
          href="/rss/added.xml"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="RSS: Recently updated libraries"
          href="/rss/updated.xml"
        />
      </PageMeta>
      <Navigation
        title="React Native packages registry"
        description="Browse thousands of open-source packages and find the best ones for your current or next project.">
        <QuickSearch style={tw`w-[1200px] max-w-full self-center bg-transparent`} />
      </Navigation>
      <ContentContainer style={[tw`px-4 py-5`, isSmallScreen && tw`pt-2`]}>
        <View style={[tw`mb-1 flex-1 flex-row gap-1`, isSmallScreen && tw`flex-col`]}>
          <View style={tw`flex-1 px-2`}>
            <H4
              style={tw`mb-1 flex items-center gap-3 pb-2 pt-3 font-medium text-secondary dark:text-pewter`}>
              Discover by platform
            </H4>
            <View
              style={[
                tw`mb-4 min-h-[194px] gap-1 rounded-md border border-palette-gray2 px-4 py-3 dark:border-default`,
                isSmallScreen && tw`min-h-0`,
              ]}>
              {PLATFORM_ROWS.map(({ platform, stat, Icon }) => (
                <PlatformRow
                  key={platform}
                  platform={platform}
                  count={statistic[stat] as number}
                  Icon={Icon}
                />
              ))}
            </View>
          </View>
          <View style={tw`flex-1 px-2`}>
            <H4
              style={tw`mb-1 flex items-center gap-3 pb-2 pt-3 font-medium text-secondary dark:text-pewter`}>
              Explore topics
            </H4>
            <View
              style={[
                tw`mb-4 min-h-[194px] flex-row flex-wrap content-center justify-center gap-x-3 gap-y-1.5 rounded-md border border-palette-gray2 px-4 pb-3 pt-2 dark:border-default`,
                isSmallScreen && tw`min-h-0`,
              ]}>
              {EXPLORE_TOPICS.map(({ label, search, params }) => (
                <A
                  key={label}
                  href={urlWithQuery('/packages', search ? { search } : (params ?? {}))}>
                  {label}
                </A>
              ))}
            </View>
          </View>
          <View style={tw`flex-1 px-2`}>
            <H4
              style={tw`mb-1 flex items-center gap-3 pb-2 pt-3 font-medium text-secondary dark:text-pewter`}>
              Statistics
            </H4>
            <View
              style={[
                tw`mb-4 min-h-[194px] gap-1.5 rounded-md border border-palette-gray2 px-4 py-3 dark:border-default`,
                isSmallScreen && tw`min-h-0`,
              ]}>
              <View>
                <P style={tw`text-2xl font-bold text-primary-darker dark:text-primary`}>
                  {statistic.total.toLocaleString()}
                </P>
                <P style={tw`text-sm font-light text-secondary`}>packages in the directory</P>
              </View>
              <View>
                <P style={tw`text-2xl font-bold text-primary-darker dark:text-primary`}>
                  {statistic.newArchitecture.toLocaleString()}{' '}
                  <span style={tw`font-light`}>
                    ({((statistic.newArchitecture / statistic.total) * 100).toFixed(2)}%)
                  </span>
                </P>
                <P style={tw`text-sm font-light text-secondary`}>
                  packages supporting New Architecture
                </P>
              </View>
              <View>
                <P style={tw`text-2xl font-bold text-primary-darker dark:text-primary`}>
                  {statistic.downloads.toLocaleString()}
                </P>
                <P style={tw`text-sm font-light text-secondary`}>cumulative monthly downloads</P>
              </View>
            </View>
          </View>
        </View>
        <HomeSection
          data={mostDownloaded.libraries}
          title="Most downloaded"
          Icon={DownloadIcon}
          queryParams={{ order: 'downloads', hasNativeCode: 'true' }}
        />
        <HomeSection
          data={popular.libraries}
          title="Popular"
          Icon={StarIcon}
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
          Icon={CalendarIcon}
          queryParams={{ order: 'updated' }}
          rss="/rss/updated.xml"
        />
        <HomeSection
          data={recentlyAdded.libraries}
          title="Recently added"
          Icon={PlusIcon}
          queryParams={{ order: 'added' }}
          rss="/rss/added.xml"
        />
      </ContentContainer>
    </>
  );
}

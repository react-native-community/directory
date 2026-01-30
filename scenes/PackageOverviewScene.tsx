import { UL } from '@expo/html-elements';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { View } from 'react-native';

import { A, H6, useLayout } from '~/common/styleguide';
import ContentContainer from '~/components/ContentContainer';
import MetaData from '~/components/Library/MetaData';
import TrendingMark from '~/components/Library/TrendingMark';
import UpdatedAtView from '~/components/Library/UpdateAtView';
import CollapsibleSection from '~/components/Package/CollapsibleSection';
import DetailsNavigation from '~/components/Package/DetailsNavigation';
import DownloadsChart from '~/components/Package/DownloadsChart';
import EntityCounter from '~/components/Package/EntityCounter';
import ExampleBox from '~/components/Package/ExampleBox';
import MorePackagesBox from '~/components/Package/MorePackagesBox';
import NotFound from '~/components/Package/NotFound';
import PackageAuthor from '~/components/Package/PackageAuthor';
import PackageHeader from '~/components/Package/PackageHeader';
import ReadmeBox from '~/components/Package/ReadmeBox';
import PageMeta from '~/components/PageMeta';
import { type NpmUser } from '~/types';
import { type PackageOverviewPageProps } from '~/types/pages';
import tw from '~/util/tailwind';

const ReadmeBoxWithLoading = dynamic(() => import('~/components/Package/ReadmeBox'), {
  loading: () => <ReadmeBox loader />,
});

export default function PackageOverviewScene({
  apiData,
  registryData,
  packageName,
}: PackageOverviewPageProps) {
  const { isSmallScreen } = useLayout();

  const library = useMemo(
    () => apiData.libraries.find(lib => lib.npmPkg === packageName),
    [apiData.libraries, packageName]
  );

  if (!library || !registryData) {
    return <NotFound />;
  }

  const { author, maintainers, dependencies, devDependencies, peerDependencies, engines } =
    registryData;

  return (
    <>
      <PageMeta
        title={library.npmPkg}
        description={`See ${library.npmPkg} package detailed information and metadata`}
        path="package"
      />
      <DetailsNavigation library={library} />
      <ContentContainer style={tw`px-0 py-6`}>
        <View style={[tw`flex-row gap-8 px-5 py-3`, isSmallScreen && tw`flex-col gap-5`]}>
          <View style={tw`flex-1 gap-3`}>
            <PackageHeader
              library={library}
              registryData={registryData}
              rightSlot={<UpdatedAtView library={library} />}
            />
            <ReadmeBoxWithLoading packageName={packageName} githubUrl={library.github.urls.repo} />
            {library.examples && library.examples.length > 0 && (
              <>
                <H6
                  style={[tw`flex gap-1.5 text-[16px] text-secondary`, !isSmallScreen && tw`mt-3`]}>
                  Code examples
                  <EntityCounter count={library.examples.length} />
                </H6>
                <UL style={[tw`m-0 gap-2`, isSmallScreen && tw`mb-2`]}>
                  {library.examples.map((example, index) => (
                    <ExampleBox example={example} key={example} index={index} />
                  ))}
                </UL>
              </>
            )}
            {!isSmallScreen && !!author && (
              <>
                <H6 style={tw`mt-4 text-[16px] text-secondary`}>Author</H6>
                <View style={tw`items-start`}>
                  <PackageAuthor author={author} />
                </View>
              </>
            )}
            {!isSmallScreen && maintainers && (
              <>
                <H6 style={tw`mt-3 flex gap-1.5 text-[16px] text-secondary`}>
                  Contributors
                  <EntityCounter count={maintainers.length} />
                </H6>
                <View style={tw`flex-row flex-wrap items-start gap-2`}>
                  {maintainers
                    .sort((a: NpmUser, b: NpmUser) => a.name.localeCompare(b.name))
                    .map(maintainer => (
                      <PackageAuthor author={maintainer} key={maintainer.name} compact />
                    ))}
                </View>
              </>
            )}
            {!isSmallScreen && <MorePackagesBox library={library} />}
          </View>
          <View style={tw`flex-0.35 gap-4`} id="metadataContainer">
            <View>
              <MetaData library={library} />
            </View>
            <H6 style={tw`text-[16px] text-secondary`}>Additional information</H6>
            <View style={tw`gap-1.5`}>
              <MetaData library={library} secondary skipExamples />
            </View>
            <H6 style={tw`mt-3 text-[16px] text-secondary`}>Popularity</H6>
            <TrendingMark library={library} />
            <H6 style={tw`text-[16px] text-secondary`}>Downloads (last month)</H6>
            <View style={tw`h-[54px] gap-1.5 overflow-hidden rounded-lg border border-default`}>
              <DownloadsChart packageName={packageName} />
            </View>
            {library.github.topics && library.github.topics.length > 0 && (
              <>
                <H6 style={tw`flex gap-1.5 text-[16px] text-secondary`}>
                  Topics
                  <EntityCounter count={library.github.topics.length} />
                </H6>
                <View style={tw`flex-row flex-wrap items-start gap-x-2 gap-y-0.5`}>
                  {library.github.topics.map(topic => (
                    <A key={topic} href={`/?search=${topic}`} style={tw`text-[12px] font-light`}>
                      {topic}
                    </A>
                  ))}
                </View>
              </>
            )}
            <H6 style={tw`text-[16px] text-secondary`}>Package analysis</H6>
            <ul
              style={tw`pl-4.5 m-0 gap-1.5 text-[13px] text-palette-gray4 dark:text-palette-gray5`}>
              <li>
                <A
                  href={`https://bundlephobia.com/package/${library.npmPkg}`}
                  style={tw`text-[12px] font-light`}>
                  Bundlephobia
                </A>
              </li>
              <li>
                <A
                  href={`https://pkg-size.dev/${library.npmPkg}`}
                  style={tw`text-[12px] font-light`}>
                  pkg-size.dev
                </A>
              </li>
              <li>
                <A
                  href={`https://snyk.io/advisor/npm-package/${library.npmPkg}`}
                  style={tw`text-[12px] font-light`}>
                  Snyk Advisor
                </A>
              </li>
            </ul>
            <CollapsibleSection title="Dependencies" data={dependencies} checkExistence />
            <CollapsibleSection title="Peer dependencies" data={peerDependencies} checkExistence />
            <CollapsibleSection title="Development dependencies" data={devDependencies} />
            <CollapsibleSection title="Engines" data={engines} />
            {isSmallScreen && !!author && (
              <>
                <H6 style={tw`text-[16px] text-secondary`}>Author</H6>
                <View style={tw`items-start`}>
                  <PackageAuthor author={author} />
                </View>
              </>
            )}
            {isSmallScreen && maintainers && (
              <>
                <H6 style={tw`flex gap-1.5 text-[16px] text-secondary`}>
                  Contributors
                  <EntityCounter count={maintainers.length} />
                </H6>
                <View style={tw`flex-row flex-wrap items-start gap-2`}>
                  {maintainers
                    .sort((a: NpmUser, b: NpmUser) => a.name.localeCompare(b.name))
                    .map(maintainer => (
                      <PackageAuthor author={maintainer} key={maintainer.name} compact />
                    ))}
                </View>
              </>
            )}
            {isSmallScreen && <MorePackagesBox library={library} />}
          </View>
        </View>
      </ContentContainer>
    </>
  );
}

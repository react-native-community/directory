import { UL } from '@expo/html-elements';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { View } from 'react-native';

import { A, Caption, H6Section, Label, useLayout } from '~/common/styleguide';
import ContentContainer from '~/components/ContentContainer';
import MetaData from '~/components/Library/MetaData';
import TrendingMark from '~/components/Library/TrendingMark';
import UpdatedAtView from '~/components/Library/UpdateAtView';
import CollapsibleSection from '~/components/Package/CollapsibleSection';
import DependenciesSection from '~/components/Package/DependenciesSection';
import DetailsNavigation from '~/components/Package/DetailsNavigation';
import DownloadsChart from '~/components/Package/DownloadsChart';
import EntityCounter from '~/components/Package/EntityCounter';
import ExampleBox from '~/components/Package/ExampleBox';
import MarkdownContentBox from '~/components/Package/MarkdownContentBox';
import MorePackagesBox from '~/components/Package/MorePackagesBox';
import NotFound from '~/components/Package/NotFound';
import PackageAuthor from '~/components/Package/PackageAuthor';
import PackageHeader from '~/components/Package/PackageHeader';
import RepositoryContributors from '~/components/Package/RepositoryContributors';
import TopicsSection from '~/components/Package/TopicsSection';
import PageMeta from '~/components/PageMeta';
import { type NpmRegistryVersionData, type NpmUser, type PeerDependencyData } from '~/types';
import { type PackageOverviewPageProps } from '~/types/pages';
import tw from '~/util/tailwind';

const MarkdownContentBoxWithLoading = dynamic(
  () => import('~/components/Package/MarkdownContentBox'),
  {
    loading: () => <MarkdownContentBox loader />,
  }
);

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

  const { author, maintainers, dependencies, devDependencies, engines } = registryData;

  return (
    <>
      <PageMeta
        title={library.npmPkg}
        description={`See ${library.npmPkg} ${library.template ? 'template' : 'package'} detailed information and metadata`}
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
            <MarkdownContentBoxWithLoading packageName={packageName} library={library} />
            {library.examples && library.examples.length > 0 && (
              <>
                <H6Section style={[tw`flex gap-1.5`, !isSmallScreen && tw`mt-3`]}>
                  Code examples
                  <EntityCounter count={library.examples.length} />
                </H6Section>
                <UL style={[tw`m-0 gap-2`, isSmallScreen && tw`mb-2`]}>
                  {library.examples.map((example, index) => (
                    <ExampleBox example={example} key={example} index={index} />
                  ))}
                </UL>
              </>
            )}
            {!isSmallScreen && <MorePackagesBox library={library} />}
            {!isSmallScreen && !!author && (
              <>
                <H6Section style={tw`mt-3`}>Author</H6Section>
                <View style={tw`items-start`}>
                  <PackageAuthor author={author} />
                </View>
              </>
            )}
            {!isSmallScreen && maintainers && (
              <>
                <H6Section style={tw`mt-3 flex gap-1.5`}>
                  Maintainers
                  <EntityCounter count={maintainers.length} />
                </H6Section>
                <View style={tw`flex-row flex-wrap items-start gap-2`}>
                  {maintainers
                    .sort((a: NpmUser, b: NpmUser) => a.name.localeCompare(b.name))
                    .map(maintainer => (
                      <PackageAuthor author={maintainer} key={maintainer.name} compact />
                    ))}
                </View>
              </>
            )}
            {!isSmallScreen && <RepositoryContributors fullName={library.github.fullName} />}
          </View>
          <View style={tw`flex-0.35 gap-4`} id="metadataContainer">
            <View>
              <MetaData library={library} />
            </View>
            <CollapsibleSection title="Additional information">
              <View style={tw`mb-1 gap-1.5`}>
                <MetaData library={library} secondary skipExamples />
              </View>
            </CollapsibleSection>
            {!library.template && (
              <>
                <H6Section style={tw`flex items-center justify-between`}>
                  Downloads <Label style={tw`font-light text-secondary`}>Last month</Label>
                </H6Section>
                <View style={tw`gap-y-2`}>
                  <View
                    style={tw`h-[54px] gap-1.5 overflow-hidden rounded-lg border border-default`}>
                    <DownloadsChart packageName={packageName} />
                  </View>
                  <View style={tw`flex-row flex-wrap items-center justify-between`}>
                    <Caption style={tw`text-[13px] font-light`}>Popularity</Caption>
                    <TrendingMark library={library} />
                  </View>
                </View>
              </>
            )}
            <TopicsSection topics={library.github.topics} />
            {!library.template && (
              <CollapsibleSection title="Package analysis">
                <ul
                  style={tw`pl-4.5 m-0 gap-1.5 text-[13px] text-palette-gray4 dark:text-palette-gray5`}>
                  <li>
                    <A
                      href={`https://node-modules.dev/grid/depth#install=${library.npmPkg}`}
                      style={tw`text-[12px] font-light`}>
                      Node Modules Inspector
                    </A>
                  </li>
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
                      href={`https://npmgraph.js.org/?q=${library.npmPkg}`}
                      style={tw`text-[12px] font-light`}>
                      npmgraph
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
              </CollapsibleSection>
            )}
            <DependenciesSection
              title="Dependencies"
              data={dependencies}
              checkExistence
              checkVersion
            />
            <DependenciesSection
              title="Peer dependencies"
              data={mergePeerDependenciesData(registryData)}
              checkExistence
            />
            <DependenciesSection title="Development dependencies" data={devDependencies} />
            <DependenciesSection title="Engines" data={engines} />
            {isSmallScreen && <MorePackagesBox library={library} />}
            {isSmallScreen && !!author && (
              <>
                <H6Section>Author</H6Section>
                <View style={tw`items-start`}>
                  <PackageAuthor author={author} />
                </View>
              </>
            )}
            {isSmallScreen && maintainers && (
              <>
                <H6Section style={tw`flex gap-1.5`}>
                  Maintainer
                  <EntityCounter count={maintainers.length} />
                </H6Section>
                <View style={tw`flex-row flex-wrap items-start gap-2`}>
                  {maintainers
                    .sort((a: NpmUser, b: NpmUser) => a.name.localeCompare(b.name))
                    .map(maintainer => (
                      <PackageAuthor author={maintainer} key={maintainer.name} compact />
                    ))}
                </View>
              </>
            )}
            {isSmallScreen && <RepositoryContributors fullName={library.github.fullName} />}
          </View>
        </View>
      </ContentContainer>
    </>
  );
}

function mergePeerDependenciesData({
  peerDependencies = {},
  peerDependenciesMeta = {},
}: NpmRegistryVersionData): Record<string, PeerDependencyData> {
  return Object.fromEntries(
    Object.entries(peerDependencies).map(([name, version]) => [
      name,
      {
        version,
        optional: peerDependenciesMeta?.[name]?.optional ?? false,
      },
    ])
  );
}

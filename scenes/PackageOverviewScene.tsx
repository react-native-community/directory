import { UL } from '@expo/html-elements';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { View } from 'react-native';

import { A, H6, useLayout } from '~/common/styleguide';
import ContentContainer from '~/components/ContentContainer';
import MetaData from '~/components/Library/MetaData';
import TrendingMark from '~/components/Library/TrendingMark';
import UpdatedAtView from '~/components/Library/UpdateAtView';
import DependencyRow from '~/components/Package/DependencyRow';
import DetailsNavigation from '~/components/Package/DetailsNavigation';
import EntityCounter from '~/components/Package/EntityCounter';
import ExampleBox from '~/components/Package/ExampleBox';
import NotFound from '~/components/Package/NotFound';
import PackageAuthor from '~/components/Package/PackageAuthor';
import PackageHeader from '~/components/Package/PackageHeader';
import ReadmeBox from '~/components/Package/ReadmeBox';
import PageMeta from '~/components/PageMeta';
import { type NpmUser } from '~/types';
import { type PackageOverviewPageProps } from '~/types/pages';
import mapDependencies from '~/util/mapDependencies';
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
        description={`See ${library.npmPkg} ${library.template ? 'template' : 'package'} detailed information and metadata`}
        path="package"
      />
      <DetailsNavigation library={library} />
      <ContentContainer style={tw`py-6 px-0`}>
        <View style={[tw`flex-row py-3 px-5 gap-8`, isSmallScreen && tw`flex-col gap-5`]}>
          <View style={tw`gap-3 flex-1`}>
            <PackageHeader
              library={library}
              registryData={registryData}
              rightSlot={<UpdatedAtView library={library} />}
            />
            <ReadmeBoxWithLoading
              packageName={packageName}
              isTemplate={library.template ?? false}
              githubUrl={library.githubUrl}
            />
            {library.examples && library.examples.length > 0 && (
              <>
                <H6 style={tw`flex gap-1.5 text-[16px] mt-3 text-secondary`}>
                  Code examples
                  <EntityCounter count={library.examples.length} />
                </H6>
                <UL style={tw`m-0 mb-2 gap-2`}>
                  {library.examples.map((example, index) => (
                    <ExampleBox example={example} key={example} index={index} />
                  ))}
                </UL>
              </>
            )}
            {!isSmallScreen && !!author && (
              <>
                <H6 style={tw`text-[16px] mt-3 text-secondary`}>Author</H6>
                <View style={tw`items-start`}>
                  <PackageAuthor author={author} />
                </View>
              </>
            )}
            {!isSmallScreen && maintainers && (
              <>
                <H6 style={tw`flex gap-1.5 text-[16px] mt-3 text-secondary`}>
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
          </View>
          <View style={tw`gap-4 flex-0.35`} id="metadataContainer">
            <View>
              <MetaData library={library} />
            </View>
            <H6 style={tw`text-[16px] text-secondary`}>Additional information</H6>
            <View style={tw`gap-1.5`}>
              <MetaData library={library} secondary skipExamples />
            </View>
            {!library.template && (
              <>
                <H6 style={tw`text-[16px] mt-3 text-secondary`}>Popularity</H6>
                <TrendingMark library={library} />
              </>
            )}
            {library.github.topics && library.github.topics.length > 0 && (
              <>
                <H6 style={tw`flex gap-1.5 text-[16px] text-secondary`}>
                  Topics
                  <EntityCounter count={library.github.topics.length} />
                </H6>
                <View style={tw`flex-row flex-wrap items-start gap-y-0.5 gap-x-2`}>
                  {library.github.topics.map(topic => (
                    <A key={topic} href={`/?search=${topic}`} style={tw`text-[12px] font-light`}>
                      {topic}
                    </A>
                  ))}
                </View>
              </>
            )}
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
            {!library.template && (
              <>
                <H6 style={tw`text-[16px] text-secondary`}>Package analysis</H6>
                <ul
                  style={tw`m-0 pl-4.5 gap-1.5 text-[13px] text-palette-gray4 dark:text-palette-gray5`}>
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
              </>
            )}
            {dependencies && Object.keys(dependencies).length > 0 && (
              <>
                <H6 style={tw`flex gap-1.5 text-[16px] text-secondary`}>
                  Dependencies
                  <EntityCounter count={Object.keys(dependencies).length} />
                </H6>
                <View>
                  {mapDependencies(dependencies, ([name, version]: [string, string]) => (
                    <DependencyRow key={`dep-${name}`} name={name} version={version} />
                  ))}
                </View>
              </>
            )}
            {peerDependencies && Object.keys(peerDependencies).length > 0 && (
              <>
                <H6 style={tw`flex gap-1.5 text-[16px] text-secondary`}>
                  Peer dependencies
                  <EntityCounter count={Object.keys(peerDependencies).length} />
                </H6>
                <View>
                  {mapDependencies(peerDependencies, ([name, version]: [string, string]) => (
                    <DependencyRow key={`peer-dep-${name}`} name={name} version={version} />
                  ))}
                </View>
              </>
            )}
            {devDependencies && Object.keys(devDependencies).length > 0 && (
              <>
                <H6 style={tw`flex gap-1.5 text-[16px] text-secondary`}>
                  Development dependencies
                  <EntityCounter count={Object.keys(devDependencies).length} />
                </H6>
                <View>
                  {mapDependencies(devDependencies, ([name, version]: [string, string]) => (
                    <DependencyRow key={`dev-dep-${name}`} name={name} version={version} />
                  ))}
                </View>
              </>
            )}
            {engines && Object.keys(engines).length > 0 && (
              <>
                <H6 style={tw`text-[16px] text-secondary`}>Engines</H6>
                <View>
                  {mapDependencies(engines, ([name, version]: [string, string]) => (
                    <DependencyRow key={`engine-${name}`} name={name} version={version} />
                  ))}
                </View>
              </>
            )}
          </View>
        </View>
      </ContentContainer>
    </>
  );
}

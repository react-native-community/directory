import { useMemo } from 'react';
import { View } from 'react-native';

import { A, Caption, H6, useLayout } from '~/common/styleguide';
import ContentContainer from '~/components/ContentContainer';
import { DirectoryScore } from '~/components/Library/DirectoryScore';
import DetailsNavigation from '~/components/Package/DetailsNavigation';
import NotFound from '~/components/Package/NotFound';
import PackageHeader from '~/components/Package/PackageHeader';
import PageMeta from '~/components/PageMeta';
import { ScoringCriterion } from '~/components/Score/ScoringCriterion';
import { type PackageScorePageProps } from '~/types/pages';
import { SCORING_CRITERIONS } from '~/util/scoring';
import tw from '~/util/tailwind';

export default function PackageScoreScene({ apiData, packageName }: PackageScorePageProps) {
  const { isSmallScreen } = useLayout();

  const library = useMemo(
    () => apiData.libraries.find(lib => lib.npmPkg === packageName),
    [apiData.libraries, packageName]
  );

  if (!library) {
    return <NotFound />;
  }

  return (
    <>
      <PageMeta
        title={library.npmPkg}
        description={`See ${library.npmPkg} ${library.template ? 'template' : 'package'} directory score details`}
        path="package"
      />
      <DetailsNavigation library={library} />
      <ContentContainer style={tw`my-6 py-3 px-5`}>
        <View style={tw`gap-3 flex-1`}>
          <PackageHeader library={library} />
          <View
            style={[
              tw`items-center flex-row gap-1 mt-2 mb-3 py-4 px-7 border rounded-xl border-palette-gray3 bg-palette-gray1 dark:bg-palette-gray7 dark:border-default`,
              isSmallScreen && tw`flex-col px-5`,
            ]}>
            <View style={tw`items-center`}>
              <H6 style={tw`mb-3`}>Directory score</H6>
              <DirectoryScore score={library.score} sizeMultiplier={2} />
              <span style={tw`flex text-[24px] font-semibold items-center mt-1 text-primary-dark`}>
                {library.score}/100
              </span>
            </View>
            <View
              style={[
                tw`w-[0.5px] min-h-[112px] mx-7 bg-palette-gray3 dark:bg-accented`,
                isSmallScreen && tw`w-full min-h-[0.5px] mx-0 my-3`,
              ]}
            />
            <View style={tw`flex flex-shrink gap-2`}>
              <Caption style={tw`font-light text-palette-gray5 dark:text-palette-gray4`}>
                The Directory Score is the combination of multiple factors that relate to the
                quality of a library. A library can earn value by exhibiting &quot;good behavior
                criteria&quot; and can lose value by exhibiting &quot;bad behavior criteria&quot;.
              </Caption>
              <Caption style={tw`font-light text-palette-gray5 dark:text-palette-gray4`}>
                Scores are subjective and are based on data that's readily available on GitHub and
                npm. They are not a perfect scores and may not reflect quality for your specific
                needs. <A href="/scoring">Read more</A>.
              </Caption>
            </View>
          </View>
          <H6 style={tw`text-palette-gray5 dark:text-secondary`}>Matching criteria</H6>
          <View>
            {SCORING_CRITERIONS.filter(({ name }) =>
              library.matchingScoreModifiers.includes(name)
            ).map(({ name, description, value }) => (
              <ScoringCriterion headline={name} score={value} key={`match-${name}`}>
                {description}
              </ScoringCriterion>
            ))}
          </View>
          <H6 style={tw`text-palette-gray5 dark:text-secondary`}>Not matched criteria</H6>
          <View>
            {SCORING_CRITERIONS.filter(
              ({ name }) => !library.matchingScoreModifiers.includes(name)
            ).map(({ name, description, value }) => (
              <ScoringCriterion
                headline={name}
                score={value}
                key={`unmatch-${name}`}
                style={[tw`opacity-60 border-2 border-dashed`, { filter: 'grayscale(1)' }]}>
                {description}
              </ScoringCriterion>
            ))}
          </View>
        </View>
      </ContentContainer>
    </>
  );
}

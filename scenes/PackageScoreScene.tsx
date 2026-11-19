import { View } from 'react-native';

import { A, Caption, H6Section, useLayout } from '~/common/styleguide';
import ContentContainer from '~/components/ContentContainer';
import { DirectoryScore } from '~/components/Library/DirectoryScore';
import NavigationHeader from '~/components/Package/Navigation/NavigationHeader';
import NotFound from '~/components/Package/NotFound';
import PackageHeader from '~/components/Package/PackageHeader';
import PageMeta from '~/components/PageMeta';
import { ScoringCriterion } from '~/components/Score/ScoringCriterion';
import { type PackageScorePageProps } from '~/types/pages';
import { SCORING_CRITERIONS } from '~/util/scoring';
import { cx } from '~/util/tailwind';

export default function PackageScoreScene({ apiData, packageName }: PackageScorePageProps) {
  const { isSmallScreen } = useLayout();

  const library = apiData.libraries.find(lib => lib.npmPkg === packageName);

  if (!library) {
    return <NotFound />;
  }

  return (
    <>
      <PageMeta
        title={library.npmPkg}
        description="See package directory score details"
        path="package"
      />
      <NavigationHeader library={library} />
      <ContentContainer className="my-6 px-5 pb-3">
        <View className="flex-1 gap-3">
          <PackageHeader library={library} skipDescription />
          <View
            className={cx(
              'mb-3 mt-2 flex-row items-center gap-1 rounded-xl border border-palette-gray3 bg-palette-gray1 px-7 py-4 dark:border-border dark:bg-palette-gray7',
              cx(isSmallScreen && 'flex-col px-5')
            )}>
            <View className="items-center">
              <H6Section className="mb-3">Directory score</H6Section>
              <DirectoryScore score={library.score} sizeMultiplier={2} />
              <span className="text-primary-dark mt-1 flex items-center text-[24px] font-semibold">
                {library.score}/100
              </span>
            </View>
            <View
              className={cx(
                'mx-7 min-h-[112px] w-[0.5px] bg-palette-gray3 dark:bg-accented',
                cx(isSmallScreen && 'mx-0 my-3 min-h-[0.5px] w-full')
              )}
            />
            <View className="flex flex-shrink gap-2">
              <Caption className="text-palette-gray5 dark:text-palette-gray4 font-light">
                The Directory Score is the combination of multiple factors that relate to the
                quality of a library. A library can earn value by exhibiting &quot;good behavior
                criteria&quot; and can lose value by exhibiting &quot;bad behavior criteria&quot;.
              </Caption>
              <Caption className="text-palette-gray5 dark:text-palette-gray4 font-light">
                Scores are subjective and are based on data that&apos;s readily available on GitHub
                and npm. They are not a perfect scores and may not reflect quality for your specific
                needs. <A href="/scoring">Read more</A>.
              </Caption>
            </View>
          </View>
          <H6Section className="text-secondary">Matching criteria</H6Section>
          <View>
            {SCORING_CRITERIONS.filter(({ name }) =>
              library.matchingScoreModifiers.includes(name)
            ).map(({ name, description, value }) => (
              <ScoringCriterion headline={name} score={value} key={`match-${name}`}>
                {description}
              </ScoringCriterion>
            ))}
          </View>
          <H6Section className="text-secondary">Not matched criteria</H6Section>
          <View>
            {SCORING_CRITERIONS.filter(
              ({ name }) => !library.matchingScoreModifiers.includes(name)
            ).map(({ name, description, value }) => (
              <ScoringCriterion
                headline={name}
                score={value}
                key={`unmatch-${name}`}
                className={cx('border-2 border-dashed opacity-60 grayscale')}>
                {description}
              </ScoringCriterion>
            ))}
          </View>
        </View>
      </ContentContainer>
    </>
  );
}

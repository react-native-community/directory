import { useContext, useMemo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { A, Caption, colors, darkColors, H6, useLayout } from '~/common/styleguide';
import ContentContainer from '~/components/ContentContainer';
import { DirectoryScore } from '~/components/Library/DirectoryScore';
import DetailsNavigation from '~/components/Package/DetailsNavigation';
import NotFound from '~/components/Package/NotFound';
import PackageHeader from '~/components/Package/PackageHeader';
import PageMeta from '~/components/PageMeta';
import { ScoringCriterion } from '~/components/Score/ScoringCriterion';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';
import { type PackageScorePageProps } from '~/types/pages';
import { SCORING_CRITERIONS } from '~/util/scoring';

export default function PackageScoreScene({ apiData, packageName }: PackageScorePageProps) {
  const { isDark } = useContext(CustomAppearanceContext);
  const { isSmallScreen } = useLayout();

  const library = useMemo(
    () => apiData.libraries.find(lib => lib.npmPkg === packageName),
    [apiData.libraries, packageName]
  );

  if (!library) {
    return <NotFound />;
  }

  const scoreBoxBorderColor = isDark ? darkColors.border : colors.gray3;
  const headerColorStyle = {
    color: isDark ? darkColors.secondary : colors.gray5,
  };
  const secondaryColorStyle = {
    color: isDark ? colors.gray4 : colors.gray5,
  };

  return (
    <>
      <PageMeta
        title={library.npmPkg}
        description={`See ${library.npmPkg} ${library.template ? 'template' : 'package'} directory score details`}
        path="package"
      />
      <DetailsNavigation library={library} />
      <ContentContainer style={styles.container}>
        <View style={styles.detailsContainer}>
          <PackageHeader library={library} />
          <View
            style={[
              styles.scoreBox,
              isSmallScreen && styles.scoreBoxSmall,
              {
                borderColor: scoreBoxBorderColor,
                backgroundColor: isDark ? colors.gray7 : colors.gray1,
              },
            ]}>
            <View style={styles.scoreSection}>
              <H6 style={styles.sectionHeader}>Directory score</H6>
              <DirectoryScore score={library.score} sizeMultiplier={2} />
              <span
                style={{
                  ...styles.scoreIndicator,
                  color: isDark ? darkColors.primaryDark : colors.primaryDark,
                }}>
                {library.score}/100
              </span>
            </View>
            <View
              style={[
                styles.separator,
                isSmallScreen && styles.separatorSmall,
                { backgroundColor: scoreBoxBorderColor },
              ]}
            />
            <div style={styles.scoreDescriptionWrapper}>
              <Caption style={[styles.scoreDescription, secondaryColorStyle]}>
                The Directory Score is the combination of multiple factors that relate to the
                quality of a library. A library can earn value by exhibiting &quot;good behavior
                criteria&quot; and can lose value by exhibiting &quot;bad behavior criteria&quot;.
              </Caption>
              <Caption style={[styles.scoreDescription, secondaryColorStyle]}>
                Scores are subjective and are based on data that's readily available on GitHub and
                npm. They are not a perfect scores and may not reflect quality for your specific
                needs. <A href="/scoring">Read more</A>.
              </Caption>
            </div>
          </View>
          <H6 style={headerColorStyle}>Matching criteria</H6>
          <View>
            {SCORING_CRITERIONS.filter(({ name }) =>
              library.matchingScoreModifiers.includes(name)
            ).map(({ name, description, value }) => (
              <ScoringCriterion headline={name} score={value} key={`match-${name}`}>
                {description}
              </ScoringCriterion>
            ))}
          </View>
          <H6 style={headerColorStyle}>Not matched criteria</H6>
          <View>
            {SCORING_CRITERIONS.filter(
              ({ name }) => !library.matchingScoreModifiers.includes(name)
            ).map(({ name, description, value }) => (
              <ScoringCriterion
                headline={name}
                score={value}
                key={`unmatch-${name}`}
                style={styles.unmatchedCriterion}>
                {description}
              </ScoringCriterion>
            ))}
          </View>
        </View>
      </ContentContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  detailsContainer: {
    gap: 12,
    ...Platform.select({
      web: {
        flex: 1,
      },
    }),
  },
  scoreBox: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    marginTop: 8,
    marginBottom: 12,
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 12,
  },
  scoreBoxSmall: {
    flexDirection: 'column',
    paddingHorizontal: 20,
  },
  scoreSection: {
    display: 'flex',
    alignItems: 'center',
  },
  sectionHeader: {
    marginBottom: 12,
  },
  scoreIndicator: {
    display: 'flex',
    fontSize: 24,
    fontWeight: 600,
    alignItems: 'center',
    marginTop: 4,
  },
  separator: {
    width: 0.5,
    minHeight: 112,
    marginHorizontal: 28,
  },
  separatorSmall: {
    width: '100%',
    minHeight: 0.5,
    marginHorizontal: 0,
    marginVertical: 12,
  },
  scoreDescriptionWrapper: {
    display: 'flex',
    gap: 8,
    flexDirection: 'column',
  },
  scoreDescription: {
    fontWeight: 300,
  },
  unmatchedCriterion: {
    filter: 'grayscale(1)',
    opacity: 0.6,
    borderStyle: 'dashed',
    borderWidth: 2,
  },
});

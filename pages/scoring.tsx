import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { A, Caption, colors, darkColors, H2, H3, P } from '~/common/styleguide';
import ContentContainer from '~/components/ContentContainer';
import TrendingMark from '~/components/Library/TrendingMark';
import Navigation from '~/components/Navigation';
import PageMeta from '~/components/PageMeta';
import { ScoringCriterion } from '~/components/Score/ScoringCriterion';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';
import { SCORING_CRITERIONS } from '~/util/scoring';

export default function Scoring() {
  const { isDark } = useContext(CustomAppearanceContext);

  const textColorStyle = {
    color: isDark ? colors.gray2 : colors.black,
  };
  const secondaryTextColorStyle = {
    color: isDark ? darkColors.secondary : colors.gray4,
  };
  const calloutStyle = {
    color: isDark ? darkColors.warning : colors.warningDark,
    backgroundColor: isDark ? darkColors.warningLight : colors.warningLight,
    borderLeftColor: isDark ? darkColors.warning : colors.warning,
  };

  return (
    <>
      <PageMeta
        title="Scoring"
        description="What are the Directory Score and Trending Score and how they are calculated"
        path="scoring"
      />
      <Navigation
        title="Scoring"
        description="What are the Directory Score and Trending Score and how they are calculated?"
      />
      <ContentContainer style={styles.container}>
        <Caption style={[styles.paragraph, styles.callout, calloutStyle]}>
          Directory scores are subjective and are based on data that&apos;s readily available on
          GitHub and npm. They are not a perfect scores and may not reflect quality for your
          specific needs. When evaluating libraries to include in your project, review the library
          yourself to determine if it&apos;s a good fit.
        </Caption>
        <H2 style={[styles.subHeader, textColorStyle]}>Directory Score</H2>
        <P style={[styles.paragraph, textColorStyle]}>
          The Directory Score is the combination of multiple factors that relate to the quality of a
          library. A library can earn value by exhibiting &quot;good behavior criteria&quot; and can
          lose value by exhibiting &quot;bad behavior criteria&quot;. These criteria and their
          corresponding weights are detailed below. You can see the code this directory uses to
          create Directory Scores{' '}
          <A href="https://github.com/react-native-directory/website/blob/main/scripts/calculate-score.ts">
            here
          </A>
          .
        </P>
        <P style={[styles.paragraph, textColorStyle]}>
          The Directory Score is represented as a value between 0 and 100. All final scores outside
          this range will be clamped to the nearest limit.
        </P>
        <H3 style={[styles.subHeader, textColorStyle]}>Directory Score criteria</H3>
        <P style={[styles.paragraph, textColorStyle]}>
          The following criteria are used to calculate a library&apos;s Directory Score.
        </P>
        <ScoringCriterion headline="Combined Popularity">
          Base popularity metric measured by weighting and combining subscribers, forks, stars, and
          download counts:
          <br />
          <View style={styles.formula}>
            <code>forks * 20 + stars * 10 + downloads / 50;</code>
          </View>
        </ScoringCriterion>
        {SCORING_CRITERIONS.map(({ name, description, value }) => (
          <ScoringCriterion headline={name} score={value} key={name}>
            {description}
          </ScoringCriterion>
        ))}
        <br />
        <H2 style={[styles.subHeader, textColorStyle]}>Trending Score</H2>
        <P style={[styles.paragraph, textColorStyle]}>
          The Trending Score is the combination of multiple factors that relate to the download
          count and quality of a library. A library gets the the base score from the Popularity Gain
          criterion and can lose score by exhibiting one of bad criteria. These criteria and their
          corresponding weights are detailed below. You can see the code this directory uses to
          create Trending Scores{' '}
          <A href="https://github.com/react-native-directory/website/blob/main/scripts/calculate-score.ts">
            here
          </A>
          .
        </P>
        <P style={[styles.paragraph, textColorStyle]}>
          There are five levels of popularity which depends on the package final Trending Score:
          <ul style={styles.trendingExplainers}>
            <li>
              <TrendingMark markOnly library={{ popularity: 0.5001 }} style={{ minWidth: 164 }} />
              (final score &gt; 50)
            </li>
            <li>
              <TrendingMark markOnly library={{ popularity: 0.2501 }} style={{ minWidth: 164 }} />
              (final score &gt; 25)
            </li>
            <li>
              <TrendingMark markOnly library={{ popularity: 0.1001 }} style={{ minWidth: 164 }} />
              (final score &gt; 10)
            </li>
            <li>
              <TrendingMark markOnly library={{ popularity: 0.0001 }} style={{ minWidth: 164 }} />
              (final score &gt; 0)
            </li>
            <li>
              <TrendingMark markOnly library={{ popularity: 0 }} style={{ minWidth: 164 }} />
              (final score =&lt; 0)
            </li>
          </ul>
        </P>
        <H3 style={[styles.subHeader, textColorStyle]}>Trending Score criteria</H3>
        <P style={[styles.paragraph, textColorStyle]}>
          The following criteria are used to calculate a library&apos;s final Trending Score.
        </P>
        <ScoringCriterion headline="Popularity Gain">
          A base for the final library score, it compares the monthly downloads count with weekly
          downloads count and based on those values calculates a growth ratio for the package. The
          formula used for calculating the score looks as following:
          <br />
          <View style={styles.formula}>
            <code>(lastWeekDownloads / Math.floor(monthlyDownloads / 4.25)) / 5</code>
          </View>
          <br />
          <View style={[styles.sidenoteContainer]}>
            <P style={[styles.sidenote, secondaryTextColorStyle]}>
              The value range span can be quite wide, but most of the packages Popularity Gain value
              fits within +/- 100 range.
            </P>
          </View>
        </ScoringCriterion>
        <ScoringCriterion headline="Many downloads" score={+0.25}>
          Libraries with more than 15,000 monthly downloads and Popularity Gain score above 0.25
          meet this criterion.
        </ScoringCriterion>
        <ScoringCriterion headline="Not many downloads" score={-0.75}>
          Libraries with less than 1,000 monthly downloads meet this criterion.
        </ScoringCriterion>
        <ScoringCriterion headline="Not many followers" score={-0.25}>
          Libraries with less than 25 starts on GitHub meet this criterion.
        </ScoringCriterion>
        <ScoringCriterion headline="No longer maintained" score={-0.75}>
          Libraries that are marked with &quot;unmaintained&quot; flag meet this criterion.
        </ScoringCriterion>
        <ScoringCriterion headline="Very fresh package" score={-0.5}>
          Libraries that first version was published less that 7 days ago meet this criterion.
        </ScoringCriterion>
        <br />
      </ContentContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  subHeader: {
    marginTop: 16,
    marginBottom: 20,
  },
  paragraph: {
    lineHeight: 29,
    marginBottom: 16,
    fontWeight: 300,
  },
  callout: {
    lineHeight: 24,
    borderLeftWidth: 6,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  formula: {
    paddingHorizontal: 16,
    marginTop: 12,
  },
  trendingExplainers: {
    fontSize: 16,
  },
  sidenoteContainer: {
    flex: 1,
    marginTop: 12,
  },
  sidenote: {
    fontSize: 15,
    lineHeight: 25,
    fontWeight: 300,
  },
});

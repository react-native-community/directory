import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { H2, P, Headline, A, colors, darkColors, H3 } from '../common/styleguide';
import ContentContainer from '../components/ContentContainer';
import PopularityMark from '../components/Library/PopularityMark';
import Navigation from '../components/Navigation';
import PageMeta from '../components/PageMeta';
import CustomAppearanceContext from '../context/CustomAppearanceContext';

const ScoringCriterion = ({ children, headline, score = undefined }) => {
  const { isDark } = useContext(CustomAppearanceContext);
  const textStyle = {
    color: isDark ? colors.gray2 : colors.black,
  };
  const borderStyle = {
    borderColor: isDark ? darkColors.border : colors.gray2,
  };
  const isPositiveModifier = score > 0;
  return (
    <View style={[styles.criterionWrapper, borderStyle]}>
      <Headline style={[styles.criterion, textStyle]}>
        {headline}
        {score && (
          <Headline
            style={[
              styles.criterionScore,
              borderStyle,
              { color: isPositiveModifier ? colors.success : colors.error },
            ]}>
            {isPositiveModifier ? '+' : ''}
            {score}
          </Headline>
        )}
      </Headline>
      <P style={[styles.paragraph, { marginBottom: 0 }, textStyle]}>{children}</P>
    </View>
  );
};

const Scoring = () => {
  const { isDark } = useContext(CustomAppearanceContext);
  const textColorStyle = {
    color: isDark ? colors.gray2 : colors.black,
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
        description="What are the Directory Score and Popularity Score and how they are calculated"
        path="popular"
      />
      <Navigation
        title="Scoring"
        description="What are the Directory Score and Popularity Score and how they are calculated?"
      />
      <ContentContainer style={styles.container}>
        <P style={[styles.paragraph, styles.callout, calloutStyle]}>
          Directory scores are subjective and are based on data that&apos;s readily available on
          GitHub and npm. They are not a perfect scores and may not reflect quality for your
          specific needs. When evaluating libraries to include in your project, review the library
          yourself to determine if it&apos;s a good fit.
        </P>
        <H2 style={[styles.subHeader, textColorStyle]}>Directory Score</H2>
        <P style={[styles.paragraph, textColorStyle]}>
          The Directory Score is the combination of multiple factors that relate to the quality of a
          library. A library can earn value by exhibiting &quot;good behavior criteria&quot; and can
          lose value by exhibiting &quot;bad behavior criteria&quot;. These criteria and their
          corresponding weights are detailed below. You can see the code this directory uses to
          create Directory Scores{' '}
          <A href="https://github.com/react-native-directory/website/blob/main/scripts/calculate-score.js">
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
        <ScoringCriterion headline="Very popular" score={40}>
          Libraries with a combined popularity score of over 10,000 meet this criterion.
          <br />
          Combined popularity is measured by weighting and combining subscribers, forks, stars, and
          download counts:
          <br />
          <View style={styles.formula}>
            <code>subscribers * 20 + forks * 10 + stars + downloads / 100;</code>
          </View>
        </ScoringCriterion>
        <ScoringCriterion headline="Popular" score={10}>
          Libraries with a combined popularity score of over 2,500 meet this criterion.
          <br />
          Combined popularity is measured by weighting and combining subscribers, forks, stars, and
          download counts:
          <br />
          <View style={styles.formula}>
            <code>subscribers * 20 + forks * 10 + stars + downloads / 100;</code>
          </View>
        </ScoringCriterion>
        <ScoringCriterion headline="Recommended" score={20}>
          The maintainers of React Native Directory hand pick select recommended libraries.
        </ScoringCriterion>
        <ScoringCriterion headline="Recently updated" score={10}>
          Libraries that have been updated in the last 30 days meet this criterion.
        </ScoringCriterion>
        <ScoringCriterion headline="Not supporting New Architecture" score={-5}>
          Libraries that does not support New Architecture meet this criterion.
        </ScoringCriterion>
        <ScoringCriterion headline="Not updated recently" score={-10}>
          Libraries that have not been updated in the last 180 days meet this criterion.
        </ScoringCriterion>
        <ScoringCriterion headline="Lots of open issues" score={-20}>
          Libraries with more than 75 open issues meet this criterion.
        </ScoringCriterion>
        <ScoringCriterion headline="No license, unrecognized license or GPL license" score={-20}>
          Libraries without a license, libraries with non-standard license or that include the GPL
          license meet this criterion.
        </ScoringCriterion>
        <br />
        <H2 style={[styles.subHeader, textColorStyle]}>Popularity Score</H2>
        <P style={[styles.paragraph, textColorStyle]}>
          The Popularity Score is the combination of multiple factors that relate to the download
          count and quality of a library. A library gets the the base score from the Popularity Gain
          criterion and can lose score by exhibiting one of bad criteria. These criteria and their
          corresponding weights are detailed below. You can see the code this directory uses to
          create Popularity Scores{' '}
          <A href="https://github.com/react-native-directory/website/blob/main/scripts/calculate-score.js">
            here
          </A>
          .
        </P>
        <P style={[styles.paragraph, textColorStyle]}>
          There are five levels of popularity which depends on the package final Popularity Score:
          <ul>
            <li>
              <PopularityMark markOnly library={{ popularity: 0.5001 }} />
              &ensp;(final score &gt; 50)
            </li>
            <li>
              <PopularityMark markOnly library={{ popularity: 0.2501 }} />
              &ensp;(final score &gt; 25)
            </li>
            <li>
              <PopularityMark markOnly library={{ popularity: 0.1001 }} />
              &ensp;(final score &gt; 10)
            </li>
            <li>
              <PopularityMark markOnly library={{ popularity: 0.0001 }} />
              &ensp;(final score &gt; 0)
            </li>
            <li>
              <PopularityMark markOnly library={{ popularity: 0 }} />
              &ensp;(final score =&lt; 0)
            </li>
          </ul>
        </P>
        <H3 style={[styles.subHeader, textColorStyle]}>Popularity Score criteria</H3>
        <P style={[styles.paragraph, textColorStyle]}>
          The following criteria are used to calculate a library&apos;s final Popularity Score.
        </P>
        <ScoringCriterion headline="Popularity Gain">
          A base for the library score, it compares the monthly downloads count with weekly
          downloads count and based on those values calculates a growth ratio for the package. Its
          value range span can be quite wide, but most of the packages Popularity Gain value fits
          within +/- 100 range. The formula used for calculating the score looks as following:
          <br />
          <View style={styles.formula}>
            <code>
              (lastWeekDownloads - Math.floor(monthlyDownloads / 4)) / monthlyDownloads) * 100
            </code>
          </View>
        </ScoringCriterion>
        <ScoringCriterion headline="Not many downloads" score={-45}>
          Libraries with less than 250 monthly downloads meet this criterion.
        </ScoringCriterion>
        <ScoringCriterion headline="Not many followers" score={-10}>
          Libraries with less than 25 starts on GitHub meet this criterion.
        </ScoringCriterion>
        <ScoringCriterion headline="No longer maintained" score={-25}>
          Libraries that are marked with &quot;unmaintained&quot; flag meet this criterion.
        </ScoringCriterion>
        <ScoringCriterion headline="Very fresh package" score={-30}>
          Libraries that first version was published less that 3 days ago meet this criterion.
        </ScoringCriterion>
        <br />
      </ContentContainer>
    </>
  );
};

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
    fontSize: 17,
    lineHeight: 29,
    marginBottom: 17,
    fontWeight: 300,
  },
  callout: {
    borderLeftWidth: 8,
    padding: 16,
    marginBottom: 17,
  },
  criterionWrapper: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 6,
    marginBottom: 17,
  },
  criterion: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  criterionScore: {
    // @ts-ignore
    float: 'left',
    marginRight: 16,
    width: 44,
    fontSize: 15,
    fontWeight: '700',
    padding: 1,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 4,
    textAlign: 'center',
  },
  criterionScoreSymbol: {
    position: 'relative',
    top: 2,
    left: 4,
  },
  formula: {
    paddingHorizontal: 16,
    marginTop: 12,
  },
});

export default Scoring;

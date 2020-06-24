import React from 'react';
import { StyleSheet } from 'react-native';

import { H1, H2, H3, P, Headline, A, colors } from '../common/styleguide';
import ContentContainer from '../components/ContentContainer';

// type Props = {};

function DirectoryScore(props) {
  return (
    <ContentContainer style={styles.container}>
      <H1 style={styles.header}>Directory Score</H1>
      <P style={styles.paragraph}>
        The Directory Score is the combination of multiple factors that relate to the quality of a
        library. A library can earn value by exhibiting "good behavior criteria" and can lose value
        by exhibiting "bad behavior criteria". These criteria and their corresponding weights are
        detailed below. You can see the code this directory uses to create Directory Scores{' '}
        <A href="https://github.com/react-native-directory/website/blob/master/scripts/calculate-score.js">
          here
        </A>
        .
      </P>
      <P style={[styles.paragraph, styles.callout]}>
        Directory Scores are subjective and are based on data that's readily available on GitHub.
        It's not a perfect score and may not reflect quality for your specific needs. When
        evaluating libraries to include in your project, review the library yourself to determine if
        it's a good fit.
      </P>
      <H2 style={styles.subHeader}>Scoring criteria</H2>
      <P style={styles.paragraph}>
        The following criteria are used to calculate a library's Directory Score.
      </P>
      <Headline style={styles.criterion}>Very popular (+40)</Headline>
      <P style={styles.paragraph}>
        Libraries with a popularity score of over 10,000 meet this criterion. Popularity is measured
        by weighting and combining subscribers, forks, stars, and download counts.
      </P>
      <Headline style={styles.criterion}>Popular (+10)</Headline>
      <P style={styles.paragraph}>
        Libraries with a popularity score of over 2,500 meet this criterion. Popularity is measured
        by weighting and combining subscribers, forks, stars, and download counts.
      </P>
      <Headline style={styles.criterion}>Recommended (+20)</Headline>
      <P style={styles.paragraph}>
        The maintainers of React Native Directory hand pick select recommended libraries.
      </P>
      <Headline style={styles.criterion}>Recently updated (+10)</Headline>
      <P style={styles.paragraph}>
        Libraries that have been updated in the last 30 days meet this criterion.
      </P>
      <Headline style={styles.criterion}>Not updated recently (-10)</Headline>
      <P style={styles.paragraph}>
        Libraries that have not been updated in the last 180 days meet this criterion.
      </P>
      <Headline style={styles.criterion}>Lots of open issues (-20)</Headline>
      <P style={styles.paragraph}>Libraries with more than 75 open issues meet this criterion.</P>
      <Headline style={styles.criterion}>
        No license, unrecognized license or GPL license (-20)
      </Headline>
      <P style={styles.paragraph}>
        Libraries without a license or that include the GPL license meet this criterion.
      </P>
    </ContentContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 20,
  },
  subHeader: {
    marginTop: 16,
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 17,
    color: '#1a1a1a',
    lineHeight: 29,
    marginBottom: 17,
  },
  callout: {
    backgroundColor: colors.warningLight,
    borderLeftWidth: 8,
    borderLeftColor: colors.warning,
    padding: 16,
    marginBottom: 17,
  },
  criterion: {
    fontWeight: '600',
    marginBottom: 8,
  },
});

export default DirectoryScore;

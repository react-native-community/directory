import { NextPageContext } from 'next';
import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { A, colors, darkColors, useLayout } from '../common/styleguide';
import ContentContainer from '../components/ContentContainer';
import ExploreNav from '../components/Explore/ExploreNav';
import CustomAppearanceContext from '../context/CustomAppearanceContext';
import getApiUrl from '../util/getApiUrl';
import urlWithQuery from '../util/urlWithQuery';

const OMIT_TOPICS = [
  'react',
  'reactjs',
  'reactnative',
  'react-native',
  'react-component',
  'react-native-component',
  'native',
  'library',
  'android',
  'ios',
  'macos',
  'tvos',
  'expo',
  'web',
  'windows',
  'javascript',
  'typescript',
];

const TopicsSection = ({ data }) => {
  const { isDark } = useContext(CustomAppearanceContext);
  const { isSmallScreen } = useLayout();

  const topics = Object.entries(
    data
      .filter(lib => lib.popularity > 0.03)
      .map(lib => lib?.github?.topics || [])
      .flat()
      .reduce((map, val) => {
        map[val] = (map[val] || 0) + 1;
        return map;
      }, {})
  )
    .map(arr => (arr[1] > 1 && !OMIT_TOPICS.includes(arr[0]) ? arr[0] : null))
    .filter(Boolean)
    .sort();

  return (
    <View style={[styles.topicsWrapper, isSmallScreen && styles.topicsWrapperSmall]}>
      {topics.map(topic => (
        <A
          href={urlWithQuery('/', { search: topic })}
          target="_self"
          style={[
            styles.topicBox,
            {
              borderColor: isDark ? darkColors.border : colors.gray2,
            },
          ]}>
          {topic}
        </A>
      ))}
    </View>
  );
};

const Topics = ({ data }) => {
  return (
    <>
      <ExploreNav title="Trending topics" description="See which topics are trending today." />
      <ContentContainer style={styles.container}>
        <TopicsSection data={data} />
      </ContentContainer>
    </>
  );
};

Topics.getInitialProps = async (ctx: NextPageContext) => {
  let url = getApiUrl(urlWithQuery('/libraries', { limit: 9999, order: 'popularity' }), ctx);
  let response = await fetch(url);
  let result = await response.json();

  return {
    data: result.libraries,
    query: ctx.query,
  };
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  topicsWrapper: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 28,
    paddingHorizontal: '12%',
  },
  topicsWrapperSmall: {
    paddingHorizontal: 24,
  },
  topicBox: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 4,
    width: 'auto',
    marginRight: 12,
    marginBottom: 12,
  },
});

export default Topics;

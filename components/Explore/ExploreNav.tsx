import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, darkColors, H1, P } from '../../common/styleguide';
import CustomAppearanceContext from '../../context/CustomAppearanceContext';
import ContentContainer from '../ContentContainer';
import ExploreTab from './ExploreTab';

const ExploreNav = ({ title, description }) => {
  const { isDark } = useContext(CustomAppearanceContext);

  return (
    <View
      style={{
        backgroundColor: isDark ? darkColors.background : colors.white,
      }}>
      <ContentContainer style={styles.container}>
        <ExploreTab title="Explore" />
        <ExploreTab title="Topics" />
        <ExploreTab title="Trending" />
      </ContentContainer>
      <View
        style={[
          styles.headerWrapper,
          { backgroundColor: isDark ? darkColors.subHeader : colors.gray1 },
        ]}>
        <H1 style={styles.header}>{title}</H1>
        <P style={styles.headerDescription}>{description}</P>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  headerWrapper: {
    paddingTop: 22,
    paddingBottom: 32,
    marginBottom: 16,
  },
  header: {
    textAlign: 'center',
    fontSize: 44,
    paddingHorizontal: 20,
  },
  headerDescription: {
    textAlign: 'center',
    paddingTop: 4,
    paddingBottom: 6,
    paddingHorizontal: 40,
  },
});

export default ExploreNav;

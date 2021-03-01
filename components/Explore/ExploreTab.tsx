import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { A, colors, darkColors, P } from '../../common/styleguide';
import CustomAppearanceContext from '../../context/CustomAppearanceContext';

const ExploreTab = ({ title }) => {
  const { isDark } = useContext(CustomAppearanceContext);
  const router = useRouter();
  const isActive = router.pathname === `/${title.toLowerCase()}`;

  return (
    <A
      href={title.toLowerCase()}
      style={[styles.tabLink, isActive && styles.tabActive]}
      hoverStyle={{
        borderColor: isActive ? colors.primary : isDark ? darkColors.powder : colors.sky,
        color: isDark ? colors.gray3 : colors.gray5,
      }}
      target="_self">
      <View style={[styles.tabContainer]}>
        <P style={[styles.tabTitle, isActive && styles.tabActiveTitle]}>{title}</P>
      </View>
    </A>
  );
};

const styles = StyleSheet.create({
  tabLink: {
    backgroundColor: 'transparent',
    textDecorationLine: 'none',
    borderBottomWidth: 4,
    borderBottomStyle: 'solid',
    borderBottomColor: 'transparent',
  },
  tabContainer: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 14,
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabTitle: {
    color: 'inherit',
  },
  tabActiveTitle: {
    fontWeight: '500',
  },
  indicator: {
    height: 3,
    width: '100%',
    backgroundColor: '#ffa200',
  },
});

export default ExploreTab;

import { useRouter } from 'next/router';
import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { A, colors, darkColors, P } from '../common/styleguide';
import CustomAppearanceContext from '../context/CustomAppearanceContext';

const NavigationTab = ({ title, path = `/${title.toLowerCase()}` }) => {
  const { isDark } = useContext(CustomAppearanceContext);
  const router = useRouter();
  const isActive = router.pathname === path;
  const activeBackground = isDark ? darkColors.powder : colors.gray5;

  return (
    <A
      href={path}
      style={[
        styles.tabLink,
        isActive && {
          backgroundColor: activeBackground,
        },
      ]}
      hoverStyle={{
        backgroundColor: isActive ? activeBackground : isDark ? darkColors.dark : colors.gray6,
        color: colors.secondary,
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
    color: colors.white,
    borderRadius: 4,
    marginRight: 10,
  },
  tabContainer: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 8,
  },
  tabActive: {
    backgroundColor: darkColors.powder,
  },
  tabTitle: {
    color: 'inherit',
  },
  tabActiveTitle: {
    fontWeight: '500',
  },
});

export default NavigationTab;

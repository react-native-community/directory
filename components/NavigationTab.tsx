import { useRouter } from 'next/router';
import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { A, colors, darkColors, P } from '~/common/styleguide';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';

type Props = {
  title: string;
  path?: string;
};

function NavigationTab({ title, path = `/${title.toLowerCase()}` }: Props) {
  const { isDark } = useContext(CustomAppearanceContext);
  const router = useRouter();
  const isActive = router.pathname === path;

  return (
    <A
      href={path}
      style={{
        ...styles.tabLink,
        ...(isActive && {
          backgroundColor: colors.primaryHover,
          color: colors.primary,
        }),
      }}
      hoverStyle={{
        backgroundColor: isActive
          ? colors.primaryHover
          : isDark
            ? darkColors.background
            : colors.gray6,
        color: isActive ? colors.primaryDark : colors.secondary,
      }}
      target="_self">
      <View style={styles.tabContainer}>
        <P style={[styles.tabTitle, isActive && styles.tabActiveTitle]}>{title}</P>
      </View>
    </A>
  );
}

const styles = StyleSheet.create({
  tabLink: {
    backgroundColor: 'transparent',
    textDecorationLine: 'none',
    color: colors.white,
    borderRadius: 4,
    // @ts-expect-error Transition is a valid web style property
    transition: 'color 0.33s, background-color 0.33s',
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
    fontWeight: 500,
  },
});

export default NavigationTab;

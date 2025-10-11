import { type PropsWithChildren, type ReactElement, useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, darkColors, H1, H2 } from '~/common/styleguide';
import { Logo } from '~/components/Icons';
import TopBar from '~/components/TopBar';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';

type NavigationProps = PropsWithChildren<{
  title?: string;
  description?: string;
  header?: ReactElement;
}>;

export default function Navigation({ title, description, children, header }: NavigationProps) {
  const { isDark } = useContext(CustomAppearanceContext);
  return (
    <>
      <TopBar />
      {header ? (
        header
      ) : (
        <View
          style={[
            styles.headerWrapper,
            { backgroundColor: isDark ? darkColors.dark : colors.gray6 },
          ]}>
          <Logo
            fill={isDark ? colors.gray7 : colors.gray5}
            width={580}
            height={520}
            style={styles.logoBackground}
          />
          <H1 style={styles.header}>{title}</H1>
          <H2 style={styles.headerDescription}>{description}</H2>
          {children}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    paddingVertical: 40,
    overflow: 'hidden',
  },
  header: {
    textAlign: 'center',
    color: colors.white,
    fontSize: 42,
    paddingHorizontal: 20,
  },
  headerDescription: {
    textAlign: 'center',
    color: colors.pewter,
    fontWeight: '500',
    fontSize: 16,
    paddingTop: 4,
    paddingBottom: 6,
    paddingHorizontal: 40,
  },
  logoBackground: {
    position: 'absolute',
    left: '50%',
    top: -76,
    marginLeft: -280,
    opacity: 0.15,
  },
});

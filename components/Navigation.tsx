import { type PropsWithChildren, type ReactElement, useContext } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, darkColors, H1, H2, useLayout } from '~/common/styleguide';
import { Logo } from '~/components/Icons';
import TopBar from '~/components/TopBar';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';

type NavigationProps = PropsWithChildren<{
  title?: string;
  description?: string;
  header?: ReactElement;
  style?: StyleProp<ViewStyle>;
}>;

export default function Navigation({
  title,
  description,
  children,
  header,
  style,
}: NavigationProps) {
  const { isDark } = useContext(CustomAppearanceContext);
  const { isSmallScreen } = useLayout();

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
            style,
          ]}>
          <Logo
            fill={isDark ? colors.gray7 : colors.gray5}
            width={580}
            height={520}
            style={styles.logoBackground}
          />
          <H1 style={[styles.header, isSmallScreen && styles.headerSmall]}>{title}</H1>
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
  headerSmall: {
    fontSize: 32,
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

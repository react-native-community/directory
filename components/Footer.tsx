import React, { FunctionComponent, SVGAttributes, useContext } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { A, P, colors, darkColors, useLayout } from '../common/styleguide';
import CustomAppearanceContext from '../context/CustomAppearanceContext';
import ContentContainer from './ContentContainer';
import {
  Logo,
  PlatformAndroid,
  PlatformIOS,
  PlatformMacOS,
  PlatformTvOS,
  PlatformWeb,
  PlatformWindows,
} from './Icons';
import VercelBanner from './VercelBanner';

type PlatformProps = {
  name: string;
  pkgName: string;
  url: string;
  Icon: FunctionComponent<SVGAttributes<SVGElement>>;
  style?: ViewStyle;
};

const Platform = ({ name, pkgName, url, Icon, style }: PlatformProps) => {
  const { isDark } = useContext(CustomAppearanceContext);
  const { isSmallScreen } = useLayout();

  const packageNameStyles = [
    styles.platformPackageName,
    { backgroundColor: isDark ? darkColors.powder : colors.gray2 },
  ];
  const packageNameHoverStyle = {
    backgroundColor: isDark ? colors.primary : colors.sky,
  };
  const iconColor = isDark ? darkColors.pewter : colors.gray5;
  const borderLeftColor = isDark ? darkColors.border : colors.gray2;

  return (
    <View
      style={[
        styles.platformItem,
        isSmallScreen
          ? { borderLeftWidth: 0 }
          : { borderLeftColor, borderLeftWidth: StyleSheet.hairlineWidth },
        style,
      ]}>
      {React.createElement(Icon, { fill: iconColor, width: 32, height: 32 })}
      <P style={styles.platformName}>{name}</P>
      <A href={url} style={packageNameStyles} hoverStyle={packageNameHoverStyle}>
        {pkgName}
      </A>
    </View>
  );
};

const Footer = () => {
  const { isDark } = useContext(CustomAppearanceContext);
  const { isSmallScreen } = useLayout();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? darkColors.subHeader : colors.gray1,
        },
      ]}>
      <ContentContainer>
        <View style={styles.platformsWrapper}>
          <Platform
            name="Android"
            pkgName="react-native"
            Icon={PlatformAndroid}
            url="https://github.com/facebook/react-native#readme"
            style={{ borderLeftWidth: 0 }}
          />
          <Platform
            name="iOS"
            pkgName="react-native"
            Icon={PlatformIOS}
            url="https://github.com/facebook/react-native#readme"
          />
          <Platform
            name="macOS"
            pkgName="react-native-macos"
            Icon={PlatformMacOS}
            url="https://github.com/microsoft/react-native-macos#readme"
          />
          <Platform
            name="tvOS"
            pkgName="react-native-tvos"
            Icon={PlatformTvOS}
            url="https://github.com/react-native-community/react-native-tvos#readme"
          />
          <Platform
            name="Web"
            pkgName="react-native-web"
            Icon={PlatformWeb}
            url="https://github.com/necolas/react-native-web#readme"
          />
          <Platform
            name="Windows"
            pkgName="react-native-windows"
            Icon={PlatformWindows}
            url="https://github.com/microsoft/react-native-windows#readme"
          />
        </View>
        <View style={[styles.footerTextWrapper, isSmallScreen && { flexDirection: 'column' }]}>
          <View style={[styles.footerTextContainer, isSmallScreen && { alignItems: 'center' }]}>
            <P style={[styles.footerText, { color: isDark ? darkColors.secondary : colors.gray5 }]}>
              Missing a library?{' '}
              <A href="https://github.com/react-native-community/react-native-directory#how-do-i-add-a-library">
                Add it to the directory
              </A>
              .
            </P>
            <P style={[styles.footerText, { color: isDark ? darkColors.secondary : colors.gray5 }]}>
              Want to learn more? Check out the{' '}
              <A href="https://reactnative.dev/docs/getting-started">official React Native docs</A>,
              and <A href="https://expo.dev">Expo</A>.
            </P>
          </View>
          <View style={[styles.bannerContainer, isSmallScreen && styles.bannerContainerSmall]}>
            <A
              href="https://vercel.com/?utm_source=rndir&utm_campaign=oss"
              style={styles.bannerLink}>
              <VercelBanner />
            </A>
          </View>
        </View>
        <View style={styles.logoContainer}>
          <Logo fill={isDark ? darkColors.powder : colors.gray3} width={42} height={38} />
        </View>
      </ContentContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 32,
    paddingBottom: 28,
    marginTop: 12,
  },
  footerTextWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  footerTextContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  footerText: {
    paddingVertical: 7,
    fontSize: 13,
  },
  platformsWrapper: {
    flexDirection: 'row',
    marginTop: 4,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  platformItem: {
    minWidth: '15%',
    paddingHorizontal: 24,
    marginBottom: 28,
    alignItems: 'center',
  },
  platformName: {
    marginTop: 8,
  },
  platformPackageName: {
    fontSize: 12,
    fontFamily: 'monospace',
    borderRadius: 4,
    paddingHorizontal: 8,
    lineHeight: 22,
    marginTop: 8,
  },
  bannerContainer: {
    alignSelf: 'center',
  },
  bannerContainerSmall: {
    marginTop: 24,
    alignItems: 'center',
  },
  bannerLink: {
    backgroundColor: 'transparent',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 32,
  },
});

export default Footer;

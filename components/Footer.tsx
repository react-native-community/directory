import { Header as HtmlHeader } from '@expo/html-elements/build/elements/Layout';
import React, { FunctionComponent, SVGAttributes, useContext } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { A, P, colors, darkColors, useLayout } from '../common/styleguide';
import ContentContainer from '../components/ContentContainer';
import CustomAppearanceContext from '../context/CustomAppearanceContext';
import {
  Logo,
  PlatformAndroid,
  PlatformIOS,
  PlatformMacOS,
  PlatformTvOS,
  PlatformWeb,
  PlatformWindows,
} from './Icons';

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
        <View
          style={[
            { paddingHorizontal: 20 },
            isSmallScreen ? { flexDirection: 'column' } : { flexDirection: 'row' },
          ]}>
          <View style={styles.footerTextContainer}>
            <P style={[styles.footerText, { color: isDark ? darkColors.secondary : colors.gray5 }]}>
              Missing a library?{' '}
              <A href="https://github.com/react-native-community/react-native-directory#how-do-i-add-a-library">
                Add it to the directory
              </A>
              .
            </P>
            <P style={[styles.footerText, { color: isDark ? darkColors.secondary : colors.gray5 }]}>
              Want to learn more about React Native? Check out the{' '}
              <A href="https://reactnative.dev/docs/getting-started">official React Native docs</A>,
              and <A href="https://expo.io">Expo</A>.
            </P>
          </View>
          <View style={[styles.bannerContainer, isSmallScreen && styles.bannerContainerSmall]}>
            <P style={styles.bannerText}>
              Black Lives Matter.{' '}
              <A
                target="_blank"
                href="https://support.eji.org/give/153413/#!/donation/checkout"
                style={styles.bannerLink}>
                Support the Equal Justice Initiative
              </A>
              .
            </P>
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
  footerTextContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
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
    backgroundColor: darkColors.veryDark,
    maxHeight: 52,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 8,
    borderRadius: 4,
  },
  bannerContainerSmall: {
    marginTop: 24,
    paddingVertical: 12,
    maxHeight: 64,
  },
  bannerText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
  bannerLink: {
    color: colors.primary,
    backgroundColor: darkColors.veryDark,
    textDecorationLine: 'underline',
    whiteSpace: 'nowrap',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 32,
  },
});

export default Footer;

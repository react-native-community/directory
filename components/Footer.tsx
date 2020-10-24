import React, { FunctionComponent, SVGAttributes } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { A, P, colors, darkColors, layout } from '../common/styleguide';
import ContentContainer from '../components/ContentContainer';
import CustomAppearanceContext from '../context/CustomAppearanceContext';
import {
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
  const isSmallScreen = layout.isSmallScreen();

  return (
    <CustomAppearanceContext.Consumer>
      {context => {
        const packageNameStyles = [
          styles.platformPackageName,
          { backgroundColor: context.isDark ? darkColors.powder : colors.gray2 },
        ];
        const packageNameHoverStyle = {
          backgroundColor: context.isDark ? colors.primary : colors.sky,
        };
        const iconColor = context.isDark ? darkColors.pewter : colors.gray5;
        const borderLeftColor = context.isDark ? darkColors.border : colors.gray2;

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
      }}
    </CustomAppearanceContext.Consumer>
  );
};

const Footer = () => (
  <CustomAppearanceContext.Consumer>
    {context => (
      <View
        style={[
          styles.container,
          {
            backgroundColor: context.isDark ? darkColors.subHeader : colors.gray1,
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
          <View>
            <P
              style={[
                styles.footerText,
                { color: context.isDark ? darkColors.secondary : colors.gray5 },
              ]}>
              Missing a library?{' '}
              <A href="https://github.com/react-native-community/react-native-directory#how-do-i-add-a-library">
                Add it to the directory
              </A>
              .
            </P>
            <P
              style={[
                styles.footerText,
                { color: context.isDark ? darkColors.secondary : colors.gray5 },
              ]}>
              Want to learn more about React Native? Check out the{' '}
              <A href="https://facebook.github.io/react-native/docs/getting-started.html">
                official React Native docs
              </A>
              , and <A href="https://expo.io">Expo</A>.
            </P>
          </View>
        </ContentContainer>
      </View>
    )}
  </CustomAppearanceContext.Consumer>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 32,
    paddingBottom: 28,
    marginTop: 12,
  },
  footerText: {
    textAlign: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
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
});

export default Footer;

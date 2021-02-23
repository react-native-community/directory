import { A, Header as HtmlHeader } from '@expo/html-elements';
import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { layout, colors, H5, P, darkColors } from '../common/styleguide';
import CustomAppearanceContext from '../context/CustomAppearanceContext';
import { Button } from './Button';
import { Logo, Plus } from './Icons';

export default function Header() {
  const isSmallScreen = layout.isSmallScreen();

  return (
    <CustomAppearanceContext.Consumer>
      {context => (
        <HtmlHeader>
          <View style={styles.bannerContainer}>
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
          <View
            style={[
              styles.header,
              {
                backgroundColor: context.isDark ? darkColors.veryDark : colors.gray7,
              },
            ]}>
            <View style={styles.headerContents}>
              <A href="/">
                <View style={styles.displayHorizontal}>
                  <Logo fill={colors.primary} width={29} height={26} />
                  <H5 style={isSmallScreen && styles.smallTitle}>
                    <Text style={styles.headerContentsTitle}>React Native Directory</Text>
                  </H5>
                </View>
              </A>
              <View style={styles.displayHorizontal}>
                <Button
                  onPress={() => context.setIsDark(!context.isDark)}
                  style={[styles.themeButton, isSmallScreen ? styles.themeButtonSmall : {}]}>
                  <Text style={styles.themeButtonText}>{context.isDark ? '☀️' : '🌒'}</Text>
                </Button>
                <Button href="https://github.com/react-native-directory/website#how-do-i-add-a-library">
                  <View style={styles.displayHorizontal}>
                    <Plus
                      width={14}
                      height={14}
                      fill={context.isDark ? colors.white : colors.black}
                    />
                    {!isSmallScreen && <P style={{ marginLeft: 6 }}>Add a library</P>}
                  </View>
                </Button>
              </View>
            </View>
          </View>
        </HtmlHeader>
      )}
    </CustomAppearanceContext.Consumer>
  );
}

let styles = StyleSheet.create({
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  bannerContainer: {
    backgroundColor: '#000',
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  bannerText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bannerLink: {
    color: colors.primary,
    textDecorationLine: 'underline',
    whiteSpace: 'nowrap',
  },
  headerContents: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: layout.maxWidth,
    paddingHorizontal: 16,
  },
  headerContentsTitle: {
    color: colors.primary,
    paddingLeft: 8,
  },
  displayHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallTitle: {
    fontSize: 18,
  },
  themeButton: {
    marginRight: 12,
  },
  themeButtonText: {
    fontSize: 18,
    marginTop: -1,
  },
  themeButtonSmall: {
    maxHeight: 30,
    maxWidth: 46,
    paddingHorizontal: 14,
  },
});

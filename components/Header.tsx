import { A, Header as HtmlHeader } from '@expo/html-elements';
import React, { useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { layout, colors, H5, P, darkColors, useLayout } from '../common/styleguide';
import CustomAppearanceContext from '../context/CustomAppearanceContext';
import { Button } from './Button';
import { Logo, Plus } from './Icons';

const Header = () => {
  const { isDark, setIsDark } = useContext(CustomAppearanceContext);
  const { isSmallScreen } = useLayout();

  return (
    <HtmlHeader
      style={[
        styles.header,
        {
          backgroundColor: isDark ? darkColors.veryDark : colors.gray7,
        },
      ]}>
      <View style={styles.headerContents}>
        <View style={styles.displayHorizontal}>
          <Logo fill={colors.primary} width={29} height={26} />
          <H5 style={isSmallScreen && styles.smallTitle}>
            <A href="/" style={styles.headerContentsTitle}>
              {isSmallScreen ? 'Directory' : 'React Native Directory'}
            </A>
          </H5>
        </View>
        <View style={styles.displayHorizontal}>
          <Button
            onPress={() => setIsDark(!isDark)}
            style={[styles.button, styles.themeButton, isSmallScreen && styles.themeButtonSmall]}>
            <Text style={styles.themeButtonText}>{isDark ? '☀️' : '🌒'}</Text>
          </Button>
          <Button
            href="https://github.com/react-native-directory/website#how-do-i-add-a-library"
            style={styles.button}
            openInNewTab>
            <View style={styles.displayHorizontal}>
              <Plus width={14} height={14} fill={isDark ? colors.white : colors.black} />
              {!isSmallScreen && <P style={{ marginLeft: 6 }}>Add a library</P>}
            </View>
          </Button>
        </View>
      </View>
    </HtmlHeader>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
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
    fontWeight: '600',
  },
  headerSubpageTitle: {
    color: colors.white,
    marginLeft: 32,
  },
  headerSubpageTitleSmall: {
    marginLeft: 20,
  },
  displayHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallTitle: {
    fontSize: 18,
  },
  button: {
    maxHeight: 34,
    paddingVertical: 8,
    paddingHorizontal: 16,
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

export default Header;

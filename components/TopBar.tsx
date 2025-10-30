import { Header as HtmlHeader } from '@expo/html-elements';
import Link from 'next/link';
import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { layout, colors, H5, P, darkColors, useLayout } from '~/common/styleguide';
import ContentContainer from '~/components/ContentContainer';
import NavigationTab from '~/components/NavigationTab';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';

import { Button } from './Button';
import { GitHub, Logo, Plus, ThemeDark, ThemeLight, Tools } from './Icons';
import Tooltip from './Tooltip';

export default function TopBar() {
  const { isDark, setIsDark } = useContext(CustomAppearanceContext);
  const { isSmallScreen, isBelowMaxWidth } = useLayout();

  return (
    <HtmlHeader
      style={[
        styles.header,
        {
          backgroundColor: isDark ? darkColors.veryDark : colors.gray7,
        },
      ]}>
      <View style={styles.headerContents}>
        <View style={[styles.displayHorizontal, !isBelowMaxWidth && styles.headerSide]}>
          <Logo fill={colors.primary} width={29} height={26} />
          <H5 style={[styles.headerTitle, isBelowMaxWidth && styles.smallTitle]}>
            <Link href="/" style={styles.headerContentsTitle} target="_self">
              {isBelowMaxWidth ? 'Directory' : 'React Native Directory'}
            </Link>
          </H5>
        </View>
        <View
          style={[
            isBelowMaxWidth && {
              display: 'contents',
            },
            isSmallScreen && {
              display: 'none',
            },
          ]}>
          <ContentContainer style={styles.tabsWrapper}>
            <NavigationTab title="Explore" path="/" />
            <NavigationTab title="Popular" />
            <NavigationTab title="Trending" />
          </ContentContainer>
        </View>
        <View
          style={[
            styles.displayHorizontal,
            { gap: 10, justifyContent: 'flex-end' },
            !isBelowMaxWidth && styles.headerSide,
          ]}>
          <Tooltip
            trigger={
              <View>
                <Button
                  aria-label="Toggle theme"
                  onPress={() => setIsDark(!isDark)}
                  style={[styles.button, styles.themeButtonSmall]}>
                  {isDark ? <ThemeLight fill={colors.white} /> : <ThemeDark fill={colors.white} />}
                </Button>
              </View>
            }>
            Toggle theme
          </Tooltip>
          <Tooltip
            trigger={
              <View>
                <Button
                  aria-label="Tools"
                  href="/tools"
                  style={[styles.button, styles.themeButtonSmall]}>
                  <Tools fill={colors.white} />
                </Button>
              </View>
            }>
            Tools
          </Tooltip>
          <Tooltip
            trigger={
              <View style={{ marginRight: 4 }}>
                <Button
                  openInNewTab
                  aria-label="GitHub repository"
                  href="https://github.com/react-native-community/directory"
                  style={[styles.button, styles.themeButtonSmall]}>
                  <GitHub fill={colors.white} />
                </Button>
              </View>
            }>
            GitHub
          </Tooltip>
          <Button
            openInNewTab
            href="https://github.com/react-native-community/directory/?tab=readme-ov-file#how-do-i-add-a-library"
            style={[styles.button, isSmallScreen && { width: 36 }]}>
            <View style={[styles.displayHorizontal, { gap: 4 }]}>
              <Plus
                width={14}
                height={14}
                fill={colors.white}
                style={!isSmallScreen ? { marginLeft: -2 } : undefined}
              />
              {!isSmallScreen && (
                <P style={{ marginLeft: 4, color: colors.white }}>Add a library</P>
              )}
            </View>
          </Button>
        </View>
      </View>
      <ContentContainer style={[styles.tabsWrapper, !isSmallScreen && { display: 'none' }]}>
        <NavigationTab title="Explore" path="/" />
        <NavigationTab title="Popular" />
        <NavigationTab title="Trending" />
      </ContentContainer>
    </HtmlHeader>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    rowGap: 10,
  },
  headerContents: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: layout.maxWidth,
    paddingHorizontal: 16,
    marginTop: -1.5,
  },
  headerTitle: {
    marginTop: -2,
  },
  headerContentsTitle: {
    color: colors.primary,
    paddingLeft: 8,
    fontWeight: 700,
    textDecorationLine: 'none',
  },
  headerSubpageTitle: {
    color: colors.white,
    marginLeft: 32,
  },
  headerSubpageTitleSmall: {
    marginLeft: 20,
  },
  headerSide: {
    minWidth: 255,
  },
  tabsWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
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
    minHeight: 34,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  themeButtonText: {
    fontSize: 18,
    marginTop: -1,
    userSelect: 'none',
  },
  themeButtonSmall: {
    paddingHorizontal: 4,
    paddingVertical: 0,
    backgroundColor: 'none',
    borderRadius: 40,
    minWidth: 34,
  },
});

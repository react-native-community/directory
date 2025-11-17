import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, darkColors, H3, P } from '~/common/styleguide';
import { Button } from '~/components/Button';
import ContentContainer from '~/components/ContentContainer';
import { GitHub } from '~/components/Icons';
import Navigation from '~/components/Navigation';
import PageMeta from '~/components/PageMeta';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';

export default function Tools() {
  const { isDark } = useContext(CustomAppearanceContext);
  const textColorStyle = {
    color: isDark ? colors.gray2 : colors.black,
  };

  const primaryButtonColorStyle = {
    backgroundColor: isDark ? darkColors.primaryDark : colors.primary,
  };
  const buttonColorStyle = {
    backgroundColor: isDark ? darkColors.border : colors.gray3,
    color: isDark ? colors.white : colors.black,
  };

  return (
    <>
      <PageMeta
        title="Tools"
        description="List of development tools, apps and websites using React Native Directory data."
        path="tools"
      />
      <Navigation
        title="Tools"
        description="List of development tools, apps and websites using React Native Directory data."
      />
      <ContentContainer style={styles.container}>
        <H3 style={[styles.subHeader, textColorStyle]}>React Native Directory VS Code extension</H3>
        <P style={[styles.paragraph, textColorStyle]}>
          Browse through the React Native Directory and perform actions related to the chosen
          package inside the built-in editor Command Palette.
        </P>
        <View style={styles.buttonsContainer}>
          <Button
            openInNewTab
            href="https://github.com/react-native-community/vscode-react-native-directory"
            style={[styles.button, primaryButtonColorStyle]}>
            <GitHub width={16} /> <span>GitHub</span>
          </Button>
          <Button
            openInNewTab
            href="https://marketplace.visualstudio.com/items?itemName=react-native-directory.vscode-react-native-directory"
            style={[styles.button, buttonColorStyle]}>
            <span>Visual Studio Marketplace</span>
          </Button>
          <Button
            openInNewTab
            href="https://open-vsx.org/extension/react-native-directory/vscode-react-native-directory"
            style={[styles.button, buttonColorStyle]}>
            <span>Open VSX</span>
          </Button>
        </View>
        <H3 style={[styles.subHeader, textColorStyle]}>React Native Directory Raycast extension</H3>
        <P style={[styles.paragraph, textColorStyle]}>
          A searchable and filterable list of React Native libraries inside Raycast.
        </P>
        <View style={styles.buttonsContainer}>
          <Button
            openInNewTab
            href="https://github.com/raycast/extensions/tree/main/extensions/react-native-directory"
            style={[styles.button, primaryButtonColorStyle]}>
            <GitHub width={16} /> <span>GitHub</span>
          </Button>
          <Button
            openInNewTab
            href="https://www.raycast.com/shubh_porwal/react-native-directory"
            style={[styles.button, buttonColorStyle]}>
            <span>Raycast Store</span>
          </Button>
        </View>
        <H3 style={[styles.subHeader, textColorStyle]}>expo-doctor</H3>
        <P style={[styles.paragraph, textColorStyle]}>
          CLI to check your Expo project for known issues and used libraries compatibility.
        </P>
        <View style={styles.buttonsContainer}>
          <Button
            openInNewTab
            href="https://github.com/expo/expo/tree/main/packages/expo-doctor"
            style={[styles.button, primaryButtonColorStyle]}>
            <GitHub width={16} /> <span>GitHub</span>
          </Button>
          <Button
            openInNewTab
            href="https://www.npmjs.com/package/expo-doctor"
            style={[styles.button, buttonColorStyle]}>
            <span>npm Registry</span>
          </Button>
        </View>
        <H3 style={[styles.subHeader, textColorStyle]}>React Native Package Checker</H3>
        <P style={[styles.paragraph, textColorStyle]}>
          Analyze React Native packages for New Architecture compatibility, check multiple packages
          at once, get detailed insights, and export reports.
        </P>
        <View style={styles.buttonsContainer}>
          <Button
            openInNewTab
            href="https://github.com/sandipshiwakoti/react-native-package-checker"
            style={[styles.button, primaryButtonColorStyle]}>
            <GitHub width={16} /> <span>GitHub</span>
          </Button>
          <Button
            openInNewTab
            href="https://react-native-package-checker.vercel.app/"
            style={[styles.button, buttonColorStyle]}>
            <span>Website</span>
          </Button>
        </View>{' '}
        <H3 style={[styles.subHeader, textColorStyle]}>
          React Native Package Checker VS Code Extension
        </H3>
        <P style={[styles.paragraph, textColorStyle]}>
          Check New Architecture compatibility and version requirements for React Native packages
          inside VS Code.
        </P>
        <View style={styles.buttonsContainer}>
          <Button
            openInNewTab
            href="https://github.com/sandipshiwakoti/vscode-react-native-package-checker"
            style={[styles.button, primaryButtonColorStyle]}>
            <GitHub width={16} /> <span>GitHub</span>
          </Button>
          <Button
            openInNewTab
            href="https://marketplace.visualstudio.com/items?itemName=sandipshiwakoti.vscode-react-native-package-checker"
            style={[styles.button, buttonColorStyle]}>
            <span>Visual Studio Marketplace</span>
          </Button>
          <Button
            openInNewTab
            href="https://open-vsx.org/extension/sandipshiwakoti/vscode-react-native-package-checker"
            style={[styles.button, buttonColorStyle]}>
            <span>Open VSX</span>
          </Button>
        </View>
        <br />
        <br />
      </ContentContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  subHeader: {
    fontSize: 22,
    marginTop: 16,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 17,
    lineHeight: 29,
    marginBottom: 17,
    fontWeight: 300,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  button: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    minHeight: 32,
    fontSize: 14,
    gap: 2,
  },
});

import ContentContainer from '~/components/ContentContainer';
import Navigation from '~/components/Navigation';
import PageMeta from '~/components/PageMeta';
import ToolEntry from '~/components/Tools/ToolEntry';
import tw from '~/util/tailwind';

export default function Tools() {
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
      <ContentContainer style={tw`my-10 px-4 gap-4`}>
        <ToolEntry
          name="React Native Directory VS Code extension"
          description="Browse through the React Native Directory and perform actions related to the chosen package inside the built-in editor Command Palette."
          githubUrl="https://github.com/react-native-community/vscode-react-native-directory"
          buttons={[
            {
              label: 'Visual Studio Marketplace',
              href: 'https://marketplace.visualstudio.com/items?itemName=react-native-directory.vscode-react-native-directory',
            },
            {
              label: 'Open VSX',
              href: 'https://open-vsx.org/extension/react-native-directory/vscode-react-native-directory',
            },
          ]}
        />
        <ToolEntry
          name="React Native Directory Raycast extension"
          description="A searchable and filterable list of React Native libraries inside Raycast."
          githubUrl="https://github.com/raycast/extensions/tree/main/extensions/react-native-directory"
          buttons={[
            {
              label: 'Raycast Store',
              href: 'https://www.raycast.com/shubh_porwal/react-native-directory',
            },
          ]}
        />
        <ToolEntry
          name="expo-doctor"
          description="CLI to check your Expo project for known issues and used libraries compatibility."
          githubUrl="https://github.com/expo/expo/tree/main/packages/expo-doctor"
          buttons={[
            {
              label: 'npm Registry',
              href: 'https://www.npmjs.com/package/expo-doctor',
            },
          ]}
        />
        <ToolEntry
          name="React Native Package Checker"
          description="Analyze React Native packages for New Architecture compatibility, check multiple packages at once, get detailed insights, and export reports."
          githubUrl="https://github.com/sandipshiwakoti/react-native-package-checker"
          buttons={[
            {
              label: 'Website',
              href: 'https://react-native-package-checker.vercel.app',
            },
          ]}
        />
        <ToolEntry
          name="React Native Package Checker VS Code Extension"
          description="Check New Architecture compatibility and version requirements for React Native packages inside VS Code."
          githubUrl="https://github.com/sandipshiwakoti/vscode-react-native-package-checker"
          buttons={[
            {
              label: 'Visual Studio Marketplace',
              href: 'https://marketplace.visualstudio.com/items?itemName=sandipshiwakoti.vscode-react-native-package-checker',
            },
            {
              label: 'Open VSX',
              href: 'https://open-vsx.org/extension/sandipshiwakoti/vscode-react-native-package-checker',
            },
          ]}
        />
      </ContentContainer>
    </>
  );
}

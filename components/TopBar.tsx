import { Header as HtmlHeader } from '@expo/html-elements';
import { useContext } from 'react';
import { View } from 'react-native';

import { A, H5, useLayout } from '~/common/styleguide';
import AddLibrarySelector from '~/components/AddLibrarySelector';
import ContentContainer from '~/components/ContentContainer';
import { GitHubIcon, Logo, ThemeDarkIcon, ThemeLightIcon, ToolsIcon } from '~/components/Icons';
import NavigationTab from '~/components/NavigationTab';
import TopBarIconButton from '~/components/TopBarIconButton';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';
import tw from '~/util/tailwind';

export default function TopBar() {
  const { toggleTheme } = useContext(CustomAppearanceContext);
  const { isSmallScreen, isBelowMaxWidth } = useLayout();

  return (
    <HtmlHeader
      style={tw`items-center justify-center gap-y-2.5 overflow-hidden bg-palette-gray7 py-3.5 dark:bg-very-dark`}>
      <View style={tw`-mt-[1.5px] w-full max-w-layout flex-row items-center justify-between px-4`}>
        <View style={[tw`flex-row items-center`, !isBelowMaxWidth && tw`min-w-[255px]`]}>
          <Logo style={tw`h-6.5 w-[29px] text-primary`} />
          <H5 style={[tw`-mt-0.5`, isBelowMaxWidth && tw`text-lg`]}>
            <A href="/" style={tw`ml-2 font-bold text-primary no-underline`}>
              {isBelowMaxWidth ? 'Directory' : 'React Native Directory'}
            </A>
          </H5>
        </View>
        <View style={[isBelowMaxWidth && tw`mr-auto`, isSmallScreen && tw`hidden`]}>
          <ContentContainer style={tw`flex-row gap-2.5 px-4`}>
            <NavigationTab title="Explore" path="/packages" />
            <NavigationTab title="Popular" />
            <NavigationTab title="Trending" />
          </ContentContainer>
        </View>
        <View
          style={[
            tw`flex-row items-center justify-end gap-2.5`,
            !isBelowMaxWidth && tw`min-w-[255px]`,
          ]}>
          <TopBarIconButton label="Toggle theme" tooltip="Toggle theme" onPress={toggleTheme}>
            {tw.prefixMatch('dark') ? (
              <ThemeLightIcon style={tw`text-white`} />
            ) : (
              <ThemeDarkIcon style={tw`text-white`} />
            )}
          </TopBarIconButton>
          <TopBarIconButton label="Tools" tooltip="Tools" href="/tools">
            <ToolsIcon style={tw`text-white`} />
          </TopBarIconButton>
          <View style={tw`mr-1`}>
            <TopBarIconButton
              label="GitHub repository"
              tooltip="GitHub"
              href="https://github.com/react-native-community/directory"
              openInNewTab>
              <GitHubIcon style={tw`size-6 text-white`} />
            </TopBarIconButton>
          </View>
          <AddLibrarySelector />
        </View>
      </View>
      <ContentContainer style={[tw`flex-row gap-2.5 px-4`, !isSmallScreen && tw`hidden`]}>
        <NavigationTab title="Explore" path="/packages" />
        <NavigationTab title="Popular" />
        <NavigationTab title="Trending" />
      </ContentContainer>
    </HtmlHeader>
  );
}

import { Header as HtmlHeader } from '@expo/html-elements';
import { useContext } from 'react';
import { View } from 'react-native';

import { A, H5, P, useLayout } from '~/common/styleguide';
import ContentContainer from '~/components/ContentContainer';
import NavigationTab from '~/components/NavigationTab';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';
import tw from '~/util/tailwind';

import { Button } from './Button';
import { GitHub, Logo, Plus, ThemeDark, ThemeLight, Tools } from './Icons';
import Tooltip from './Tooltip';

export default function TopBar() {
  const { toggleTheme } = useContext(CustomAppearanceContext);
  const { isSmallScreen, isBelowMaxWidth } = useLayout();

  return (
    <HtmlHeader
      style={tw`items-center justify-center gap-y-2.5 overflow-hidden bg-palette-gray7 py-3.5 dark:bg-very-dark`}>
      <View style={tw`-mt-[1.5px] w-full max-w-layout flex-row items-center justify-between px-4`}>
        <View style={[tw`flex-row items-center`, !isBelowMaxWidth && tw`min-w-[255px]`]}>
          <Logo style={tw`text-primary`} width={29} height={26} />
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
          <Tooltip
            trigger={
              <View>
                <Button
                  aria-label="Toggle theme"
                  onPress={toggleTheme}
                  style={tw`size-8.5 bg-transparent px-1`}
                  containerStyle={tw`rounded-full`}>
                  {tw.prefixMatch('dark') ? (
                    <ThemeLight style={tw`text-white`} />
                  ) : (
                    <ThemeDark style={tw`text-white`} />
                  )}
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
                  style={tw`size-8.5 bg-transparent px-1`}
                  containerStyle={tw`rounded-full`}>
                  <Tools style={tw`text-white`} />
                </Button>
              </View>
            }>
            Tools
          </Tooltip>
          <Tooltip
            trigger={
              <View style={tw`mr-1`}>
                <Button
                  openInNewTab
                  aria-label="GitHub repository"
                  href="https://github.com/react-native-community/directory"
                  style={tw`size-8.5 bg-transparent px-1`}
                  containerStyle={tw`rounded-full`}>
                  <GitHub style={tw`text-white`} />
                </Button>
              </View>
            }>
            GitHub
          </Tooltip>
          <Button
            openInNewTab
            href="https://github.com/react-native-community/directory/?tab=readme-ov-file#how-do-i-add-a-library"
            style={[tw`max-h-8.5 px-4 py-2`, isSmallScreen && tw`w-8.5`]}>
            <View style={tw`flex-row items-center gap-1`}>
              <Plus
                width={14}
                height={14}
                style={[tw`text-white`, !isSmallScreen && tw`-ml-0.5`]}
              />
              {!isSmallScreen && <P style={tw`ml-1 text-white`}>Add a library</P>}
            </View>
          </Button>
        </View>
      </View>
      <ContentContainer style={[tw`flex-row gap-2.5 px-4`, !isSmallScreen && tw`hidden`]}>
        <NavigationTab title="Explore" path="/" />
        <NavigationTab title="Popular" />
        <NavigationTab title="Trending" />
      </ContentContainer>
    </HtmlHeader>
  );
}

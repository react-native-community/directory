import { Header as HtmlHeader } from '@expo/html-elements';
import Link from 'next/link';
import { useContext } from 'react';
import { View } from 'react-native';

import { H5, P, useLayout } from '~/common/styleguide';
import ContentContainer from '~/components/ContentContainer';
import NavigationTab from '~/components/NavigationTab';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';
import tw from '~/util/tailwind';

import { Button } from './Button';
import { GitHub, Logo, Plus, ThemeDark, ThemeLight, Tools } from './Icons';
import Tooltip from './Tooltip';

export default function TopBar() {
  const { isDark, setIsDark } = useContext(CustomAppearanceContext);
  const { isSmallScreen, isBelowMaxWidth } = useLayout();

  return (
    <HtmlHeader
      style={tw`py-3.5 justify-center items-center overflow-hidden gap-y-2.5 bg-palette-gray7 dark:bg-very-dark`}>
      <View style={tw`flex-row w-full max-w-layout items-center justify-between px-4 -mt-[1.5px]`}>
        <View style={[tw`flex-row items-center`, !isBelowMaxWidth && tw`min-w-[255px]`]}>
          <Logo style={tw`text-primary`} width={29} height={26} />
          <H5 style={[tw`-mt-0.5`, isBelowMaxWidth && tw`text-lg`]}>
            <Link href="/" style={tw`text-primary ml-2 font-bold no-underline`}>
              {isBelowMaxWidth ? 'Directory' : 'React Native Directory'}
            </Link>
          </H5>
        </View>
        <View style={[isBelowMaxWidth && tw`mr-auto`, isSmallScreen && tw`hidden`]}>
          <ContentContainer style={tw`flex-row px-4 gap-2.5`}>
            <NavigationTab title="Explore" path="/" />
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
                  onPress={() => setIsDark(!isDark)}
                  style={tw`size-8.5 px-1 bg-transparent rounded-full`}>
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
                  style={tw`size-8.5 px-1 bg-transparent rounded-full`}>
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
                  style={tw`size-8.5 px-1 bg-transparent rounded-full`}>
                  <GitHub style={tw`text-white`} />
                </Button>
              </View>
            }>
            GitHub
          </Tooltip>
          <Button
            openInNewTab
            href="https://github.com/react-native-community/directory/?tab=readme-ov-file#how-do-i-add-a-library"
            style={[tw`px-4 py-2 max-h-8.5`, isSmallScreen && tw`w-8.5`]}>
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
      <ContentContainer style={[tw`flex-row px-4 gap-2.5`, !isSmallScreen && tw`hidden`]}>
        <NavigationTab title="Explore" path="/" />
        <NavigationTab title="Popular" />
        <NavigationTab title="Trending" />
      </ContentContainer>
    </HtmlHeader>
  );
}

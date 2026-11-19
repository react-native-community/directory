import { Header as HtmlHeader } from '@expo/html-elements';
import { use } from 'react';
import { View } from 'react-native';

import { A, H5, useLayout } from '~/common/styleguide';
import AddLibrarySelector from '~/components/AddLibrarySelector';
import ContentContainer from '~/components/ContentContainer';
import {
  GitHubIcon,
  Logo,
  SearchIcon,
  ThemeDarkIcon,
  ThemeLightIcon,
  ToolsIcon,
} from '~/components/Icons';
import NavigationTab from '~/components/NavigationTab';
import TopBarIconButton from '~/components/TopBarIconButton';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';
import { cx, useIsDark } from '~/util/tailwind';

type Props = {
  isSearchExpanded: boolean;
  onSearchPress: () => void;
};

export default function TopBar({ isSearchExpanded, onSearchPress }: Props) {
  const { toggleTheme } = use(CustomAppearanceContext);
  const { isSmallScreen, isBelowMaxWidth } = useLayout();
  const isDark = useIsDark();

  return (
    <HtmlHeader className="bg-palette-gray7 dark:bg-very-dark relative z-30 items-center justify-center gap-y-2.5 py-3.5">
      <View className="max-w-layout -mt-[1.5px] w-full flex-row items-center justify-between px-4">
        <View
          className={cx('flex-row items-center', cx(!isBelowMaxWidth && 'min-w-[255px] pr-16'))}>
          <Logo className="text-primary h-6.5 w-[29px]" />
          <H5 className={cx('-mt-0.5', cx(isBelowMaxWidth && 'text-lg'))}>
            <A href="/" className="text-primary ml-2 font-bold no-underline">
              {isBelowMaxWidth ? 'Directory' : 'React Native Directory'}
            </A>
          </H5>
        </View>
        <View className={cx(cx(isBelowMaxWidth && 'mr-auto'), cx(isSmallScreen && 'hidden'))}>
          <ContentContainer
            className={cx('flex-row gap-2.5 px-4', cx(isBelowMaxWidth && 'gap-1.5'))}>
            <NavigationTab title="Explore" path="/packages" />
            <NavigationTab title="Popular" />
            <NavigationTab title="Trending" />
          </ContentContainer>
        </View>
        <View
          className={cx(
            'flex-row items-center justify-end gap-2',
            cx(!isBelowMaxWidth && 'min-w-[255px]')
          )}>
          <TopBarIconButton
            label={isSearchExpanded ? 'Close search' : 'Search libraries'}
            tooltip={isSearchExpanded ? 'Close search' : 'Search libraries'}
            onPress={onSearchPress}>
            <SearchIcon className="text-white" />
          </TopBarIconButton>
          <TopBarIconButton label="Toggle theme" tooltip="Toggle theme" onPress={toggleTheme}>
            {isDark ? (
              <ThemeLightIcon className="text-white" />
            ) : (
              <ThemeDarkIcon className="text-white" />
            )}
          </TopBarIconButton>
          <TopBarIconButton label="Tools" tooltip="Tools" href="/tools">
            <ToolsIcon className="text-white" />
          </TopBarIconButton>
          <View className="mr-1">
            <TopBarIconButton
              label="GitHub repository"
              tooltip="GitHub"
              href="https://github.com/react-native-community/directory"
              openInNewTab>
              <GitHubIcon className="size-6 text-white" />
            </TopBarIconButton>
          </View>
          <AddLibrarySelector />
        </View>
      </View>
      <ContentContainer className={cx('flex-row gap-2.5 px-4', cx(!isSmallScreen && 'hidden'))}>
        <NavigationTab title="Explore" path="/packages" />
        <NavigationTab title="Popular" />
        <NavigationTab title="Trending" />
      </ContentContainer>
    </HtmlHeader>
  );
}

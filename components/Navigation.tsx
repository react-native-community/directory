import { type PropsWithChildren, type ReactElement } from 'react';
import { type StyleProp, View, type ViewStyle } from 'react-native';

import { H1, H2, useLayout } from '~/common/styleguide';
import { Logo } from '~/components/Icons';
import QuickSearch from '~/components/QuickSearch';
import TopBar from '~/components/TopBar';
import { useQuickSearchState } from '~/context/QuickSearchState';
import { cx } from '~/util/tailwind';

type NavigationProps = PropsWithChildren<{
  title?: string;
  description?: string;
  header?: ReactElement;
  subHeader?: ReactElement;
  className?: string;
  style?: StyleProp<ViewStyle>;
}>;

export default function Navigation({
  title,
  description,
  children,
  header,
  subHeader,
  className,
  style,
}: NavigationProps) {
  const { isSmallScreen } = useLayout();
  const {
    isExpanded: isSearchExpanded,
    isNavigating,
    setIsExpanded,
    setSearchValue,
  } = useQuickSearchState();
  const isSearchVisible = isSearchExpanded && !isNavigating;

  function handleSearchPress() {
    if (isNavigating) {
      return;
    }

    if (isSearchExpanded) {
      setIsExpanded(false);
      setSearchValue('');
      return;
    }

    const searchInput =
      document.getElementById('quick-search') ?? document.getElementById('search');
    if (searchInput) {
      searchInput.focus();
      return;
    }

    setIsExpanded(true);
  }

  return (
    <>
      <TopBar isSearchExpanded={isSearchVisible} onSearchPress={handleSearchPress} />
      {isSearchVisible && (
        <QuickSearch
          focusOnMount
          className="bg-palette-gray7 dark:bg-very-dark relative z-20 w-full self-center"
        />
      )}
      {header ?? (
        <View
          className={cx(
            'relative z-10 bg-palette-gray6 py-10 dark:bg-dark',
            className,
            cx(isSmallScreen && 'py-6')
          )}
          style={[style]}>
          <View className="absolute inset-0 overflow-hidden">
            <Logo className="text-palette-gray5 dark:text-palette-gray7 absolute top-[-76px] left-1/2 ml-[-280px] h-[520px] w-[580px] opacity-15" />
          </View>
          <H1
            style={{ fontSize: isSmallScreen ? 30 : 42 }}
            className={cx(
              'px-5 text-center text-[42px] leading-[54px] text-white',
              cx(isSmallScreen && 'text-3xl'),
              cx(!description && 'pb-3')
            )}>
            {title}
          </H1>
          {description && (
            <H2
              style={{ fontSize: 16 }}
              className="text-palette-gray3 dark:text-secondary px-10 py-1 text-center text-base font-normal!">
              {description}
            </H2>
          )}
          {children}
        </View>
      )}
      {subHeader}
    </>
  );
}

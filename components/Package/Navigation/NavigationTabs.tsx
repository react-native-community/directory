import { useRouter } from 'next/router';
import { useState } from 'react';
import { View } from 'react-native';

import NavigationTab from '~/components/NavigationTab';
import { type PackageNavigationTab } from '~/types';
import tw from '~/util/tailwind';

import { NavigationMobileMenu } from './NavigationMobileMenu';
import { useNavigationTabs } from './useNavigationTabs';

type Props = {
  tabs: PackageNavigationTab[];
};

const TABS_GAP = 8;

export default function NavigationTabs({ tabs }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const currentPath = decodeURIComponent(router.asPath.split('?')[0]);
  const activeIndex = tabs.findIndex(tab => decodeURIComponent(tab.path) === currentPath);

  const {
    visible,
    measuring,
    navigationRef,
    tabRef,
    triggerRef,
    onNavigationLayout,
    onTabLayout,
    onTriggerLayout,
  } = useNavigationTabs(tabs.length, TABS_GAP);

  const hiddenTabs = tabs.slice(visible);
  const isTriggerActive = activeIndex >= visible;
  const renderedTabs = measuring ? tabs : tabs.slice(0, visible);
  const hasHiddenTabs = measuring || hiddenTabs.length > 0;

  return (
    <View ref={navigationRef} style={tw`relative flex-1`} onLayout={onNavigationLayout}>
      <View
        style={[
          tw`flex-1 flex-row items-center`,
          measuring && tw`opacity-0`,
          measuring ? tw`pointer-events-none` : tw`pointer-events-auto`,
          { columnGap: TABS_GAP },
        ]}>
        {renderedTabs.map((tab, index) => (
          <View key={tab.title} ref={tabRef(index)} onLayout={onTabLayout(index)}>
            <NavigationTab {...tab} measurement={measuring} />
          </View>
        ))}
        {hasHiddenTabs && (
          <View ref={triggerRef} onLayout={onTriggerLayout}>
            <NavigationMobileMenu
              activeIndex={activeIndex}
              open={open}
              onOpenChange={setOpen}
              tabs={hiddenTabs}
              visible={visible}
              isTriggerActive={isTriggerActive}
            />
          </View>
        )}
      </View>
    </View>
  );
}

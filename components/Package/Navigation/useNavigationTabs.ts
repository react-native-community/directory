import { useEffectEvent, useLayoutEffect, useRef, useState } from 'react';
import { type LayoutChangeEvent, type ViewInstance } from 'react-native';

export function useNavigationTabs(tabs: number, gap: number) {
  const [navigationWidth, setNavigationWidth] = useState<number | null>(null);
  const [triggerWidth, setTriggerWidth] = useState<number | null>(null);
  const [tabWidths, setTabWidths] = useState<number[] | null>(null);

  const navigationNodeRef = useRef<ViewInstance | null>(null);
  const triggerNodeRef = useRef<ViewInstance | null>(null);
  const tabRefs = useRef<(ViewInstance | null)[]>([]);

  const measuredWidths = useRef<number[]>(null);
  const measuredCount = useRef<number>(0);

  function updateTabWidth(index: number, width: number) {
    const widths = (measuredWidths.current ??= Array.from({ length: tabs }, () => 0));
    if (widths[index] === width) {
      return;
    }
    if (!widths[index]) {
      measuredCount.current += 1;
    }
    widths[index] = width;
    if (measuredCount.current === tabs) {
      setTabWidths([...widths]);
    }
  }

  const onLayout = useEffectEvent(() => {
    if (navigationNodeRef.current) {
      const { width } = navigationNodeRef.current.getBoundingClientRect();
      setNavigationWidth(width);
    }
    if (triggerNodeRef.current) {
      const { width } = triggerNodeRef.current.getBoundingClientRect();
      setTriggerWidth(width);
    }
    tabRefs.current.forEach((tab, index) => {
      if (tab) {
        const { width } = tab.getBoundingClientRect();
        updateTabWidth(index, width);
      }
    });
  });

  useLayoutEffect(() => {
    onLayout();
  }, []);

  const measuring = navigationWidth === null || tabWidths === null || triggerWidth === null;

  let visible = tabs;

  if (!measuring) {
    const totalWidth = tabWidths.reduce((sum, width) => sum + width, 0) + gap * (tabs - 1);

    if (totalWidth > navigationWidth) {
      visible = 0;
      let usedWidth = 0;
      for (let index = 0; index < tabs; index++) {
        const withTab = usedWidth + tabWidths[index] + (index > 0 ? gap : 0);
        const hasTriggerAfter = index < tabs - 1;
        const withTrigger = withTab + (hasTriggerAfter ? gap + triggerWidth : 0);
        if (withTrigger > navigationWidth) {
          break;
        }
        usedWidth = withTab;
        visible = index + 1;
      }
    }
  }

  return {
    visible,
    measuring,
    navigationRef: (node: ViewInstance | null) => {
      navigationNodeRef.current = node;
    },
    tabRef: (index: number) => (node: ViewInstance | null) => {
      tabRefs.current[index] = node;
    },
    triggerRef: (node: ViewInstance | null) => {
      triggerNodeRef.current = node;
    },
    onNavigationLayout: (event: LayoutChangeEvent) =>
      setNavigationWidth(event.nativeEvent.layout.width),
    onTabLayout:
      (index: number) =>
      ({
        nativeEvent: {
          layout: { width },
        },
      }: LayoutChangeEvent) =>
        updateTabWidth(index, width),
    onTriggerLayout: (event: LayoutChangeEvent) => setTriggerWidth(event.nativeEvent.layout.width),
  };
}

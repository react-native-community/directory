import { type PropsWithChildren, type ReactElement, useEffect, useState } from 'react';
import { type StyleProp, View } from 'react-native';
import { type Style } from 'twrnc';

import { H6Section } from '~/common/styleguide';
import { Button } from '~/components/Button';
import { Arrow } from '~/components/Icons';
import tw from '~/util/tailwind';

import EntityCounter from './EntityCounter';

type Props = PropsWithChildren<{
  title: string;
  count?: number;
  rightSlot?: ReactElement;
  headerStyle?: StyleProp<Style>;
}>;

export default function CollapsibleSection({
  title,
  count,
  rightSlot,
  headerStyle,
  children,
}: Props) {
  const sectionKey = sanitizeTitle(title);
  const key = `@ReactNativeDirectory:PackageSectionCollapsed:${sectionKey}`;

  const [collapsed, setCollapsed] = useState<boolean>(Boolean(window.localStorage.getItem(key)));

  useEffect(() => {
    setCollapsed(window.localStorage.getItem(key) === 'true');
  }, [key]);

  async function toggleSection() {
    const nextState = !collapsed;
    setCollapsed(nextState);
    window.localStorage.setItem(key, nextState ? 'true' : 'false');
  }

  return (
    <>
      <View style={tw`flex-row items-center justify-between gap-1.5`}>
        <H6Section style={[tw`flex items-center gap-1.5`, headerStyle]}>
          {title}
          {count && <EntityCounter count={count} />}
        </H6Section>
        {!collapsed ? rightSlot : undefined}
        <Button
          onPress={toggleSection}
          style={tw`bg-palette-gray2 p-1 dark:bg-palette-gray7`}
          containerStyle={tw`mt-px`}
          aria-label={`${collapsed ? 'Expand' : 'Collapse'} section`}>
          <Arrow style={[tw`h-3 w-4 text-icon`, collapsed ? tw`rotate-90` : tw`rotate-270`]} />
        </Button>
      </View>
      {!collapsed && <View>{children}</View>}
    </>
  );
}

function sanitizeTitle(input: string) {
  return String(input)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

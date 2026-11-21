import { type PropsWithChildren, type ReactElement, useState } from 'react';
import { View } from 'react-native';

import { H6Section } from '~/common/styleguide';
import { Button } from '~/components/Button';
import { ArrowIcon } from '~/components/Icons';
import { getStoredFlagValue } from '~/util/localStorage';
import { cx } from '~/util/tailwind';

import EntityCounter from './EntityCounter';

type Props = PropsWithChildren<{
  title: string;
  count?: number;
  rightSlot?: ReactElement;
  headerClassName?: string;
}>;

export default function CollapsibleSection({
  title,
  count,
  rightSlot,
  headerClassName,
  children,
}: Props) {
  const sectionKey = sanitizeTitle(title);
  const key = `@ReactNativeDirectory:PackageSectionCollapsed:${sectionKey}`;

  const [collapsed, setCollapsed] = useState(() => getStoredFlagValue(key));

  async function toggleSection() {
    const nextState = !collapsed;
    setCollapsed(nextState);
    window.localStorage.setItem(key, nextState ? 'true' : 'false');
  }

  return (
    <>
      <View className="flex-row items-center justify-between gap-1.5">
        <H6Section className={cx('flex items-center gap-1.5', headerClassName)}>
          {title}
          {count ? <EntityCounter count={count} /> : null}
        </H6Section>
        {!collapsed ? rightSlot : undefined}
        <Button
          onPress={toggleSection}
          className="bg-palette-gray2 dark:bg-palette-gray7 p-1"
          containerClassName="mt-px"
          aria-label={`${collapsed ? 'Expand' : 'Collapse'} section`}>
          <ArrowIcon
            className={cx('h-3 w-4 text-icon', cx(collapsed ? 'rotate-90' : 'rotate-270'))}
          />
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

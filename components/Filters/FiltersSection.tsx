import { type PropsWithChildren, type ReactElement } from 'react';
import { View } from 'react-native';

import { Headline, useLayout } from '~/common/styleguide';
import { cx } from '~/util/tailwind';

type Props = PropsWithChildren<{
  title: string;
  rightSlot?: ReactElement;
}>;

export default function FiltersSection({ title, children, rightSlot }: Props) {
  const { isSmallScreen } = useLayout();

  return (
    <View className={cx('max-w-layout px-4 py-2', cx(isSmallScreen && 'max-w-full'))}>
      <Headline className={cx('mb-2 font-semibold text-secondary', cx(rightSlot && 'mb-1'))}>
        {title}
        {rightSlot}
      </Headline>
      <View className="flex-row flex-wrap">{children}</View>
    </View>
  );
}

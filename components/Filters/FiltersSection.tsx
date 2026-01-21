import { type PropsWithChildren, type ReactElement } from 'react';
import { View } from 'react-native';

import { Headline, useLayout } from '~/common/styleguide';
import tw from '~/util/tailwind';

type Props = PropsWithChildren<{
  title: string;
  rightSlot?: ReactElement;
}>;

export default function FiltersSection({ title, children, rightSlot }: Props) {
  const { isSmallScreen } = useLayout();

  return (
    <View style={[tw`max-w-layout px-4 py-2`, isSmallScreen && tw`max-w-full`]}>
      <Headline style={[tw`mb-2 font-semibold text-secondary`, rightSlot && tw`mb-1`]}>
        {title}
        {rightSlot}
      </Headline>
      <View style={tw`flex-row flex-wrap`}>{children}</View>
    </View>
  );
}

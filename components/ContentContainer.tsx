import { type PropsWithChildren } from 'react';
import { View, type ViewProps } from 'react-native';

import tw from '~/util/tailwind';

export default function ContentContainer({ children, style }: PropsWithChildren<ViewProps>) {
  return <View style={[tw`mx-auto w-full max-w-layout flex-1`, style]}>{children}</View>;
}

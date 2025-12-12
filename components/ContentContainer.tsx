import { type PropsWithChildren } from 'react';
import { View, type ViewProps } from 'react-native';

import tw from '~/util/tailwind';

export default function ContentContainer({ children, style }: PropsWithChildren<ViewProps>) {
  return <View style={[tw`w-full mx-auto max-w-layout`, style]}>{children}</View>;
}

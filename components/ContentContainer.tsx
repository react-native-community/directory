import { type PropsWithChildren } from 'react';
import { View, type ViewProps } from 'react-native';

import { cx } from '~/util/tailwind';

export default function ContentContainer({
  children,
  className,
  style,
  ...rest
}: PropsWithChildren<ViewProps>) {
  return (
    <View {...rest} className={cx('mx-auto w-full max-w-layout flex-1', className)} style={style}>
      {children}
    </View>
  );
}

import { type PropsWithChildren } from 'react';
import { type StyleProp, type TextStyle, View, type ViewStyle } from 'react-native';
import { type Style } from 'twrnc';

import { A, HoverEffect, P } from '~/common/styleguide';
import tw from '~/util/tailwind';

type Props = PropsWithChildren & {
  href?: string;
  onPress?: () => void;
  openInNewTab?: boolean;
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<Style>;
};

export function Button({
  children,
  href,
  onPress,
  style,
  containerStyle,
  openInNewTab,
  ...rest
}: Props) {
  const isLink = !!href;
  const buttonStyle = [
    tw`justify-center items-center rounded outline-offset-1 cursor-pointer select-none bg-primary-darker dark:bg-primary-dark`,
    style,
  ] as ViewStyle[];

  const content = typeof children === 'string' ? <P>{children}</P> : children;

  return (
    <HoverEffect
      style={containerStyle}
      onPress={isLink ? undefined : onPress}
      tabIndex={isLink ? -1 : 0}>
      {isLink ? (
        <A
          href={href}
          style={[tw`rounded font-sans no-underline`, containerStyle]}
          {...(openInNewTab ? { target: '_blank' } : {})}
          {...rest}>
          <View focusable={false} style={buttonStyle} accessible={false}>
            {content}
          </View>
        </A>
      ) : (
        <View role="button" focusable={false} style={buttonStyle} accessible={false} {...rest}>
          {content}
        </View>
      )}
    </HoverEffect>
  );
}

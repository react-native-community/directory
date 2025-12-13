import { A } from '@expo/html-elements';
import { type PropsWithChildren } from 'react';
import { type TextStyle, Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { HoverEffect, P } from '~/common/styleguide';
import tw from '~/util/tailwind';

type Props = PropsWithChildren & {
  href?: string;
  onPress?: () => void;
  openInNewTab?: boolean;
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
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
    // TODO: support outline offset
    tw`justify-center items-center rounded outline-offset-1 bg-primary-dark`,
    style,
  ];

  const content = typeof children === 'string' ? <P>{children}</P> : children;

  return (
    <HoverEffect style={containerStyle}>
      {isLink ? (
        <A
          href={href}
          style={{ borderRadius: 4, fontFamily: 'inherit', fontSize: 'inherit' }}
          {...(openInNewTab ? { target: '_blank' } : {})}
          {...rest}>
          <Pressable focusable={false} style={buttonStyle} accessible={false}>
            {content}
          </Pressable>
        </A>
      ) : (
        <Pressable onPress={onPress} style={buttonStyle} {...rest}>
          {content}
        </Pressable>
      )}
    </HoverEffect>
  );
}

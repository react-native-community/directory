import { A } from '@expo/html-elements';
import { type PropsWithChildren } from 'react';
import {
  StyleSheet,
  type TextStyle,
  Pressable,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { darkColors, HoverEffect, P } from '~/common/styleguide';

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
    styles.container,
    {
      backgroundColor: darkColors.primaryDark,
    },
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

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    outlineOffset: 1,
  },
});

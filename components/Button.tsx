import { A } from '@expo/html-elements';
import { PropsWithChildren, useContext } from 'react';
import { StyleSheet, TextStyle, Pressable } from 'react-native';

import { colors, darkColors, HoverEffect, P } from '~/common/styleguide';
import CustomAppearanceContext from '~/context/CustomAppearanceContext';

type Props = PropsWithChildren & {
  href?: string;
  onPress?: () => void;
  openInNewTab?: boolean;
  style?: TextStyle | TextStyle[];
};

export function Button({ children, href, onPress, style, openInNewTab, ...rest }: Props) {
  const { isDark } = useContext(CustomAppearanceContext);

  const isLink = !!href;
  const linkStyle = [
    styles.container,
    {
      backgroundColor: isDark ? darkColors.powder : colors.primaryDark,
    },
    style,
  ];

  const content = typeof children === 'string' ? <P>{children}</P> : children;

  return (
    <HoverEffect>
      {isLink ? (
        <A
          href={href}
          style={{ borderRadius: 4, fontFamily: 'inherit' }}
          {...(openInNewTab ? { target: '_blank' } : {})}
          {...rest}>
          <Pressable focusable={false} style={linkStyle} accessible={false}>
            {content}
          </Pressable>
        </A>
      ) : (
        <Pressable onPress={onPress} style={linkStyle} {...rest}>
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

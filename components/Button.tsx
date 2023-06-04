import { A } from '@expo/html-elements';
import { PropsWithChildren, useContext } from 'react';
import { StyleSheet, TouchableOpacity, TextStyle } from 'react-native';

import { colors, darkColors, P } from '../common/styleguide';
import CustomAppearanceContext from '../context/CustomAppearanceContext';

type Props = PropsWithChildren & {
  href?: string;
  onPress?: () => void;
  openInNewTab?: boolean;
  style?: TextStyle | TextStyle[];
};

export function Button(props: Props) {
  const { isDark } = useContext(CustomAppearanceContext);
  const { children, href, onPress, style, openInNewTab } = props;

  const isLink = !!href;
  const linkStyle = [
    styles.container,
    {
      backgroundColor: isDark ? darkColors.powder : colors.primaryDark,
    },
    style,
  ];

  const content = typeof children === 'string' ? <P>{children}</P> : children;

  return isLink ? (
    <A
      href={href}
      style={{ borderRadius: 4 }}
      {...(openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {/* @ts-ignore `focusable` should not work here, but it does... */}
      <TouchableOpacity focusable={false} style={linkStyle} accessible={false}>
        {content}
      </TouchableOpacity>
    </A>
  ) : (
    <TouchableOpacity onPress={onPress} style={linkStyle}>
      {content}
    </TouchableOpacity>
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

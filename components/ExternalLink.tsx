import React from 'react';
import { StyleSheet, Text, Platform } from 'react-native';
import { A } from '@expo/html-elements';
import { useHover } from 'react-native-web-hooks';

export default function ExternalLink({
  isColored = true,
  href,
  target = 'blank',
  children,
  style = null,
}) {
  let linkStyles: [any] = [isColored ? styles.bright : styles.plain];

  let linkRef = React.useRef();
  let isHovered = useHover(linkRef);
  if (isHovered) {
    linkStyles.push(isColored ? styles.brightHovered : styles.plainHovered);
  }

  return (
    <A href={href} target={target} style={[linkStyles, style]} ref={linkRef}>
      <Text>{children}</Text>
    </A>
  );
}

let styles = StyleSheet.create({
  bright: {
    color: 'rgba(65, 160, 248, 1)',
    textDecorationLine: 'none',
  },
  brightHovered: {
    textDecorationLine: 'underline',
  },
  plain: {
    color: '#000000',
    fontSize: 20,
    fontWeight: 'bold',
    textDecorationLine: 'none',
  },
  plainHovered: {
    opacity: 0.5,
  },
});

import React, { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { A } from '@expo/html-elements';
import { colors, P } from '../common/styleguide';

type Props = {
  children?: ReactNode;
  href?: string;
  onPress?: () => void;
  target?: string;
};

export function Button(props: Props) {
  const { children, href, onPress, target } = props;
  const isString = typeof children === 'string';
  const button = (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {isString ? <P>{children}</P> : children}
    </TouchableOpacity>
  );

  if (href) {
    return (
      <A href={href} target={target}>
        {button}
      </A>
    );
  }

  return button;
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: '400',
    fontSize: 16,
    color: colors.gray7,
  },
});

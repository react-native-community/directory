import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../common/styleguide';

type Props = {
  onPress: () => void;
  title: string;
};

export function Button(props: Props) {
  const { onPress, title } = props;
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
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

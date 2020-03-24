import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { A, Header, H2 } from '@expo/html-elements';
import { layout, colors } from '../../common/styleguide';
import { Button } from '../Button';
import { Snowflakes } from './Snowflakes';

export default function GlobalHeader() {
  return (
    <Header style={styles.header}>
      <View style={styles.headerContents}>
        <View style={styles.snowflakeContainer}>
          <Snowflakes />
        </View>
        <H2>
          <A href="/" style={styles.headerContentsTitle}>
            React Native Directory
          </A>
        </H2>
        <Button title="Add a library" onPress={() => {}} />
      </View>
    </Header>
  );
}

let styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: colors.gray7,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  headerContents: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: layout.maxWidth,
    paddingHorizontal: 16,
  },
  headerContentsTitle: {
    color: colors.primary,
    fontWeight: '500',
    fontSize: 20,
  },
  snowflakeContainer: {
    opacity: 0.25,
    position: 'absolute',
    left: -32,
    marginTop: 2,
  },
});

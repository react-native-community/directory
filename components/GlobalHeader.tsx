import * as React from 'react';
import { Text, Image, StyleSheet, Platform, View } from 'react-native';
import { A, Header } from '@expo/html-elements';
import ExternalLink from './ExternalLink';

export default function GlobalHeader({ count }) {
  return (
    <Header style={styles.header}>
      <View style={styles.headerContents}>
        <A href="/" style={styles.headerContentsLogo}>
          <Image
            source={require('../assets/logo.png')}
            accessibilityLabel="React Native Directory logo"
            style={{ width: 64, height: 64 }}
          />
        </A>

        <Text style={{ flexWrap: 'wrap', flex: 1, lineHeight: 22, fontSize: 16 }}>
          <Text style={styles.headerContentsTextStrong}>React Native Directory</Text> is a list of{' '}
          {count ? count : 0}{' '}
          <ExternalLink href="https://facebook.github.io/react-native/docs/getting-started.html">
            React Native
          </ExternalLink>{' '}
          libraries to help you build your projects.{' '}
        </Text>
      </View>
    </Header>
  );
}

let styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    alignItems: 'flex-start',
    ...Platform.select({
      web: {
        marginTop: '2rem',
        paddingVertical: 0,
      },
      default: {
        paddingVertical: 10,
      },
    }),
  },
  headerContents: {
    flexDirection: 'row',
    maxWidth: 450,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerContentsLogo: {
    flexShrink: 0,
    paddingRight: 8,
    textDecorationLine: 'none',
  },
  headerContentsTextStrong: {
    fontWeight: '700',
  },
});

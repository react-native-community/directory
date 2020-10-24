import { registerRootComponent } from 'expo';
import * as React from 'react';
import { Platform, View, Text } from 'react-native';

if (Platform.OS !== 'web') {
  const App = require('./native/App').default;
  registerRootComponent(App);
} else {
  // In case someone accidentally opens web via expo-cli
  registerRootComponent(() => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>
        Use <Text style={{ fontWeight: 'bold' }}>yarn start</Text> to start up Next.js rather than
        loading it through expo-cli. Use expo-cli to open the directory iOS and Android apps.
      </Text>
    </View>
  ));
}

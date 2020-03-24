import '@expo/match-media';
import React from 'react';
import { SplashScreen } from 'expo';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, useSafeArea } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import GlobalHeader from './components/GlobalHeader/GlobalHeader';
import LibraryList from './components/LibraryList';
import data from './assets/data.json';

function LoadingView() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
      <ActivityIndicator />
    </View>
  );
}

function App() {
  let insets = useSafeArea();
  let [isReady, setIsReady] = React.useState(false);
  let [libraries, setLibraries] = React.useState(null);

  React.useEffect(() => {
    async function loadResourcesAsync() {
      SplashScreen.preventAutoHide();
      try {
        await Font.loadAsync({
          'office-code': require('./assets/fonts/OfficeCodePro-Regular.ttf'),
          'office-code-medium': require('./assets/fonts/OfficeCodePro-Medium.ttf'),
        });
      } catch (_) {
      } finally {
        setIsReady(true);
        SplashScreen.hide();
      }
    }

    loadResourcesAsync();
  }, []);

  React.useEffect(() => {
    async function fetchLibrariesAsync() {
      let url = 'http://localhost:3000/api/libraries';
      let response = await fetch(url);
      let result = await response.json();
      setLibraries(result.libraries);
    }

    fetchLibrariesAsync();
  }, []);

  return (
    <ScrollView style={[styles.container, { marginTop: insets.top, marinBottom: insets.bottom }]}>
      {isReady ? (
        <>
          <GlobalHeader count={data.libraries.length} />
          {libraries === null ? <LoadingView /> : <LibraryList libraries={libraries} />}
        </>
      ) : null}
    </ScrollView>
  );
}

export default () => (
  <SafeAreaProvider>
    <App />
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

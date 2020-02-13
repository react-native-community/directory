import '@expo/match-media';
import React from 'react';
import { SplashScreen } from 'expo';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, useSafeArea } from 'react-native-safe-area-context';
import BottomSheet from 'reanimated-bottom-sheet';
import * as Font from 'expo-font';
import GlobalHeader from './components/GlobalHeader';
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
    <View style={{ flex: 1 }}>
      <ScrollView
        style={[styles.container, { marginTop: insets.top, marinBottom: insets.bottom }]}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 80 }}>
        {isReady ? (
          <>
            <GlobalHeader count={data.libraries.length} />
            <View
              style={{
                height: 1,
                width: '100%',
                backgroundColor: '#ececec',
                marginTop: 10,
                marginBottom: -10,
              }}
            />
            {libraries === null ? <LoadingView /> : <LibraryList libraries={libraries} />}
          </>
        ) : null}
      </ScrollView>
      <BottomSheet
        initialSnap={2}
        snapPoints={[500, 200, 50]}
        renderContent={() => (
          <View
            style={{
              height: 500,
              width: '100%',
              backgroundColor: '#fff',
              borderTopWidth: 1,
              borderTopColor: '#ececec',
            }}>
            <Text>filters should go here</Text>
          </View>
        )}
        renderHeader={() => (
          <View style={{ height: 100, width: '100%', backgroundColor: '#eee' }}>
            <Text>search box should go here</Text>
          </View>
        )}
      />
    </View>
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

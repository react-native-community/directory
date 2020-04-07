import * as React from 'react';
import { Text, View } from 'react-native';
import Library from '../components/Library';
import data from '../assets/data.json';

export default () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ marginHorizontal: 20, alignItems: 'center' }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Hello 👋</Text>
      <Text style={{ marginBottom: 20, textAlign: 'center', marginTop: 10 }}>
        Here is an example of re-using a component from the web-side on native 👇
      </Text>
    </View>
    <Library library={data.libraries[0]} />
  </View>
);

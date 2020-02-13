import * as React from 'react';
import fetch from 'isomorphic-fetch';
import { NextPageContext } from 'next';
import { StyleSheet, View } from 'react-native';
import LibraryList from '../components/LibraryList';
import PaginationControl from '../components/PaginationControl';
import getApiUrl from '../util/getApiUrl';
import urlWithQuery from '../util/urlWithQuery';

export default function App(props) {
  return (
    <View style={styles.container}>
      <PaginationControl
        query={props.query}
        total={props.data && props.data.total}
        style={{ marginTop: 15 }}
      />
      <LibraryList libraries={props.data && props.data.libraries} />
      <PaginationControl
        query={props.query}
        total={props.data && props.data.total}
        style={{ marginTop: 15 }}
      />
    </View>
  );
}

App.getInitialProps = async (ctx: NextPageContext) => {
  let url = getApiUrl(urlWithQuery('/libraries', ctx.query), ctx);
  let response = await fetch(url);
  let result = await response.json();

  return {
    data: result,
    query: ctx.query,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import { initStore, INITIAL_STATE } from '../common/store';
import data from '../build/data.json';

const skipMerge = ['initialState', 'initialProps', 'isServer', 'store'];
const storeKey = '__NEXT_REDUX_STORE__';

const initializeReduxStore = (ctx, initialState) => {
  const { req } = ctx;

  if (!process.browser) {
    if (!req._store) {
      req._store = initStore(initialState);
    }

    return req._store;
  }

  if (!window[storeKey]) {
    window[storeKey] = initStore(initialState);
  }

  return window[storeKey];
};

const composeComponentWithData = mapStateToProps => ComposedComponent => {
  const connectedComponent = connect.apply(null, [mapStateToProps])(
    ComposedComponent
  );

  return class WithDataHigherOrder extends Component {
    static async getInitialProps(ctx) {
      let initialState = INITIAL_STATE;

      if (ctx.query) {
        initialState.queryTopic = ctx.query.topic ? ctx.query.topic : undefined;

        initialState.querySearch = ctx.query.search ? ctx.query.search : '';

        initialState.libraries = ctx.query.libraries
          ? ctx.query.libraries
          : [...data.libraries];

        initialState.sortBy = ctx.query.sortBy ? ctx.query.sortBy : 'updated';

        initialState.support = ctx.query.support
          ? {
              ...initialState.support,
              ...ctx.query.support,
            }
          : INITIAL_STATE.support;
      }

      const store = initializeReduxStore(ctx, initialState);

      return {
        store,
        initialState,
        initialProps: ComposedComponent.getInitialProps
          ? await ComposedComponent.getInitialProps(ctx)
          : {},
        userAgent: ctx.req
          ? ctx.req.headers['user-agent']
          : navigator.userAgent,
      };
    }

    render() {
      const { initialState, initialProps, store } = this.props;
      const hasStore = store && store.dispatch && store.getState;
      const providerStore = hasStore
        ? this.props.store
        : initializeReduxStore({}, initialState);

      const mergedProps = {};

      Object.keys(this.props).forEach(p => {
        if (!~skipMerge.indexOf(p)) {
          mergedProps[p] = this.props[p];
        }
      });

      Object.keys(initialProps).forEach(p => {
        mergedProps[p] = initialProps[p];
      });

      return (
        <Provider store={providerStore}>
          {React.createElement(connectedComponent, mergedProps)}
        </Provider>
      );
    }
  };
};

const withData = mapStateToProps => composeComponentWithData(mapStateToProps);

export default withData;

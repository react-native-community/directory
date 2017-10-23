import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'glamor/aphrodite';

import {
  createNavigationItemsFromProps,
  createSupportItemsFromProps,
} from '../common/static-list-functions';

import SearchInput from '../components/SearchInput';
import NavigationItem from '../components/NavigationItem';
import NavigationSupportItem from '../components/NavigationSupportItem';

const renderNavigationItem = data => (
  <NavigationItem key={`navigation-${data.text}`} data={data} />
);

const renderSupportItem = data => (
  <NavigationSupportItem key={`navigation-${data.text}`} data={data} />
);

export default class Navigation extends React.PureComponent {
  static propTypes = {
    sortBy: PropTypes.string,
    querySearch: PropTypes.string,
    onSearch: PropTypes.func,
  };

  render() {
    const elements = createNavigationItemsFromProps(this.props).map(
      renderNavigationItem
    );

    const supportElements = createSupportItemsFromProps(this.props).map(
      renderSupportItem
    );

    return (
      <nav className={css(styles.navigation)}>
        <div className={css(styles.navigationContainer)}>
          <SearchInput
            placeholder={`Type here...`}
            query={this.props.querySearch}
            onSearch={this.props.onSearch}
          />
          <div className={css(styles.elements)}>
            <span className={css(styles.title)}>
              <span className={css(styles.text)}>
                Compatibility:{' '}
              </span>
            </span>
            {supportElements}
          </div>
          <div className={css(styles.elements)}>
            <span className={css(styles.title)}>
              <span className={css(styles.text)}>
                Order By:{' '}
              </span>
            </span>
            {elements}
          </div>
        </div>
      </nav>
    );
  }
}

let styles = StyleSheet.create({
  navigation: {
    margin: '2rem 0 0 0',
    borderBottom: '1px solid #ececec',
  },
  navigationContainer: {
    width: '100%',
    maxWidth: '1319px',
    padding: '0 24px 0 24px',
    boxSizing: 'border-box',
    margin: '0 auto 0 auto',
  },
  elements: {
    display: 'flex',
    alignItems: 'center',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  title: {
    fontFamily: `'office-code-medium', monospace`,
    display: 'inline-flex',
    alignItems: 'flex-end',
    flexDirection: 'column',
    margin: '0 16px 0 0',
    padding: '0 0 8px 0',
    height: '32px',
  },
  text: {
    fontSize: '0.8rem',
    margin: 'auto 0 0 0',
    whiteSpace: 'nowrap',
  },
});

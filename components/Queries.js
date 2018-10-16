import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';

import { StyleSheet, css } from 'glamor/aphrodite';

import { isEmptyOrNull } from '../common/strings';

export default class Queries extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    queryTopic: PropTypes.string,
    querySearch: PropTypes.string,
    sortBy: PropTypes.string,
  };

  _handleClearTopic = () => {
    window.location.href = `/${this.props.sortBy}`;
  };

  _handleClearSearch = () => {
    window.location.href = `/${this.props.sortBy}`;
  };

  render() {
    if (isEmptyOrNull(this.props.querySearch) && isEmptyOrNull(this.props.queryTopic)) {
      return null;
    }

    return (
      <div className={css(styles.container)}>
        <h2 className={css(styles.heading)}>Your queries</h2>
        <ul className={css(styles.list)}>
          {!isEmptyOrNull(this.props.querySearch) && (
            <li className={css(styles.item)}>
              <div className={css(styles.itemLeft)}>
                Searching for{' '}
                <strong className={css(styles.itemEmphasis)}>
                  “
                  {this.props.querySearch}
                  ”
                </strong>{' '}
                —{' '}
                <span className={css(styles.itemRight)}>
                  <span className={css(styles.itemLink)} onClick={this._handleClearSearch}>
                    Clear search
                  </span>
                </span>
              </div>
            </li>
          )}

          {!isEmptyOrNull(this.props.queryTopic) && (
            <li className={css(styles.item)}>
              <div className={css(styles.itemLeft)}>
                Selected{' '}
                <strong className={css(styles.itemEmphasis)}>
                  “{this.props.queryTopic}
                  ”{' '}
                </strong>{' '}
                —{' '}
                <span className={css(styles.itemRight)}>
                  <span className={css(styles.itemLink)} onClick={this._handleClearTopic}>
                    Clear topic
                  </span>
                </span>
              </div>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    padding: '27px 0 8px 0',
  },
  heading: {
    fontFamily: `'office-code-medium', monospace`,
    fontWeight: '400',
  },
  list: {
    display: 'block',
  },
  item: {
    fontFamily: `'office-code', monospace`,
    display: 'block',
    margin: '8px 0 0 0',
    lineHeight: '1.2rem',
  },
  itemEmphasis: {
    fontFamily: `'office-code-medium', monospace`,
    color: `rgba(250, 70, 83, 1)`,
  },
  itemLeft: {
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
    minWidth: '25%',
    width: '100%',
  },
  itemRight: {
    flexShrink: 0,
  },
  itemLink: {
    display: 'inline-block',
    textDecoration: 'underline',
    transition: 'all 200ms ease',
    transitionProperty: 'opacity, transform',
    cursor: 'pointer',
    ':hover': {
      opacity: 0.5,
    },
  },
});

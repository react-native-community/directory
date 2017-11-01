import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'glamor/aphrodite';

export default class SearchInput extends React.PureComponent {
  static PropTypes = {
    query: PropTypes.string,
  };

  _handleChange = e => {
    this.props.onSearch(e.target.value.toLowerCase());
  };

  render() {
    return (
      <div className={css(styles.input)}>
        <label htmlFor="search" className={css(styles.inputLeft)}>
          Search:
        </label>
        <input
          maxLength={32}
          name="search"
          onChange={this._handleChange}
          className={css(styles.inputControl)}
          placeholder={this.props.placeholder}
          value={this.props.query}
        />
      </div>
    );
  }
}

let styles = StyleSheet.create({
  input: {
    width: '100%',
    margin: '16px 0 8px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputLeft: {
    fontSize: '0.8rem',
    fontFamily: `'office-code-medium', monospace`,
    flexShrink: 0,
    margin: '0 16px 0 0',
  },
  inputControl: {
    fontFamily: `'office-code', monospace`,
    color: 'rgba(65, 160, 248, 1)',
    width: '100%',
    fontSize: '0.8rem',

    '@media (max-width: 768px)': {
      fontSize: '16px',
    },

    '::-webkit-input-placeholder': {
      /* Chrome/Opera/Safari */
      color: '#999999',
    },

    '::-moz-placeholder': {
      /* Firefox 19+ */
      color: '#999999',
    },

    ':-ms-input-placeholder': {
      /* IE 10+ */
      color: '#999999',
    },

    ':-moz-placeholder': {
      /* Firefox 18- */
      color: '#999999',
    },
  },
});

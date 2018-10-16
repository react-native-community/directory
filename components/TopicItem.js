import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { StyleSheet, css } from 'glamor/aphrodite';

class TopicItem extends React.PureComponent {
  static propTypes = {
    count: PropTypes.number,
  };

  render() {
    const href = `/${this.props.sortBy}/${this.props.children}`;
    return (
      <a className={css(styles.item)} href={href}>
        {this.props.children}
        [
        <span className={css(styles.itemCount)}>{this.props.count}</span>
        ]
      </a>
    );
  }
}

let styles = StyleSheet.create({
  item: {
    display: 'inline-block',
    margin: '0 8px 0 0',
    transition: 'all 200ms ease',
    transitionProperty: 'opacity, transform',
    cursor: 'pointer',
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
    fontFamily: `'office-code', monospace`,
    fontSize: '0.75rem',
    lineHeight: '1.1rem',
    color: 'rgba(0, 0, 0, 0.75)',

    ':visited': {
      color: 'inherit',
    },
    ':hover': {
      opacity: '0.5',
    },
    ':active': {
      transform: 'scale(1.1)',
    },
  },
  itemCount: {
    fontFamily: `'office-code-medium', monospace`,
    color: 'rgba(65, 160, 248, 1)',
  },
});

export default connect(state => {
  return { sortBy: state.sortBy };
})(TopicItem);

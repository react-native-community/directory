import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import { StyleSheet, css } from 'glamor/aphrodite';

export default class CustomLink extends React.PureComponent {
  static propTypes = {
    href: PropTypes.string,
    target: PropTypes.string,
    isStyled: PropTypes.bool,
    isDarkStyled: PropTypes.bool,
  };

  static defaultProps = {
    isStyled: false,
    isDarkStyled: false,
  };

  render() {
    const linkClassNames = css(
      this.props.isStyled ? styles.light : undefined,
      this.props.isDarkStyled ? styles.dark : undefined
    );

    return (
      <Link href={this.props.href}>
        <a target={this.props.target} className={linkClassNames}>
          {this.props.children}
        </a>
      </Link>
    );
  }
}

let styles = StyleSheet.create({
  light: {
    color: 'rgba(65, 160, 248, 1)',
    textDecoration: 'none',
    ':hover': {
      textDecoration: 'underline',
    },
    ':visited': {
      color: 'rgba(65, 160, 248, 1)',
    },
  },
  dark: {
    color: '#000000',
    textDecoration: 'none',
    transition: 'all 200ms ease',
    transitionProperty: 'opacity, transform',
    cursor: 'pointer',
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
    ':hover': {
      opacity: '0.5',
    },
    ':active': {
      transform: 'scale(1.2)',
    },
    ':visited': {
      color: '#000000',
    },
  },
});

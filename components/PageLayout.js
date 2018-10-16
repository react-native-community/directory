import React from 'react';

import { StyleSheet, css } from 'glamor/aphrodite';

export default props => {
  return (
    <div className={css(styles.layout)}>
      <div className={css(styles.left)}>{props.children}</div>
      <div className={css(styles.right)}>{props.rightSide}</div>
    </div>
  );
};

let styles = StyleSheet.create({
  layout: {
    width: '100%',
    maxWidth: '1319px',
    padding: '0 24px 0 24px',
    boxSizing: 'border-box',
    margin: '0 auto 0 auto',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
    },
  },
  left: {
    minWidth: '25%',
    width: '100%',
  },
  right: {
    padding: '0 0 48px 32px',
    borderLeft: '1px solid #ECECEC',
    flexShrink: 0,
    width: '260px',
    '@media (max-width: 768px)': {
      padding: '0 0 0 0',
      borderTop: '1px solid #ECECEC',
      borderLeft: 'none',
      flexShrink: 'unset',
      flexBasis: 'auto',
      width: '100%',
    },
  },
});

import React from 'react';

import { StyleSheet, css } from 'glamor/aphrodite';

export default props => {
  const columnClassNames = css(
    styles.column,
    props.isWide ? styles.columnWide : undefined,
    props.isBodyTextStyled ? styles.columnBody : undefined
  );

  return <div className={columnClassNames}>{props.children}</div>;
};

const styles = StyleSheet.create({
  column: {
    width: '30%',
    padding: '0 24px 0 0',
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
    '@media (max-width: 600px)': {
      width: '100%',
      padding: '0 0 0 0',
      margin: '0 0 16px 0',
    },
  },
  columnWide: {
    width: '40%',
    '@media (max-width: 600px)': {
      width: '100%',
    },
  },
  columnBody: {
    fontSize: '0.9rem',
    lineHeight: '1.3rem',
    color: '#24292E',
  },
});

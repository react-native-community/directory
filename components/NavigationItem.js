import React from 'react';

import { StyleSheet, css } from 'glamor/aphrodite';

export default props => {
  const parentClassNames = css(
    styles.item,
    props.data.isActive ? styles.itemActive : undefined,
    !props.data.isActive ? styles.itemInteractable : undefined
  );

  const childClassNames = css(styles.text, props.data.isActive ? styles.textActive : undefined);

  return (
    <a className={parentClassNames} href={props.data.href}>
      <span className={childClassNames}>{props.data.text}</span>
    </a>
  );
};

let styles = StyleSheet.create({
  item: {
    fontFamily: `'office-code', monospace`,
    display: 'inline-flex',
    alignItems: 'flex-end',
    flexDirection: 'column',
    margin: '0 24px 0 0',
    padding: '0 0 8px 0',
    height: '32px',
    textDecoration: 'none',
    color: '#000000',
    ':visited': {
      color: 'inherit',
    },
  },
  itemInteractable: {
    cursor: 'pointer',
    opacity: 1,
    transition: '200ms all ease',
    transitionProperty: 'opacity, transform',
    ':hover': {
      opacity: '0.8',
    },
  },
  itemActive: {
    boxShadow: '0 1px 0 rgba(65, 160, 248, 1)',
  },
  text: {
    fontSize: '0.8rem',
    margin: 'auto 0 0 0',
  },
  textActive: {
    color: 'rgba(65, 160, 248, 1)',
  },
});

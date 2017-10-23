import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, css } from 'glamor/aphrodite';

const update = (dispatch, category, isActive) => {
  return dispatch({
    type: 'UPDATE_SUPPORT_FILTER',
    support: {
      [`${category.toLowerCase()}`]: !isActive,
    },
  });
};

const NavigationSupportItem = props => {
  const parentClassNames = css(styles.item, styles.itemInteractable);
  const childClassNames = css(styles.text);
  const supportClassNames = css(
    styles.emphasis,
    props.data.isActive ? styles.emphasisRequired : undefined
  );

  return (
    <span
      className={parentClassNames}
      onClick={() =>
        update(props.dispatch, props.data.text, props.data.isActive)}>
      <span className={childClassNames}>
        [<span className={supportClassNames}>
          {!props.data.isActive ? 'Optional' : 'Required'}
        </span>]{' '}{props.data.text}
      </span>
    </span>
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
  text: {
    fontSize: '0.8rem',
    margin: 'auto 0 0 0',
  },
  emphasis: {
    color: 'rgba(65, 160, 248, 1)',
  },
  emphasisRequired: {
    color: 'rgba(250, 70, 83, 1)',
  },
});

export default connect(state => {
  return {};
})(NavigationSupportItem);

import React from 'react';
import { connect } from 'react-redux';

const update = (dispatch, category, isActive) => {
  return dispatch({
    type: 'UPDATE_SUPPORT_FILTER',
    support: {
      [`${category.toLowerCase()}`]: !isActive
    },
  })
}

const NavigationSupportItem = props => {
  const parentClassNames = `navigation-item navigation-item--interactable`;
  const childClassNames = `navigation-item-text`;
  const supportClassNames = `emphasis
    ${props.data.isActive ? 'emphasis--required' : undefined}`;

  return (
    <span className={parentClassNames} 
      onClick={() => update(props.dispatch, props.data.text, props.data.isActive)}>
      <style jsx>{`
        .navigation-item {
          font-family: 'office-code', monospace;
          display: inline-flex;
          align-items: flex-end;
          flex-direction: column;
          margin: 0 24px 0 0;
          padding: 0 0 8px 0;
          height: 32px;
          text-decoration: none;
          color: #000000;

          &:visited {
            color: inherit;
          }
        }

        .navigation-item--interactable {
          cursor: pointer;
          opacity: 1;
          transition: 200ms all ease;
          transition-property: opacity, transform;
          opacity: 1;

          &:hover {
            opacity: 0.8;
          }
        }

        .navigation-item-text {
          font-size: 0.8rem;
          margin: auto 0 0 0;
        }

        .emphasis {
          color: rgba(65, 160, 248, 1);
        }

        .emphasis--required {
          color: rgba(250, 70, 83, 1);
        }
      `}</style>
      <span className={childClassNames}>
        [<span className={supportClassNames}>
          {!props.data.isActive ? 'Optional' : 'Required'}
        </span>]{' '}{props.data.text}
      </span>
    </span>
  );
};

export default connect(state => { return {}; })(NavigationSupportItem);
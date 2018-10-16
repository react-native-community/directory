import React from 'react';
import PropTypes from 'prop-types';

import { PAGINATION_BREAKPOINT } from '../common/constants';
import { StyleSheet, css } from 'glamor/aphrodite';

const getSectionsArray = props => {
  let sections = [];
  let i = 0;

  while (i < props.libraries.length) {
    const start = i;
    const end = Math.min(i + PAGINATION_BREAKPOINT, props.libraries.length);

    sections.push({
      start,
      end,
      isActive: i === props.rangeStart,
      onClick: () => {
        if (document) {
          document.body.scrollTop = document.documentElement.scrollTop = 0;
        }

        props.dispatch({
          type: 'SET_PAGINATION',
          start,
          end,
        });
      },
    });

    i = i + PAGINATION_BREAKPOINT;
  }

  return sections;
};

export default class Pagination extends React.PureComponent {
  static propTypes = {
    isMobile: PropTypes.bool,
    rangeStart: PropTypes.number,
    rangeEnd: PropTypes.number,
    libraries: PropTypes.array,
    dispatch: PropTypes.func,
  };

  render() {
    if (this.props.libraries.length < PAGINATION_BREAKPOINT) {
      return null;
    }

    const elements = getSectionsArray(this.props).map(s => {
      const paginationItemClasses = css(
        styles.item,
        s.isActive ? styles.itemActive : undefined,
        !s.isActive ? styles.itemInteractable : undefined
      );

      const onClick = this.props.isMobile ? undefined : s.onClick;
      const onTouchStart = this.props.isMobile ? s.onClick : undefined;

      return (
        <li
          className={paginationItemClasses}
          onClick={onClick}
          onTouchStart={onTouchStart}
          key={`pagination-${s.start}-${s.end}`}>
          {s.start + 1}—{s.end}
        </li>
      );
    });

    return (
      <div className="pagination">
        <ul className={css(styles.list)}>
          <span className={css(styles.heading)}>
            <span className={css(styles.headingText)}>Pages:</span>
          </span>
          {elements}
        </ul>
      </div>
    );
  }
}

let styles = StyleSheet.create({
  heading: {
    fontFamily: `'office-code-medium', monospace`,
    display: 'inline-flex',
    margin: '12px 16px 12px 0',
  },
  headingText: {
    fontFamily: `'office-code-medium', monospace`,
    fontWeight: '400',
    fontSize: '0.8rem',
    whiteSpace: 'nowrap',
  },
  list: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  item: {
    fontFamily: `'office-code', monospace`,
    color: 'rgba(0, 0, 0, 0.6)',
    display: 'inline-flex',
    fontSize: '0.8rem',
    margin: '12px 24px 12px 0',
  },
  itemActive: {
    color: 'rgba(65, 160, 248, 1)',
  },
  itemInteractable: {
    ':hover': {
      textDecoration: 'underline',
      cursor: 'pointer',
    },
    ':visited': {
      color: 'rgba(65, 160, 248, 1)',
    },
  },
});

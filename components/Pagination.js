import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { PAGINATION_BREAKPOINT } from '../common/constants';

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

class Pagination extends React.PureComponent {
  static propTypes = {
    rangeStart: PropTypes.number,
    rangeEnd: PropTypes.number,
    libraries: PropTypes.array,
  };

  render() {
    if (this.props.libraries.length < PAGINATION_BREAKPOINT) {
      return null;
    }

    const elements = getSectionsArray(this.props).map(s => {
      const paginationItemClasses = `pagination-list-item
      ${s.isActive ? 'pagination-list-item--active' : undefined}
      ${!s.isActive ? 'pagination-list-item--interactable' : undefined}`;

      return (
        <li
          className={paginationItemClasses}
          onClick={s.onClick}
          key={`pagination-${s.start}-${s.end}`}>
          <style jsx>{`
            .pagination-list-item {
              font-family: 'office-code', monospace;
              color: rgba(0, 0, 0, 0.8);
              display: inline-flex;
              font-size: 0.8rem;
              margin: 12px 24px 12px 0;
            }

            .pagination-list-item--active {
              color: rgba(65, 160, 248, 1);
            }

            .pagination-list-item--interactable {
              &:hover {
                text-decoration: underline;
                cursor: pointer;
              }

              &:visited {
                color: rgba(65, 160, 248, 1);
              }
            }
          `}</style>
          {s.start + 1}—{s.end}
        </li>
      );
    });

    return (
      <div className="pagination">
        <style jsx>{`
          .pagination {
          }

          .pagination-heading {
            font-family: 'office-code-medium', monospace;
            display: inline-flex;
            margin: 12px 16px 12px 0;
          }

          .pagination-heading-text {
            font-family: 'office-code-medium', monospace;
            font-weight: 400;
            font-size: 0.8rem;
            white-space: nowrap;
          }

          .pagination-list {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
          }
        `}</style>
        <ul className="pagination-list">
          <span className="pagination-heading">
            <span className="pagination-heading-text">Pages:</span>
          </span>
          {elements}
        </ul>
      </div>
    );
  }
}

export default connect(state => {
  return {
    rangeStart: state.rangeStart,
    rangeEnd: state.rangeEnd,
  };
})(Pagination);

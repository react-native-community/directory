import React from 'react';
import PropTypes from 'prop-types';
import SearchInput from '../components/SearchInput';
import { connect } from 'react-redux';

const renderNavigationItem = item => {
  return (
    <span
      key={`navigation-${item.text}`}
      className={`navigation-item
        ${item.active ? 'navigation-item-active' : undefined}
        ${!item.active ? 'navigation-interactable' : undefined}`}
      onClick={item.onClick}>
      <style jsx>{`
        .navigation-item {
          display: inline-flex;
          align-items: flex-end;
          flex-direction: column;
          margin-right: 24px;
          height: 32px;
          padding-bottom: 8px;
          font-family: 'office-code', monospace;
        }

        .navigation-interactable {
          cursor: pointer;
          opacity: 1;
          transition: 200ms all ease;
          transition-property: opacity, transform;
          opacity: 0.6;
          &:hover {
            opacity: 0.8;
          }
        }

        .navigation-item-active {
          box-shadow: 0 1px 0 rgba(65, 160, 248, 1);
        }

        .navigation-active {
          color: rgba(65, 160, 248, 1);
        }

        .navigation-item-number {
          font-size: 2.75rem;
        }

        .navigation-item-text {
          font-size: 0.8rem;
          margin-top: auto;
        }

        .navigation-item-text-active {
          color: rgba(65, 160, 248, 1);
        }
      `}</style>
      <span
        className={`navigation-item-text ${item.active
          ? 'navigation-item-text-active'
          : undefined}`}>
        {item.text}
      </span>
    </span>
  );
};

const navigationElements = props => [
  {
    text: 'Last Update',
    active: props.sortBy === 'updated',
    onClick: () => {
      return props.dispatch({
        sortBy: 'updated',
        type: 'SORT_BY',
      });
    },
  },
  {
    text: 'Recommended',
    active: props.sortBy === 'approved',
    onClick: () => {
      return props.dispatch({
        sortBy: 'approved',
        type: 'SORT_BY',
      });
    },
  },
  {
    text: 'Compatibility',
    active: props.sortBy === 'compatibility',
    onClick: () => {
      return props.dispatch({
        sortBy: 'compatibility',
        type: 'SORT_BY',
      });
    },
  },
  {
    text: 'Health',
    active: props.sortBy === 'health',
    onClick: () => {
      return props.dispatch({
        sortBy: 'health',
        type: 'SORT_BY',
      });
    },
  },
  {
    text: 'Downloads',
    active: props.sortBy === 'downloads',
    onClick: () => {
      return props.dispatch({
        sortBy: 'downloads',
        type: 'SORT_BY',
      });
    },
  },
  {
    text: 'Issues',
    active: props.sortBy === 'issues',
    onClick: () => {
      return props.dispatch({
        sortBy: 'issues',
        type: 'SORT_BY',
      });
    },
  },
  {
    text: 'Stars',
    active: props.sortBy === 'stars',
    onClick: () => {
      return props.dispatch({
        sortBy: 'stars',
        type: 'SORT_BY',
      });
    },
  },
];

class Navigation extends React.PureComponent {
  static propTypes = {
    sortBy: PropTypes.string,
  };

  render() {
    const elements = navigationElements(this.props).map(renderNavigationItem);

    return (
      <div className="container">
        <style jsx>{`
          .container {
            margin: 2rem 0 0 0;
            border-bottom: 1px solid #ececec;
          }

          .navigation {
            width: 100%;
            max-width: 1319px;
            padding: 0 24px 0 24px;
            box-sizing: border-box;
            margin: 0 auto 0 auto;
          }

          .navigation-elements {
            display: flex;
            align-items: center;
            @media (max-width: 768px) {
              display: none;
            }
          }

          .navigation-title {
            display: inline-flex;
            align-items: flex-end;
            flex-direction: column;
            margin-right: 16px;
            height: 32px;
            padding-bottom: 8px;
            font-family: 'office-code-medium', monospace;
          }

          .navigation-title-text {
            font-size: 0.8rem;
            margin-top: auto;
            white-space: nowrap;
          }
        `}</style>
        <nav className="navigation">
          <SearchInput placeholder={`Type here...`} />
          <div className="navigation-elements">
            <span className="navigation-title">
              <span className="navigation-title-text">Organize By: </span>
            </span>
            {elements}
          </div>
        </nav>
      </div>
    );
  }
}

export default connect(state => state)(Navigation);

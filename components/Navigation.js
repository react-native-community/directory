import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SearchInput from '../components/SearchInput';

const renderNavigationItem = item => {
  return (
    <span
      className={`navigation-item
        ${item.active ? 'navigation-item-active' : undefined}
        ${!item.active ? 'navigation-interactable' : undefined}`}
      onClick={item.onClick}>
      <style jsx>{`
          .navigation-item {
            display: inline-flex;
            align-items: column;
            flex-direction: column;
            margin-right: 36px;
            padding-bottom: 8px;
            box-shadow: 0 2px 0 black;
          }

          .navigation-interactable {
            cursor: pointer;
            opacity: 1;
            transition: 200ms opacity ease;
            &:hover {
              opacity: 0.6;
            }
          }

          .navigation-item-active {
            box-shadow: 0 2px 0 rgba(65, 160, 248, 1);
          }

          .navigation-active {
            color: rgba(65, 160, 248, 1);
          }

          .navigation-item-number {
            font-size: 2.75rem;
          }

          .navigation-item-text {
            margin-top: 16px;
            font-size: 0.8rem;
          }
        `}</style>
      <span
        className={`navigation-item-number ${item.active ? 'navigation-active' : undefined}`}>
        {item.top}
      </span>
      <span className="navigation-item-text">{item.bottom}</span>
    </span>
  );
};

class Navigation extends React.PureComponent {
  static propTypes = {
    category: PropTypes.string,
  };

  render() {
    return (
      <div className="container">
        <style jsx>{`
          .container {
            margin: 2rem 0 0 0;
            border-bottom: 1px solid #ECECEC;

            @media (max-width: 480px) {
              margin: 1rem 0 0 0;
            }
          }

          .navigation {
            width: 100%;
            max-width: 1319px;
            padding: 0 24px 0 24px;
            box-sizing: border-box;
            margin: 0 auto 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;

            @media (max-width: 768px) {
              padding: 0;
              flex-direction: column-reverse;
            }
          }

          .navigation-left {
            flex-shrink: 0;

            @media (max-width: 768px) {
              padding: 24px 24px 0 24px;
              display: flex;
              flex-direction: row;
              width: 100%;
            }
          }

          .navigation-right {
            min-width: 25%;
            width: 100%;

            @media (max-width: 768px) {
              padding: 16px 24px 16px 24px;
              border-top: 1px solid #ECECEC;
              border-bottom: 1px solid #ECECEC;
            }
          }
        `}</style>
        <nav className="navigation">
          <div className="navigation-left">
            {renderNavigationItem({
              top: this.props.all.length,
              bottom: 'All React Native',
              active: this.props.category === 'all',
              onClick: () => {
                window.location.href = '/';
              },
            })}
            {renderNavigationItem({
              top: this.props.expo.length,
              bottom: 'Compatible with Expo',
              active: this.props.category === 'expo',
              onClick: () => {
                window.location.href = '/expo';
              },
            })}
          </div>
          <div className="navigation-right">
            <SearchInput placeholder={`“Type here to search...”`} />
          </div>
        </nav>
      </div>
    );
  }
}

export default connect(state => state)(Navigation);

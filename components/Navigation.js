import React from 'react';
import PropTypes from 'prop-types';

import {
  createNavigationItemsFromProps,
  createSupportItemsFromProps
} from '../common/static-list-functions';

import SearchInput from '../components/SearchInput';
import NavigationItem from '../components/NavigationItem';
import NavigationSupportItem from '../components/NavigationSupportItem';

const renderNavigationItem = data => (
  <NavigationItem key={`navigation-${data.text}`} data={data} />
);

const renderSupportItem = data => (
  <NavigationSupportItem key={`navigation-${data.text}`} data={data} />
);

export default class Navigation extends React.PureComponent {
  static propTypes = {
    sortBy: PropTypes.string,
    querySearch: PropTypes.string,
    onSearch: PropTypes.func,
  };

  render() {
    const elements = createNavigationItemsFromProps(this.props).map(
      renderNavigationItem
    );

    const supportElements = createSupportItemsFromProps(this.props).map(
      renderSupportItem
    );

    return (
      <nav className="navigation">
        <style jsx>{`
          .navigation {
            margin: 2rem 0 0 0;
            border-bottom: 1px solid #ececec;
          }

          .navigation-container {
            width: 100%;
            max-width: 1319px;
            padding: 0 24px 0 24px;
            box-sizing: border-box;
            margin: 0 auto 0 auto;
          }

          .navigation-container-elements {
            display: flex;
            align-items: center;
            @media (max-width: 768px) {
              display: none;
            }
          }

          .navigation-container-title {
            font-family: 'office-code-medium', monospace;
            display: inline-flex;
            align-items: flex-end;
            flex-direction: column;
            margin: 0 16px 0 0;
            padding: 0 0 8px 0;
            height: 32px;
          }

          .navigation-container-title-text {
            font-size: 0.8rem;
            margin: auto 0 0 0;
            white-space: nowrap;
          }
        `}</style>
        <div className="navigation-container">
          <SearchInput
            placeholder={`Type here...`}
            query={this.props.querySearch}
            onSearch={this.props.onSearch}
          />
          <div className="navigation-container-elements">
            <span className="navigation-container-title">
              <span className="navigation-container-title-text">
                Compatibility:{' '}
              </span>
            </span>
            {supportElements}
          </div>
          <div className="navigation-container-elements">
            <span className="navigation-container-title">
              <span className="navigation-container-title-text">
                Order By:{' '}
              </span>
            </span>
            {elements}
          </div>
        </div>
      </nav>
    );
  }
}

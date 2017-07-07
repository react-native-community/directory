import React from 'react';
import { connect } from 'react-redux';

import { isEmptyOrNull } from '../common/strings';

class Queries extends React.PureComponent {
  _handleClearTopic = () => {
    this.props.dispatch({ type: 'CLEAR_TOPIC' });
  };

  _handleClearSearch = () => {
    this.props.dispatch({ type: 'CLEAR_SEARCH' });
  };

  render() {
    if (isEmptyOrNull(this.props.search) && isEmptyOrNull(this.props.topic)) {
      return null;
    }

    return (
      <div className="queries">
        <style jsx>{`
          .queries {
            padding: 27px 0 8px 0;
          }

          .queries-heading {
            font-family: 'office-code-medium', monospace;
            font-weight: 400;
          }

          .queries-list {
            display: block;
          }

          .queries-emphasis {
            font-family: 'office-code-medium', monospace;
            color: rgba(250, 70, 83, 1);
          }

          .queries-list-item {
            font-family: 'office-code', monospace;
            display: block;
            margin-top: 8px;
            line-height: 1.2rem;
          }

          .queries-list-item-left {
            overflow-wrap: break-word;
            word-break: break-word;
            min-width: 25%;
            width: 100%;
          }

          .queries-list-item-right {
            flex-shrink: 0;
          }

          .queries-link {
            display: inline-block;
            text-decoration: underline;
            transition: all 200ms ease;
            transition-property: opacity, transform;
            cursor: pointer;

            &:hover {
              opacity: 0.5;
            }
          }
        `}</style>
        <h2 className="queries-heading">Your queries</h2>
        <ul className="queries-list">
          {!isEmptyOrNull(this.props.search) &&
            <li className="queries-list-item">
              <div className="queries-list-item-left">
                Searching for{' '}
                <strong className="queries-emphasis">
                  “
                  {this.props.search}
                  ”
                </strong>{' '}
                —{' '}
                <span className="queries-list-item-right">
                  <span
                    className="queries-link"
                    onClick={this._handleClearSearch}>
                    Clear search
                  </span>
                </span>
              </div>
            </li>}

          {!isEmptyOrNull(this.props.topic) &&
            <li className="queries-list-item">
              <div className="queries-list-item-left">
                Selected{' '}
                <strong className="queries-emphasis">
                  “{this.props.topic}
                  ”{' '}
                </strong>{' '}
                —{' '}
                <span className="queries-list-item-right">
                  <span
                    className="queries-link"
                    onClick={this._handleClearTopic}>
                    Clear topic
                  </span>
                </span>
              </div>
            </li>}
        </ul>
      </div>
    );
  }
}

export default connect(state => {
  return { topic: state.topic, search: state.search };
})(Queries);

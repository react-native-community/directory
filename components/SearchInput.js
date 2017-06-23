import React from 'react';
import { connect } from 'react-redux';

class SearchInput extends React.PureComponent {
  _handleChange = e => {
    this.props.dispatch({ type: 'SEARCH_LIBRARY', value: e.target.value });
  };

  render() {
    return (
      <div className="search-input">
        <style jsx>{`
          .search-input {
            width: 100%;
            padding-left: 48px;
            position: relative;
          }

          .search-icon {
            position: absolute;
            height: 40px;
            width: 40px;
            top: 0;
            left: 0;
            bottom: 0;
          }

          .search-icon-image {
            width: 40px;
            height: 40px;
          }

          .search-icon-svg {
            position: absolute;
            bottom: 4px;
            right: 4px;
            height: 16px;
            width: 16px;
            background: rgba(250, 70, 83, 1);
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .search-input-control {
            font-family: 'office-code', monospace;
            color: rgba(65, 160, 248, 1);
            height: 40px;
            width: 100%;
            font-size: 18px;

            @media (max-width: 600px) {
              font-size: 16px;
            }

            &::-webkit-input-placeholder { /* Chrome/Opera/Safari */
              color: rgba(143, 199, 250, 0.6);
            }

            &::-moz-placeholder { /* Firefox 19+ */
              color: rgba(143, 199, 250, 0.6);
            }

            &:-ms-input-placeholder { /* IE 10+ */
              color: rgba(143, 199, 250, 0.6);
            }

            &:-moz-placeholder { /* Firefox 18- */
              color: rgba(143, 199, 250, 0.6);
            }
          }
        `}</style>
        <div className="search-icon">
          <img className="search-icon-image" src="/static/search.png" />
          <div className="search-icon-svg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <circle cx="10.5" cy="10.5" r="7.5" />
              <line x1="21" y1="21" x2="15.8" y2="15.8" />
            </svg>
          </div>
        </div>
        <input
          maxLength={32}
          onChange={this._handleChange}
          className="search-input-control"
          placeholder={this.props.placeholder}
          value={this.props.search}
        />
      </div>
    );
  }
}

export default connect(state => {
  return { search: state.search };
})(SearchInput);

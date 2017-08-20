import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class SearchInput extends React.PureComponent {
  static PropTypes = {
    search: PropTypes.string,
  };

  _handleChange = e => {
    this.props.dispatch({
      type: 'SEARCH_LIBRARY',
      value: e.target.value.toLowerCase(),
    });
  };

  render() {
    return (
      <div className="search-input">
        <style jsx>{`
          .search-input {
            width: 100%;
            margin: 16px 0 8px 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .search-input-left {
            font-size: 0.8rem;
            font-family: 'office-code-medium', monospace;
            flex-shrink: 0;
            margin: 0 16px 0 0;
          }

          .search-input-control {
            font-family: 'office-code', monospace;
            color: rgba(65, 160, 248, 1);
            width: 100%;
            font-size: 0.8rem;

            @media (max-width: 768px) {
              font-size: 16px;
            }

            &::-webkit-input-placeholder {
              /* Chrome/Opera/Safari */
              color: #999999;
            }

            &::-moz-placeholder {
              /* Firefox 19+ */
              color: #999999;
            }

            &:-ms-input-placeholder {
              /* IE 10+ */
              color: #999999;
            }

            &:-moz-placeholder {
              /* Firefox 18- */
              color: #999999;
            }
          }
        `}</style>
        <label htmlFor="search" className="search-input-left">
          Search:
        </label>
        <input
          maxLength={32}
          name="search"
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
  return { search: state.querySearch };
})(SearchInput);

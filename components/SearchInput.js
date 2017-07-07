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
            margin-top: 16px;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .search-icon {
            font-size: 0.8rem;
            font-family: 'office-code-medium', monospace;
            flex-shrink: 0;
            margin-right: 16px;
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
        <div className="search-icon">Search:</div>
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

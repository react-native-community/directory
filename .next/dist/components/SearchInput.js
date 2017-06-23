'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _style = require('styled-jsx/style.js');

var _style2 = _interopRequireDefault(_style);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _jsxFileName = '/Users/KINGSLAYER/Development/react-native-libraries/components/SearchInput.js';


var SearchInput = function (_React$PureComponent) {
  (0, _inherits3.default)(SearchInput, _React$PureComponent);

  function SearchInput() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, SearchInput);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = SearchInput.__proto__ || (0, _getPrototypeOf2.default)(SearchInput)).call.apply(_ref, [this].concat(args))), _this), _this._handleChange = function (e) {
      _this.props.dispatch({ type: 'SEARCH_LIBRARY', value: e.target.value });
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(SearchInput, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement('div', { className: 'search-input', 'data-jsx': 2808126566,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 11
        }
      }, _react2.default.createElement(_style2.default, {
        styleId: 2808126566,
        css: '.search-input[data-jsx="2808126566"] {width: 100%;padding-left: 48px;position: relative;}.search-icon[data-jsx="2808126566"] {position: absolute;height: 40px;width: 40px;top: 0;left: 0;bottom: 0;}.search-icon-image[data-jsx="2808126566"] {width: 40px;height: 40px;}.search-icon-svg[data-jsx="2808126566"] {position: absolute;bottom: 4px;right: 4px;height: 16px;width: 16px;background: rgba(250, 70, 83, 1);box-shadow: 0 1px 4px rgba(0, 0, 0, .07);border-radius: 6px; display:-webkit-box; display:-ms-flexbox; display:flex;-webkit-box-align: center;-ms-flex-align: center;align-items: center;-webkit-box-pack: center;-ms-flex-pack: center;justify-content: center;}.search-input-control[data-jsx="2808126566"] {font-family: \'office-code\', monospace;color: rgba(65, 160, 248, 1);height: 40px;width: 100%;font-size: 18px}@media (max-width: 600px) {.search-input-control[data-jsx="2808126566"] {font-size: 16px;}}.search-input-control[data-jsx="2808126566"][data-jsx="2808126566"]::-webkit-input-placeholder {color: rgba(143, 199, 250, .6);}.search-input-control[data-jsx="2808126566"][data-jsx="2808126566"]::-moz-placeholder {color: rgba(143, 199, 250, .6);}.search-input-control[data-jsx="2808126566"][data-jsx="2808126566"]:-ms-input-placeholder {color: rgba(143, 199, 250, .6);}.search-input-control[data-jsx="2808126566"][data-jsx="2808126566"]:-moz-placeholder {color: rgba(143, 199, 250, .6);}\n/*@ sourceURL=components/SearchInput.js */\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9LSU5HU0xBWUVSL0RldmVsb3BtZW50L3JlYWN0LW5hdGl2ZS1saWJyYXJpZXMvY29tcG9uZW50cy9TZWFyY2hJbnB1dC5qcyIsImNvbXBvbmVudHMvU2VhcmNoSW5wdXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBV29CLHNDQUVJLFlBQ08sbUJBQ0EsbUJBQ3BCLENBRWEscUNBQ08sbUJBQ04sYUFDRCxZQUNMLE9BQ0MsUUFDRSxVQUNYLENBRW1CLDJDQUNOLFlBQ0MsYUFDZCxDQUVpQix5Q0FDRyxtQkFDUCxZQUNELFdBQ0UsYUFDRCxZQUNxQixpQ0FDUyx5Q0FDdkIsbUJBQ0wsQ0FBQSxvQkFDTSxDQUROLG9CQUNNLENBRE4sYUFDTSwwQkFDSSxBQURKLHVCQUNJLEFBREosb0JBQ0kseUJBQ3pCLEFBRHlCLHNCQUN6QixBQUR5Qix3QkFDekIsQ0FFc0IsOENBQ2lCLHNDQUNULDZCQUNoQixhQUNELFlBQ0ksZUFFVyxDQW1CNUIsQUFuQjRCLDJCQUFBLDhDQUNULGdCQUNqQixDQUU2QixDQUFBLGdHQUNJLCtCQUNqQyxDQUVvQix1RkFDYSwrQkFDakMsQ0FFd0IsMkZBQ1MsK0JBQ2pDLENBRW1CLHNGQUNjLCtCQUNqQyxDQUNGO0FDdEVYLDBDQUEwQyIsImZpbGUiOiJ0by5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcblxuY2xhc3MgU2VhcmNoSW5wdXQgZXh0ZW5kcyBSZWFjdC5QdXJlQ29tcG9uZW50IHtcbiAgX2hhbmRsZUNoYW5nZSA9IGUgPT4ge1xuICAgIHRoaXMucHJvcHMuZGlzcGF0Y2goeyB0eXBlOiAnU0VBUkNIX0xJQlJBUlknLCB2YWx1ZTogZS50YXJnZXQudmFsdWUgfSk7XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlYXJjaC1pbnB1dFwiPlxuICAgICAgICA8c3R5bGUganN4PntgXG4gICAgICAgICAgLnNlYXJjaC1pbnB1dCB7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIHBhZGRpbmctbGVmdDogNDhweDtcbiAgICAgICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAuc2VhcmNoLWljb24ge1xuICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICAgICAgaGVpZ2h0OiA0MHB4O1xuICAgICAgICAgICAgd2lkdGg6IDQwcHg7XG4gICAgICAgICAgICB0b3A6IDA7XG4gICAgICAgICAgICBsZWZ0OiAwO1xuICAgICAgICAgICAgYm90dG9tOiAwO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC5zZWFyY2gtaWNvbi1pbWFnZSB7XG4gICAgICAgICAgICB3aWR0aDogNDBweDtcbiAgICAgICAgICAgIGhlaWdodDogNDBweDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAuc2VhcmNoLWljb24tc3ZnIHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgICAgIGJvdHRvbTogNHB4O1xuICAgICAgICAgICAgcmlnaHQ6IDRweDtcbiAgICAgICAgICAgIGhlaWdodDogMTZweDtcbiAgICAgICAgICAgIHdpZHRoOiAxNnB4O1xuICAgICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyNTAsIDcwLCA4MywgMSk7XG4gICAgICAgICAgICBib3gtc2hhZG93OiAwIDFweCA0cHggcmdiYSgwLCAwLCAwLCAwLjA3KTtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDZweDtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLnNlYXJjaC1pbnB1dC1jb250cm9sIHtcbiAgICAgICAgICAgIGZvbnQtZmFtaWx5OiAnb2ZmaWNlLWNvZGUnLCBtb25vc3BhY2U7XG4gICAgICAgICAgICBjb2xvcjogcmdiYSg2NSwgMTYwLCAyNDgsIDEpO1xuICAgICAgICAgICAgaGVpZ2h0OiA0MHB4O1xuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICBmb250LXNpemU6IDE4cHg7XG5cbiAgICAgICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiA2MDBweCkge1xuICAgICAgICAgICAgICBmb250LXNpemU6IDE2cHg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICY6Oi13ZWJraXQtaW5wdXQtcGxhY2Vob2xkZXIgeyAvKiBDaHJvbWUvT3BlcmEvU2FmYXJpICovXG4gICAgICAgICAgICAgIGNvbG9yOiByZ2JhKDE0MywgMTk5LCAyNTAsIDAuNik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICY6Oi1tb3otcGxhY2Vob2xkZXIgeyAvKiBGaXJlZm94IDE5KyAqL1xuICAgICAgICAgICAgICBjb2xvcjogcmdiYSgxNDMsIDE5OSwgMjUwLCAwLjYpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAmOi1tcy1pbnB1dC1wbGFjZWhvbGRlciB7IC8qIElFIDEwKyAqL1xuICAgICAgICAgICAgICBjb2xvcjogcmdiYSgxNDMsIDE5OSwgMjUwLCAwLjYpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAmOi1tb3otcGxhY2Vob2xkZXIgeyAvKiBGaXJlZm94IDE4LSAqL1xuICAgICAgICAgICAgICBjb2xvcjogcmdiYSgxNDMsIDE5OSwgMjUwLCAwLjYpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgYH08L3N0eWxlPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlYXJjaC1pY29uXCI+XG4gICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJzZWFyY2gtaWNvbi1pbWFnZVwiIHNyYz1cIi9zdGF0aWMvc2VhcmNoLnBuZ1wiIC8+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWFyY2gtaWNvbi1zdmdcIj5cbiAgICAgICAgICAgIDxzdmdcbiAgICAgICAgICAgICAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXG4gICAgICAgICAgICAgIHdpZHRoPVwiMTJcIlxuICAgICAgICAgICAgICBoZWlnaHQ9XCIxMlwiXG4gICAgICAgICAgICAgIHZpZXdCb3g9XCIwIDAgMjQgMjRcIlxuICAgICAgICAgICAgICBmaWxsPVwibm9uZVwiXG4gICAgICAgICAgICAgIHN0cm9rZT1cIiNGRkZGRkZcIlxuICAgICAgICAgICAgICBzdHJva2VXaWR0aD1cIjJcIlxuICAgICAgICAgICAgICBzdHJva2VMaW5lY2FwPVwicm91bmRcIlxuICAgICAgICAgICAgICBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+XG4gICAgICAgICAgICAgIDxjaXJjbGUgY3g9XCIxMC41XCIgY3k9XCIxMC41XCIgcj1cIjcuNVwiIC8+XG4gICAgICAgICAgICAgIDxsaW5lIHgxPVwiMjFcIiB5MT1cIjIxXCIgeDI9XCIxNS44XCIgeTI9XCIxNS44XCIgLz5cbiAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgbWF4TGVuZ3RoPXszMn1cbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5faGFuZGxlQ2hhbmdlfVxuICAgICAgICAgIGNsYXNzTmFtZT1cInNlYXJjaC1pbnB1dC1jb250cm9sXCJcbiAgICAgICAgICBwbGFjZWhvbGRlcj17dGhpcy5wcm9wcy5wbGFjZWhvbGRlcn1cbiAgICAgICAgICB2YWx1ZT17dGhpcy5wcm9wcy5zZWFyY2h9XG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3Qoc3RhdGUgPT4ge1xuICByZXR1cm4geyBzZWFyY2g6IHN0YXRlLnNlYXJjaCB9O1xufSkoU2VhcmNoSW5wdXQpO1xuIiwiLnNlYXJjaC1pbnB1dFtkYXRhLWpzeD1cIjI4MDgxMjY1NjZcIl0ge3dpZHRoOiAxMDAlO3BhZGRpbmctbGVmdDogNDhweDtwb3NpdGlvbjogcmVsYXRpdmU7fS5zZWFyY2gtaWNvbltkYXRhLWpzeD1cIjI4MDgxMjY1NjZcIl0ge3Bvc2l0aW9uOiBhYnNvbHV0ZTtoZWlnaHQ6IDQwcHg7d2lkdGg6IDQwcHg7dG9wOiAwO2xlZnQ6IDA7Ym90dG9tOiAwO30uc2VhcmNoLWljb24taW1hZ2VbZGF0YS1qc3g9XCIyODA4MTI2NTY2XCJdIHt3aWR0aDogNDBweDtoZWlnaHQ6IDQwcHg7fS5zZWFyY2gtaWNvbi1zdmdbZGF0YS1qc3g9XCIyODA4MTI2NTY2XCJdIHtwb3NpdGlvbjogYWJzb2x1dGU7Ym90dG9tOiA0cHg7cmlnaHQ6IDRweDtoZWlnaHQ6IDE2cHg7d2lkdGg6IDE2cHg7YmFja2dyb3VuZDogcmdiYSgyNTAsIDcwLCA4MywgMSk7Ym94LXNoYWRvdzogMCAxcHggNHB4IHJnYmEoMCwgMCwgMCwgMC4wNyk7Ym9yZGVyLXJhZGl1czogNnB4O2Rpc3BsYXk6LXdlYmtpdC1mbGV4OyBkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6IGNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjt9LnNlYXJjaC1pbnB1dC1jb250cm9sW2RhdGEtanN4PVwiMjgwODEyNjU2NlwiXSB7Zm9udC1mYW1pbHk6ICdvZmZpY2UtY29kZScsIG1vbm9zcGFjZTtjb2xvcjogcmdiYSg2NSwgMTYwLCAyNDgsIDEpO2hlaWdodDogNDBweDt3aWR0aDogMTAwJTtmb250LXNpemU6IDE4cHg7QG1lZGlhIChtYXgtd2lkdGg6IDYwMHB4KSB7Zm9udC1zaXplOiAxNnB4O30mW2RhdGEtanN4PVwiMjgwODEyNjU2NlwiXTo6LXdlYmtpdC1pbnB1dC1wbGFjZWhvbGRlciB7Y29sb3I6IHJnYmEoMTQzLCAxOTksIDI1MCwgMC42KTt9JltkYXRhLWpzeD1cIjI4MDgxMjY1NjZcIl06Oi1tb3otcGxhY2Vob2xkZXIge2NvbG9yOiByZ2JhKDE0MywgMTk5LCAyNTAsIDAuNik7fSZbZGF0YS1qc3g9XCIyODA4MTI2NTY2XCJdOi1tcy1pbnB1dC1wbGFjZWhvbGRlciB7Y29sb3I6IHJnYmEoMTQzLCAxOTksIDI1MCwgMC42KTt9JltkYXRhLWpzeD1cIjI4MDgxMjY1NjZcIl06LW1vei1wbGFjZWhvbGRlciB7Y29sb3I6IHJnYmEoMTQzLCAxOTksIDI1MCwgMC42KTt9fVxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltTnZiWEJ2Ym1WdWRITXZVMlZoY21Ob1NXNXdkWFF1YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlYyOUNMRUZCUTBzc2MwTkJRMFFzV1VGRFR5eHRRa0ZEUVN4dFFrRkRjRUlzUTBGRllTeHhRMEZEVHl4dFFrRkRUaXhoUVVORUxGbEJRMHdzVDBGRFF5eFJRVU5GTEZWQlExZ3NRMEZGYlVJc01rTkJRMDRzV1VGRFF5eGhRVU5rTEVOQlJXbENMSGxEUVVOSExHMUNRVU5RTEZsQlEwUXNWMEZEUlN4aFFVTkVMRmxCUTNGQ0xHbERRVU5UTERCRFFVTjJRaXh0UWtGRFRDeHRRMEZEVFN4dlFrRkRTU3gzUWtGRGVrSXNRMEZGYzBJc09FTkJRMmxDTEhORFFVTlVMRFpDUVVOb1FpeGhRVU5FTEZsQlEwa3NaMEpCUlZjc01rSkJRMVFzWjBKQlEycENMRU5CUlRaQ0xIRkVRVU5KTEdkRFFVTnFReXhEUVVWdlFpdzBRMEZEWVN4blEwRkRha01zUTBGRmQwSXNaMFJCUTFNc1owTkJRMnBETEVOQlJXMUNMREpEUVVOakxHZERRVU5xUXl4RFFVTkdJaXdpWm1sc1pTSTZJbU52YlhCdmJtVnVkSE12VTJWaGNtTm9TVzV3ZFhRdWFuTWlMQ0p6YjNWeVkyVlNiMjkwSWpvaUwxVnpaWEp6TDB0SlRrZFRURUZaUlZJdlJHVjJaV3h2Y0cxbGJuUXZjbVZoWTNRdGJtRjBhWFpsTFd4cFluSmhjbWxsY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYkltbHRjRzl5ZENCU1pXRmpkQ0JtY205dElDZHlaV0ZqZENjN1hHNXBiWEJ2Y25RZ2V5QmpiMjV1WldOMElIMGdabkp2YlNBbmNtVmhZM1F0Y21Wa2RYZ25PMXh1WEc1amJHRnpjeUJUWldGeVkyaEpibkIxZENCbGVIUmxibVJ6SUZKbFlXTjBMbEIxY21WRGIyMXdiMjVsYm5RZ2UxeHVJQ0JmYUdGdVpHeGxRMmhoYm1kbElEMGdaU0E5UGlCN1hHNGdJQ0FnZEdocGN5NXdjbTl3Y3k1a2FYTndZWFJqYUNoN0lIUjVjR1U2SUNkVFJVRlNRMGhmVEVsQ1VrRlNXU2NzSUhaaGJIVmxPaUJsTG5SaGNtZGxkQzUyWVd4MVpTQjlLVHRjYmlBZ2ZUdGNibHh1SUNCeVpXNWtaWElvS1NCN1hHNGdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJRHhrYVhZZ1kyeGhjM05PWVcxbFBWd2ljMlZoY21Ob0xXbHVjSFYwWENJK1hHNGdJQ0FnSUNBZ0lEeHpkSGxzWlNCcWMzZytlMkJjYmlBZ0lDQWdJQ0FnSUNBdWMyVmhjbU5vTFdsdWNIVjBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIZHBaSFJvT2lBeE1EQWxPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2NHRmtaR2x1Wnkxc1pXWjBPaUEwT0hCNE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnY0c5emFYUnBiMjQ2SUhKbGJHRjBhWFpsTzF4dUlDQWdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0FnSUM1elpXRnlZMmd0YVdOdmJpQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCd2IzTnBkR2x2YmpvZ1lXSnpiMngxZEdVN1hHNGdJQ0FnSUNBZ0lDQWdJQ0JvWldsbmFIUTZJRFF3Y0hnN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IzYVdSMGFEb2dOREJ3ZUR0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFJ2Y0RvZ01EdGNiaUFnSUNBZ0lDQWdJQ0FnSUd4bFpuUTZJREE3WEc0Z0lDQWdJQ0FnSUNBZ0lDQmliM1IwYjIwNklEQTdYRzRnSUNBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lDQWdMbk5sWVhKamFDMXBZMjl1TFdsdFlXZGxJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIZHBaSFJvT2lBME1IQjRPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2FHVnBaMmgwT2lBME1IQjRPMXh1SUNBZ0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQWdJQzV6WldGeVkyZ3RhV052YmkxemRtY2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2NHOXphWFJwYjI0NklHRmljMjlzZFhSbE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnWW05MGRHOXRPaUEwY0hnN1hHNGdJQ0FnSUNBZ0lDQWdJQ0J5YVdkb2REb2dOSEI0TzF4dUlDQWdJQ0FnSUNBZ0lDQWdhR1ZwWjJoME9pQXhObkI0TzF4dUlDQWdJQ0FnSUNBZ0lDQWdkMmxrZEdnNklERTJjSGc3WEc0Z0lDQWdJQ0FnSUNBZ0lDQmlZV05yWjNKdmRXNWtPaUJ5WjJKaEtESTFNQ3dnTnpBc0lEZ3pMQ0F4S1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJR0p2ZUMxemFHRmtiM2M2SURBZ01YQjRJRFJ3ZUNCeVoySmhLREFzSURBc0lEQXNJREF1TURjcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnWW05eVpHVnlMWEpoWkdsMWN6b2dObkI0TzF4dUlDQWdJQ0FnSUNBZ0lDQWdaR2x6Y0d4aGVUb2dabXhsZUR0Y2JpQWdJQ0FnSUNBZ0lDQWdJR0ZzYVdkdUxXbDBaVzF6T2lCalpXNTBaWEk3WEc0Z0lDQWdJQ0FnSUNBZ0lDQnFkWE4wYVdaNUxXTnZiblJsYm5RNklHTmxiblJsY2p0Y2JpQWdJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnSUNBdWMyVmhjbU5vTFdsdWNIVjBMV052Ym5SeWIyd2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ1ptOXVkQzFtWVcxcGJIazZJQ2R2Wm1acFkyVXRZMjlrWlNjc0lHMXZibTl6Y0dGalpUdGNiaUFnSUNBZ0lDQWdJQ0FnSUdOdmJHOXlPaUJ5WjJKaEtEWTFMQ0F4TmpBc0lESTBPQ3dnTVNrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0JvWldsbmFIUTZJRFF3Y0hnN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IzYVdSMGFEb2dNVEF3SlR0Y2JpQWdJQ0FnSUNBZ0lDQWdJR1p2Ym5RdGMybDZaVG9nTVRod2VEdGNibHh1SUNBZ0lDQWdJQ0FnSUNBZ1FHMWxaR2xoSUNodFlYZ3RkMmxrZEdnNklEWXdNSEI0S1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUdadmJuUXRjMmw2WlRvZ01UWndlRHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0FnSUNBZ0pqbzZMWGRsWW10cGRDMXBibkIxZEMxd2JHRmpaV2h2YkdSbGNpQjdJQzhxSUVOb2NtOXRaUzlQY0dWeVlTOVRZV1poY21rZ0tpOWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ1kyOXNiM0k2SUhKblltRW9NVFF6TENBeE9Ua3NJREkxTUN3Z01DNDJLVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0FnSUNBZ0pqbzZMVzF2ZWkxd2JHRmpaV2h2YkdSbGNpQjdJQzhxSUVacGNtVm1iM2dnTVRrcklDb3ZYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lHTnZiRzl5T2lCeVoySmhLREUwTXl3Z01UazVMQ0F5TlRBc0lEQXVOaWs3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lDWTZMVzF6TFdsdWNIVjBMWEJzWVdObGFHOXNaR1Z5SUhzZ0x5b2dTVVVnTVRBcklDb3ZYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lHTnZiRzl5T2lCeVoySmhLREUwTXl3Z01UazVMQ0F5TlRBc0lEQXVOaWs3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lDWTZMVzF2ZWkxd2JHRmpaV2h2YkdSbGNpQjdJQzhxSUVacGNtVm1iM2dnTVRndElDb3ZYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lHTnZiRzl5T2lCeVoySmhLREUwTXl3Z01UazVMQ0F5TlRBc0lEQXVOaWs3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNCZ2ZUd3ZjM1I1YkdVK1hHNGdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFZ3aWMyVmhjbU5vTFdsamIyNWNJajVjYmlBZ0lDQWdJQ0FnSUNBOGFXMW5JR05zWVhOelRtRnRaVDFjSW5ObFlYSmphQzFwWTI5dUxXbHRZV2RsWENJZ2MzSmpQVndpTDNOMFlYUnBZeTl6WldGeVkyZ3VjRzVuWENJZ0x6NWNiaUFnSUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56VG1GdFpUMWNJbk5sWVhKamFDMXBZMjl1TFhOMloxd2lQbHh1SUNBZ0lDQWdJQ0FnSUNBZ1BITjJaMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQjRiV3h1Y3oxY0ltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6SXdNREF2YzNablhDSmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ2QybGtkR2c5WENJeE1sd2lYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lHaGxhV2RvZEQxY0lqRXlYQ0pjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdkbWxsZDBKdmVEMWNJakFnTUNBeU5DQXlORndpWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJR1pwYkd3OVhDSnViMjVsWENKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnYzNSeWIydGxQVndpSTBaR1JrWkdSbHdpWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJSE4wY205clpWZHBaSFJvUFZ3aU1sd2lYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lITjBjbTlyWlV4cGJtVmpZWEE5WENKeWIzVnVaRndpWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJSE4wY205clpVeHBibVZxYjJsdVBWd2ljbTkxYm1SY0lqNWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ1BHTnBjbU5zWlNCamVEMWNJakV3TGpWY0lpQmplVDFjSWpFd0xqVmNJaUJ5UFZ3aU55NDFYQ0lnTHo1Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnUEd4cGJtVWdlREU5WENJeU1Wd2lJSGt4UFZ3aU1qRmNJaUI0TWoxY0lqRTFMamhjSWlCNU1qMWNJakUxTGpoY0lpQXZQbHh1SUNBZ0lDQWdJQ0FnSUNBZ1BDOXpkbWMrWEc0Z0lDQWdJQ0FnSUNBZ1BDOWthWFkrWEc0Z0lDQWdJQ0FnSUR3dlpHbDJQbHh1SUNBZ0lDQWdJQ0E4YVc1d2RYUmNiaUFnSUNBZ0lDQWdJQ0J0WVhoTVpXNW5kR2c5ZXpNeWZWeHVJQ0FnSUNBZ0lDQWdJRzl1UTJoaGJtZGxQWHQwYUdsekxsOW9ZVzVrYkdWRGFHRnVaMlY5WEc0Z0lDQWdJQ0FnSUNBZ1kyeGhjM05PWVcxbFBWd2ljMlZoY21Ob0xXbHVjSFYwTFdOdmJuUnliMnhjSWx4dUlDQWdJQ0FnSUNBZ0lIQnNZV05sYUc5c1pHVnlQWHQwYUdsekxuQnliM0J6TG5Cc1lXTmxhRzlzWkdWeWZWeHVJQ0FnSUNBZ0lDQWdJSFpoYkhWbFBYdDBhR2x6TG5CeWIzQnpMbk5sWVhKamFIMWNiaUFnSUNBZ0lDQWdMejVjYmlBZ0lDQWdJRHd2WkdsMlBseHVJQ0FnSUNrN1hHNGdJSDFjYm4xY2JseHVaWGh3YjNKMElHUmxabUYxYkhRZ1kyOXVibVZqZENoemRHRjBaU0E5UGlCN1hHNGdJSEpsZEhWeWJpQjdJSE5sWVhKamFEb2djM1JoZEdVdWMyVmhjbU5vSUgwN1hHNTlLU2hUWldGeVkyaEpibkIxZENrN1hHNGlYWDA9ICovXG4vKkAgc291cmNlVVJMPWNvbXBvbmVudHMvU2VhcmNoSW5wdXQuanMgKi8iXX0= */'
      }), _react2.default.createElement('div', { className: 'search-icon', 'data-jsx': 2808126566,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 75
        }
      }, _react2.default.createElement('img', { className: 'search-icon-image', src: '/static/search.png', 'data-jsx': 2808126566,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 76
        }
      }), _react2.default.createElement('div', { className: 'search-icon-svg', 'data-jsx': 2808126566,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 77
        }
      }, _react2.default.createElement('svg', {
        xmlns: 'http://www.w3.org/2000/svg',
        width: '12',
        height: '12',
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: '#FFFFFF',
        strokeWidth: '2',
        strokeLinecap: 'round',
        strokeLinejoin: 'round', 'data-jsx': 2808126566,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 78
        }
      }, _react2.default.createElement('circle', { cx: '10.5', cy: '10.5', r: '7.5', 'data-jsx': 2808126566,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 88
        }
      }), _react2.default.createElement('line', { x1: '21', y1: '21', x2: '15.8', y2: '15.8', 'data-jsx': 2808126566,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 89
        }
      })))), _react2.default.createElement('input', {
        maxLength: 32,
        onChange: this._handleChange,
        className: 'search-input-control',
        placeholder: this.props.placeholder,
        value: this.props.search,
        'data-jsx': 2808126566,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 93
        }
      }));
    }
  }]);

  return SearchInput;
}(_react2.default.PureComponent);

exports.default = (0, _reactRedux.connect)(function (state) {
  return { search: state.search };
})(SearchInput);
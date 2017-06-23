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

var _strings = require('../common/strings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _jsxFileName = '/Users/KINGSLAYER/Development/react-native-libraries/components/Queries.js';


var Queries = function (_React$PureComponent) {
  (0, _inherits3.default)(Queries, _React$PureComponent);

  function Queries() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, Queries);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = Queries.__proto__ || (0, _getPrototypeOf2.default)(Queries)).call.apply(_ref, [this].concat(args))), _this), _this._handleClearTopic = function () {
      _this.props.dispatch({ type: 'CLEAR_TOPIC' });
    }, _this._handleClearSearch = function () {
      _this.props.dispatch({ type: 'CLEAR_SEARCH' });
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(Queries, [{
    key: 'render',
    value: function render() {
      if ((0, _strings.isEmptyOrNull)(this.props.search) && (0, _strings.isEmptyOrNull)(this.props.topic)) {
        return null;
      }

      return _react2.default.createElement('div', { className: 'queries', 'data-jsx': 2730990752,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 21
        }
      }, _react2.default.createElement(_style2.default, {
        styleId: 2730990752,
        css: '.queries[data-jsx="2730990752"] {padding: 27px 0 8px 0;}.queries-heading[data-jsx="2730990752"] {font-family: \'office-code-medium\', monospace;font-weight: 400;}.queries-list[data-jsx="2730990752"] {display: block;}.queries-emphasis[data-jsx="2730990752"] {font-family: \'office-code-medium\', monospace;color: rgba(250, 70, 83, 1);}.queries-list-item[data-jsx="2730990752"] {display: block;margin-top: 8px;}.queries-list-item-left[data-jsx="2730990752"] {word-wrap: break-word;word-break: break-word;min-width: 25%;width: 100%;}.queries-list-item-right[data-jsx="2730990752"] {-ms-flex-negative: 0;flex-shrink: 0;}.queries-link[data-jsx="2730990752"] {display: inline-block;text-decoration: underline;transition: all 200ms ease;transition-property: opacity, -webkit-transform;transition-property: opacity, transform;transition-property: opacity, transform, -webkit-transform;cursor: pointer}.queries-link[data-jsx="2730990752"][data-jsx="2730990752"]:hover {opacity: 0.5;}.queries-link[data-jsx="2730990752"][data-jsx="2730990752"]:active {-webkit-transform: scale(1.2);transform: scale(1.2);}\n/*@ sourceURL=components/Queries.js */\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9LSU5HU0xBWUVSL0RldmVsb3BtZW50L3JlYWN0LW5hdGl2ZS1saWJyYXJpZXMvY29tcG9uZW50cy9RdWVyaWVzLmpzIiwiY29tcG9uZW50cy9RdWVyaWVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQXFCb0IsaUNBRWMsc0JBQ3ZCLENBRWlCLHlDQUM2Qiw2Q0FDNUIsaUJBQ2xCLENBRWMsc0NBQ0UsZUFDaEIsQ0FFa0IsMENBQzRCLDZDQUNqQiw0QkFDN0IsQ0FFbUIsMkNBQ0gsZUFDQyxnQkFDakIsQ0FFd0IsZ0RBQ0csc0JBQ0gsdUJBQ1IsZUFDSCxZQUNiLENBRXlCLGlEQUNULHFCQUNoQixBQURnQixlQUNoQixDQUVjLHNDQUNTLHNCQUNLLDJCQUNBLDJCQUNhLGdEQUN4QixBQUR3Qix3Q0FDeEIsQUFEd0IsMkRBQ3hCLGVBRVAsQ0FPVixBQVBVLG1FQUNNLGFBQ2QsQ0FFUyxvRUFDYyw4QkFBQSxzQkFDdkIsQ0FDRjtBQ3BFWCxzQ0FBc0MiLCJmaWxlIjoidG8uY3NzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XG5cbmltcG9ydCB7IGlzRW1wdHlPck51bGwgfSBmcm9tICcuLi9jb21tb24vc3RyaW5ncyc7XG5cbmNsYXNzIFF1ZXJpZXMgZXh0ZW5kcyBSZWFjdC5QdXJlQ29tcG9uZW50IHtcbiAgX2hhbmRsZUNsZWFyVG9waWMgPSAoKSA9PiB7XG4gICAgdGhpcy5wcm9wcy5kaXNwYXRjaCh7IHR5cGU6ICdDTEVBUl9UT1BJQycgfSk7XG4gIH07XG5cbiAgX2hhbmRsZUNsZWFyU2VhcmNoID0gKCkgPT4ge1xuICAgIHRoaXMucHJvcHMuZGlzcGF0Y2goeyB0eXBlOiAnQ0xFQVJfU0VBUkNIJyB9KTtcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgaWYgKGlzRW1wdHlPck51bGwodGhpcy5wcm9wcy5zZWFyY2gpICYmIGlzRW1wdHlPck51bGwodGhpcy5wcm9wcy50b3BpYykpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInF1ZXJpZXNcIj5cbiAgICAgICAgPHN0eWxlIGpzeD57YFxuICAgICAgICAgIC5xdWVyaWVzIHtcbiAgICAgICAgICAgIHBhZGRpbmc6IDI3cHggMCA4cHggMDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAucXVlcmllcy1oZWFkaW5nIHtcbiAgICAgICAgICAgIGZvbnQtZmFtaWx5OiAnb2ZmaWNlLWNvZGUtbWVkaXVtJywgbW9ub3NwYWNlO1xuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDQwMDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAucXVlcmllcy1saXN0IHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC5xdWVyaWVzLWVtcGhhc2lzIHtcbiAgICAgICAgICAgIGZvbnQtZmFtaWx5OiAnb2ZmaWNlLWNvZGUtbWVkaXVtJywgbW9ub3NwYWNlO1xuICAgICAgICAgICAgY29sb3I6IHJnYmEoMjUwLCA3MCwgODMsIDEpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC5xdWVyaWVzLWxpc3QtaXRlbSB7XG4gICAgICAgICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgICAgICAgIG1hcmdpbi10b3A6IDhweDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAucXVlcmllcy1saXN0LWl0ZW0tbGVmdCB7XG4gICAgICAgICAgICBvdmVyZmxvdy13cmFwOiBicmVhay13b3JkO1xuICAgICAgICAgICAgd29yZC1icmVhazogYnJlYWstd29yZDtcbiAgICAgICAgICAgIG1pbi13aWR0aDogMjUlO1xuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLnF1ZXJpZXMtbGlzdC1pdGVtLXJpZ2h0IHtcbiAgICAgICAgICAgIGZsZXgtc2hyaW5rOiAwO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC5xdWVyaWVzLWxpbmsge1xuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiBhbGwgMjAwbXMgZWFzZTtcbiAgICAgICAgICAgIHRyYW5zaXRpb24tcHJvcGVydHk6IG9wYWNpdHksIHRyYW5zZm9ybTtcbiAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcblxuICAgICAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICAgIG9wYWNpdHk6IDAuNTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJjphY3RpdmUge1xuICAgICAgICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDEuMik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBgfTwvc3R5bGU+XG4gICAgICAgIDxoMiBjbGFzc05hbWU9XCJxdWVyaWVzLWhlYWRpbmdcIj5Zb3VyIHF1ZXJpZXM8L2gyPlxuICAgICAgICA8dWwgY2xhc3NOYW1lPVwicXVlcmllcy1saXN0XCI+XG4gICAgICAgICAgeyFpc0VtcHR5T3JOdWxsKHRoaXMucHJvcHMuc2VhcmNoKSAmJlxuICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cInF1ZXJpZXMtbGlzdC1pdGVtXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicXVlcmllcy1saXN0LWl0ZW0tbGVmdFwiPlxuICAgICAgICAgICAgICAgIFNlYXJjaGluZyBmb3IgPHN0cm9uZyBjbGFzc05hbWU9XCJxdWVyaWVzLWVtcGhhc2lzXCI+XG4gICAgICAgICAgICAgICAgICDigJxcbiAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLnNlYXJjaH1cbiAgICAgICAgICAgICAgICAgIOKAnVxuICAgICAgICAgICAgICAgIDwvc3Ryb25nPiDigJRcbiAgICAgICAgICAgICAgICB7JyAnfVxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInF1ZXJpZXMtbGlzdC1pdGVtLXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJxdWVyaWVzLWxpbmtcIlxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLl9oYW5kbGVDbGVhclNlYXJjaH0+XG4gICAgICAgICAgICAgICAgICAgIENsZWFyIHNlYXJjaFxuICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2xpPn1cblxuICAgICAgICAgIHshaXNFbXB0eU9yTnVsbCh0aGlzLnByb3BzLnRvcGljKSAmJlxuICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cInF1ZXJpZXMtbGlzdC1pdGVtXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicXVlcmllcy1saXN0LWl0ZW0tbGVmdFwiPlxuICAgICAgICAgICAgICAgIFNlbGVjdGVkXG4gICAgICAgICAgICAgICAgeycgJ31cbiAgICAgICAgICAgICAgICA8c3Ryb25nIGNsYXNzTmFtZT1cInF1ZXJpZXMtZW1waGFzaXNcIj5cbiAgICAgICAgICAgICAgICAgIOKAnHt0aGlzLnByb3BzLnRvcGljfVxuICAgICAgICAgICAgICAgICAg4oCdeycgJ31cbiAgICAgICAgICAgICAgICA8L3N0cm9uZz4g4oCUXG4gICAgICAgICAgICAgICAgeycgJ31cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJxdWVyaWVzLWxpc3QtaXRlbS1yaWdodFwiPlxuICAgICAgICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicXVlcmllcy1saW5rXCJcbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5faGFuZGxlQ2xlYXJUb3BpY30+XG4gICAgICAgICAgICAgICAgICAgIENsZWFyIHRvcGljXG4gICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvbGk+fVxuICAgICAgICA8L3VsPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KHN0YXRlID0+IHtcbiAgcmV0dXJuIHsgdG9waWM6IHN0YXRlLnRvcGljLCBzZWFyY2g6IHN0YXRlLnNlYXJjaCB9O1xufSkoUXVlcmllcyk7XG4iLCIucXVlcmllc1tkYXRhLWpzeD1cIjI3MzA5OTA3NTJcIl0ge3BhZGRpbmc6IDI3cHggMCA4cHggMDt9LnF1ZXJpZXMtaGVhZGluZ1tkYXRhLWpzeD1cIjI3MzA5OTA3NTJcIl0ge2ZvbnQtZmFtaWx5OiAnb2ZmaWNlLWNvZGUtbWVkaXVtJywgbW9ub3NwYWNlO2ZvbnQtd2VpZ2h0OiA0MDA7fS5xdWVyaWVzLWxpc3RbZGF0YS1qc3g9XCIyNzMwOTkwNzUyXCJdIHtkaXNwbGF5OiBibG9jazt9LnF1ZXJpZXMtZW1waGFzaXNbZGF0YS1qc3g9XCIyNzMwOTkwNzUyXCJdIHtmb250LWZhbWlseTogJ29mZmljZS1jb2RlLW1lZGl1bScsIG1vbm9zcGFjZTtjb2xvcjogcmdiYSgyNTAsIDcwLCA4MywgMSk7fS5xdWVyaWVzLWxpc3QtaXRlbVtkYXRhLWpzeD1cIjI3MzA5OTA3NTJcIl0ge2Rpc3BsYXk6IGJsb2NrO21hcmdpbi10b3A6IDhweDt9LnF1ZXJpZXMtbGlzdC1pdGVtLWxlZnRbZGF0YS1qc3g9XCIyNzMwOTkwNzUyXCJdIHtvdmVyZmxvdy13cmFwOiBicmVhay13b3JkO3dvcmQtYnJlYWs6IGJyZWFrLXdvcmQ7bWluLXdpZHRoOiAyNSU7d2lkdGg6IDEwMCU7fS5xdWVyaWVzLWxpc3QtaXRlbS1yaWdodFtkYXRhLWpzeD1cIjI3MzA5OTA3NTJcIl0gey13ZWJraXQtZmxleC1zaHJpbms6IDA7LW1vei1mbGV4LXNocmluazogMDtmbGV4LXNocmluazogMDt9LnF1ZXJpZXMtbGlua1tkYXRhLWpzeD1cIjI3MzA5OTA3NTJcIl0ge2Rpc3BsYXk6IGlubGluZS1ibG9jazt0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTstd2Via2l0LXRyYW5zaXRpb246IGFsbCAyMDBtcyBlYXNlOy1tb3otdHJhbnNpdGlvbjogYWxsIDIwMG1zIGVhc2U7LW1zLXRyYW5zaXRpb246IGFsbCAyMDBtcyBlYXNlO3RyYW5zaXRpb246IGFsbCAyMDBtcyBlYXNlOy13ZWJraXQtdHJhbnNpdGlvbi1wcm9wZXJ0eTogb3BhY2l0eSwgdHJhbnNmb3JtOy1tb3otdHJhbnNpdGlvbi1wcm9wZXJ0eTogb3BhY2l0eSwgdHJhbnNmb3JtOy1tcy10cmFuc2l0aW9uLXByb3BlcnR5OiBvcGFjaXR5LCB0cmFuc2Zvcm07dHJhbnNpdGlvbi1wcm9wZXJ0eTogb3BhY2l0eSwgdHJhbnNmb3JtO2N1cnNvcjogcG9pbnRlcjsmW2RhdGEtanN4PVwiMjczMDk5MDc1MlwiXTpob3ZlciB7b3BhY2l0eTogMC41O30mW2RhdGEtanN4PVwiMjczMDk5MDc1MlwiXTphY3RpdmUgey13ZWJraXQtdHJhbnNmb3JtOiBzY2FsZSgxLjIpOy1tb3otdHJhbnNmb3JtOiBzY2FsZSgxLjIpOy1tcy10cmFuc2Zvcm06IHNjYWxlKDEuMik7dHJhbnNmb3JtOiBzY2FsZSgxLjIpO319XG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW1OdmJYQnZibVZ1ZEhNdlVYVmxjbWxsY3k1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRnhRbTlDTEVGQlEwRXNhVU5CUTJNc2MwSkJRM1pDTEVOQlJXbENMSGxEUVVNMlFpdzJRMEZETlVJc2FVSkJRMnhDTEVOQlJXTXNjME5CUTBVc1pVRkRhRUlzUTBGRmEwSXNNRU5CUXpSQ0xEWkRRVU5xUWl3MFFrRkROMElzUTBGRmJVSXNNa05CUTBnc1pVRkRReXhuUWtGRGFrSXNRMEZGZDBJc1owUkJRMGNzTUVKQlEwZ3NkVUpCUTFJc1pVRkRTQ3haUVVOaUxFTkJSWGxDTEdsRVFVTlVMREJFUVVOb1FpeERRVVZqTEhORFFVTlRMSE5DUVVOTExESkNRVU5CTERaSVFVTmhMR2xNUVVONFFpeG5Ra0ZGVUN4blEwRkRUU3hoUVVOa0xFTkJSVk1zYVVOQlEyTXNlVWRCUTNaQ0xFTkJRMFlpTENKbWFXeGxJam9pWTI5dGNHOXVaVzUwY3k5UmRXVnlhV1Z6TG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWk5VmMyVnljeTlMU1U1SFUweEJXVVZTTDBSbGRtVnNiM0J0Wlc1MEwzSmxZV04wTFc1aGRHbDJaUzFzYVdKeVlYSnBaWE1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKcGJYQnZjblFnVW1WaFkzUWdabkp2YlNBbmNtVmhZM1FuTzF4dWFXMXdiM0owSUhzZ1kyOXVibVZqZENCOUlHWnliMjBnSjNKbFlXTjBMWEpsWkhWNEp6dGNibHh1YVcxd2IzSjBJSHNnYVhORmJYQjBlVTl5VG5Wc2JDQjlJR1p5YjIwZ0p5NHVMMk52YlcxdmJpOXpkSEpwYm1kekp6dGNibHh1WTJ4aGMzTWdVWFZsY21sbGN5QmxlSFJsYm1SeklGSmxZV04wTGxCMWNtVkRiMjF3YjI1bGJuUWdlMXh1SUNCZmFHRnVaR3hsUTJ4bFlYSlViM0JwWXlBOUlDZ3BJRDArSUh0Y2JpQWdJQ0IwYUdsekxuQnliM0J6TG1ScGMzQmhkR05vS0hzZ2RIbHdaVG9nSjBOTVJVRlNYMVJQVUVsREp5QjlLVHRjYmlBZ2ZUdGNibHh1SUNCZmFHRnVaR3hsUTJ4bFlYSlRaV0Z5WTJnZ1BTQW9LU0E5UGlCN1hHNGdJQ0FnZEdocGN5NXdjbTl3Y3k1a2FYTndZWFJqYUNoN0lIUjVjR1U2SUNkRFRFVkJVbDlUUlVGU1EwZ25JSDBwTzF4dUlDQjlPMXh1WEc0Z0lISmxibVJsY2lncElIdGNiaUFnSUNCcFppQW9hWE5GYlhCMGVVOXlUblZzYkNoMGFHbHpMbkJ5YjNCekxuTmxZWEpqYUNrZ0ppWWdhWE5GYlhCMGVVOXlUblZzYkNoMGFHbHpMbkJ5YjNCekxuUnZjR2xqS1NrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUc1MWJHdzdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2NtVjBkWEp1SUNoY2JpQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpY1hWbGNtbGxjMXdpUGx4dUlDQWdJQ0FnSUNBOGMzUjViR1VnYW5ONFBudGdYRzRnSUNBZ0lDQWdJQ0FnTG5GMVpYSnBaWE1nZTF4dUlDQWdJQ0FnSUNBZ0lDQWdjR0ZrWkdsdVp6b2dNamR3ZUNBd0lEaHdlQ0F3TzF4dUlDQWdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0FnSUM1eGRXVnlhV1Z6TFdobFlXUnBibWNnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdabTl1ZEMxbVlXMXBiSGs2SUNkdlptWnBZMlV0WTI5a1pTMXRaV1JwZFcwbkxDQnRiMjV2YzNCaFkyVTdYRzRnSUNBZ0lDQWdJQ0FnSUNCbWIyNTBMWGRsYVdkb2REb2dOREF3TzF4dUlDQWdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0FnSUM1eGRXVnlhV1Z6TFd4cGMzUWdlMXh1SUNBZ0lDQWdJQ0FnSUNBZ1pHbHpjR3hoZVRvZ1lteHZZMnM3WEc0Z0lDQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJQ0FnTG5GMVpYSnBaWE10Wlcxd2FHRnphWE1nZTF4dUlDQWdJQ0FnSUNBZ0lDQWdabTl1ZEMxbVlXMXBiSGs2SUNkdlptWnBZMlV0WTI5a1pTMXRaV1JwZFcwbkxDQnRiMjV2YzNCaFkyVTdYRzRnSUNBZ0lDQWdJQ0FnSUNCamIyeHZjam9nY21kaVlTZ3lOVEFzSURjd0xDQTRNeXdnTVNrN1hHNGdJQ0FnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUNBZ0xuRjFaWEpwWlhNdGJHbHpkQzFwZEdWdElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUdScGMzQnNZWGs2SUdKc2IyTnJPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2JXRnlaMmx1TFhSdmNEb2dPSEI0TzF4dUlDQWdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0FnSUM1eGRXVnlhV1Z6TFd4cGMzUXRhWFJsYlMxc1pXWjBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lHOTJaWEptYkc5M0xYZHlZWEE2SUdKeVpXRnJMWGR2Y21RN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IzYjNKa0xXSnlaV0ZyT2lCaWNtVmhheTEzYjNKa08xeHVJQ0FnSUNBZ0lDQWdJQ0FnYldsdUxYZHBaSFJvT2lBeU5TVTdYRzRnSUNBZ0lDQWdJQ0FnSUNCM2FXUjBhRG9nTVRBd0pUdGNiaUFnSUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ0lDQXVjWFZsY21sbGN5MXNhWE4wTFdsMFpXMHRjbWxuYUhRZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnWm14bGVDMXphSEpwYm1zNklEQTdYRzRnSUNBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lDQWdMbkYxWlhKcFpYTXRiR2x1YXlCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0JrYVhOd2JHRjVPaUJwYm14cGJtVXRZbXh2WTJzN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IwWlhoMExXUmxZMjl5WVhScGIyNDZJSFZ1WkdWeWJHbHVaVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIUnlZVzV6YVhScGIyNDZJR0ZzYkNBeU1EQnRjeUJsWVhObE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnZEhKaGJuTnBkR2x2Ymkxd2NtOXdaWEowZVRvZ2IzQmhZMmwwZVN3Z2RISmhibk5tYjNKdE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnWTNWeWMyOXlPaUJ3YjJsdWRHVnlPMXh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQW1PbWh2ZG1WeUlIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ2IzQmhZMmwwZVRvZ01DNDFPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJQ0FnSUNBbU9tRmpkR2wyWlNCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUhSeVlXNXpabTl5YlRvZ2MyTmhiR1VvTVM0eUtUdGNiaUFnSUNBZ0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQWdJR0I5UEM5emRIbHNaVDVjYmlBZ0lDQWdJQ0FnUEdneUlHTnNZWE56VG1GdFpUMWNJbkYxWlhKcFpYTXRhR1ZoWkdsdVoxd2lQbGx2ZFhJZ2NYVmxjbWxsY3p3dmFESStYRzRnSUNBZ0lDQWdJRHgxYkNCamJHRnpjMDVoYldVOVhDSnhkV1Z5YVdWekxXeHBjM1JjSWo1Y2JpQWdJQ0FnSUNBZ0lDQjdJV2x6Ulcxd2RIbFBjazUxYkd3b2RHaHBjeTV3Y205d2N5NXpaV0Z5WTJncElDWW1YRzRnSUNBZ0lDQWdJQ0FnSUNBOGJHa2dZMnhoYzNOT1lXMWxQVndpY1hWbGNtbGxjeTFzYVhOMExXbDBaVzFjSWo1Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlYQ0p4ZFdWeWFXVnpMV3hwYzNRdGFYUmxiUzFzWldaMFhDSStYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdVMlZoY21Ob2FXNW5JR1p2Y2lBOGMzUnliMjVuSUdOc1lYTnpUbUZ0WlQxY0luRjFaWEpwWlhNdFpXMXdhR0Z6YVhOY0lqNWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJT0tBbkZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2UzUm9hWE11Y0hKdmNITXVjMlZoY21Ob2ZWeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWc0b0NkWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5emRISnZibWMrSU9LQWxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIc25JQ2Q5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhOd1lXNGdZMnhoYzNOT1lXMWxQVndpY1hWbGNtbGxjeTFzYVhOMExXbDBaVzB0Y21sbmFIUmNJajVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emNHRnVYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdOc1lYTnpUbUZ0WlQxY0luRjFaWEpwWlhNdGJHbHVhMXdpWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHOXVRMnhwWTJzOWUzUm9hWE11WDJoaGJtUnNaVU5zWldGeVUyVmhjbU5vZlQ1Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdRMnhsWVhJZ2MyVmhjbU5vWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOEwzTndZVzQrWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5emNHRnVQbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQThMMlJwZGo1Y2JpQWdJQ0FnSUNBZ0lDQWdJRHd2YkdrK2ZWeHVYRzRnSUNBZ0lDQWdJQ0FnZXlGcGMwVnRjSFI1VDNKT2RXeHNLSFJvYVhNdWNISnZjSE11ZEc5d2FXTXBJQ1ltWEc0Z0lDQWdJQ0FnSUNBZ0lDQThiR2tnWTJ4aGMzTk9ZVzFsUFZ3aWNYVmxjbWxsY3kxc2FYTjBMV2wwWlcxY0lqNWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5WENKeGRXVnlhV1Z6TFd4cGMzUXRhWFJsYlMxc1pXWjBYQ0krWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnVTJWc1pXTjBaV1JjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0I3SnlBbmZWeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHpkSEp2Ym1jZ1kyeGhjM05PWVcxbFBWd2ljWFZsY21sbGN5MWxiWEJvWVhOcGMxd2lQbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnNG9DY2UzUm9hWE11Y0hKdmNITXVkRzl3YVdOOVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDRGlnSjE3SnlBbmZWeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEd3ZjM1J5YjI1blBpRGlnSlJjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0I3SnlBbmZWeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHpjR0Z1SUdOc1lYTnpUbUZ0WlQxY0luRjFaWEpwWlhNdGJHbHpkQzFwZEdWdExYSnBaMmgwWENJK1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThjM0JoYmx4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQmpiR0Z6YzA1aGJXVTlYQ0p4ZFdWeWFXVnpMV3hwYm10Y0lseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0J2YmtOc2FXTnJQWHQwYUdsekxsOW9ZVzVrYkdWRGJHVmhjbFJ2Y0dsamZUNWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUTJ4bFlYSWdkRzl3YVdOY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEd3ZjM0JoYmo1Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOEwzTndZVzQrWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJRHd2WkdsMlBseHVJQ0FnSUNBZ0lDQWdJQ0FnUEM5c2FUNTlYRzRnSUNBZ0lDQWdJRHd2ZFd3K1hHNGdJQ0FnSUNBOEwyUnBkajVjYmlBZ0lDQXBPMXh1SUNCOVhHNTlYRzVjYm1WNGNHOXlkQ0JrWldaaGRXeDBJR052Ym01bFkzUW9jM1JoZEdVZ1BUNGdlMXh1SUNCeVpYUjFjbTRnZXlCMGIzQnBZem9nYzNSaGRHVXVkRzl3YVdNc0lITmxZWEpqYURvZ2MzUmhkR1V1YzJWaGNtTm9JSDA3WEc1OUtTaFJkV1Z5YVdWektUdGNiaUpkZlE9PSAqL1xuLypAIHNvdXJjZVVSTD1jb21wb25lbnRzL1F1ZXJpZXMuanMgKi8iXX0= */'
      }), _react2.default.createElement('h2', { className: 'queries-heading', 'data-jsx': 2730990752,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 73
        }
      }, 'Your queries'), _react2.default.createElement('ul', { className: 'queries-list', 'data-jsx': 2730990752,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 74
        }
      }, !(0, _strings.isEmptyOrNull)(this.props.search) && _react2.default.createElement('li', { className: 'queries-list-item', 'data-jsx': 2730990752,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 76
        }
      }, _react2.default.createElement('div', { className: 'queries-list-item-left', 'data-jsx': 2730990752,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 77
        }
      }, 'Searching for ', _react2.default.createElement('strong', { className: 'queries-emphasis', 'data-jsx': 2730990752,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 78
        }
      }, '\u201C', this.props.search, '\u201D'), ' \u2014', ' ', _react2.default.createElement('span', { className: 'queries-list-item-right', 'data-jsx': 2730990752,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 84
        }
      }, _react2.default.createElement('span', {
        className: 'queries-link',
        onClick: this._handleClearSearch, 'data-jsx': 2730990752,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 85
        }
      }, 'Clear search')))), !(0, _strings.isEmptyOrNull)(this.props.topic) && _react2.default.createElement('li', { className: 'queries-list-item', 'data-jsx': 2730990752,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 95
        }
      }, _react2.default.createElement('div', { className: 'queries-list-item-left', 'data-jsx': 2730990752,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 96
        }
      }, 'Selected', ' ', _react2.default.createElement('strong', { className: 'queries-emphasis', 'data-jsx': 2730990752,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 99
        }
      }, '\u201C', this.props.topic, '\u201D', ' '), ' \u2014', ' ', _react2.default.createElement('span', { className: 'queries-list-item-right', 'data-jsx': 2730990752,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 104
        }
      }, _react2.default.createElement('span', {
        className: 'queries-link',
        onClick: this._handleClearTopic, 'data-jsx': 2730990752,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 105
        }
      }, 'Clear topic'))))));
    }
  }]);

  return Queries;
}(_react2.default.PureComponent);

exports.default = (0, _reactRedux.connect)(function (state) {
  return { topic: state.topic, search: state.search };
})(Queries);
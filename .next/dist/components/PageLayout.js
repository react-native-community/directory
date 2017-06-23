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

var _Topics = require('../components/Topics');

var _Topics2 = _interopRequireDefault(_Topics);

var _Scoring = require('../components/Scoring');

var _Scoring2 = _interopRequireDefault(_Scoring);

var _Queries = require('../components/Queries');

var _Queries2 = _interopRequireDefault(_Queries);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _jsxFileName = '/Users/KINGSLAYER/Development/react-native-libraries/components/PageLayout.js';


var PageLayout = function (_React$PureComponent) {
  (0, _inherits3.default)(PageLayout, _React$PureComponent);

  function PageLayout() {
    (0, _classCallCheck3.default)(this, PageLayout);

    return (0, _possibleConstructorReturn3.default)(this, (PageLayout.__proto__ || (0, _getPrototypeOf2.default)(PageLayout)).apply(this, arguments));
  }

  (0, _createClass3.default)(PageLayout, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement('div', {
        'data-jsx': 1800926678,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 10
        }
      }, _react2.default.createElement(_style2.default, {
        styleId: 1800926678,
        css: '.page-layout[data-jsx="1800926678"] {width: 100%;max-width: 1319px;padding: 0 24px 0 24px;box-sizing: border-box;margin: 0 auto 0 auto; display:-webkit-box; display:-ms-flexbox; display:flex;-webkit-box-align: \'flex-start\';-ms-flex-align: \'flex-start\';align-items: \'flex-start\';-webkit-box-pack: \'space-between\';-ms-flex-pack: \'space-between\';justify-content: \'space-between\'}@media (max-width: 768px) {.page-layout[data-jsx="1800926678"] {-moz-flex-direction: column;-webkit-box-orient: vertical;-webkit-box-direction: normal;-ms-flex-direction: column;flex-direction: column}}.page-layout-left[data-jsx="1800926678"] {min-width: 25%;width: 100%;}.page-layout-right[data-jsx="1800926678"] {padding-left: 32px;padding-bottom: 48px;border-left: 1px solid #ECECEC;-ms-flex-negative: 0;flex-shrink: 0;-ms-flex-preferred-size: 25%;flex-basis: 25%}@media (max-width: 768px) {.page-layout-right[data-jsx="1800926678"] {padding-left: 0;border-left: 0;border-top: 1px solid #ECECEC}}\n/*@ sourceURL=components/PageLayout.js */\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9LSU5HU0xBWUVSL0RldmVsb3BtZW50L3JlYWN0LW5hdGl2ZS1saWJyYXJpZXMvY29tcG9uZW50cy9QYWdlTGF5b3V0LmpzIiwiY29tcG9uZW50cy9QYWdlTGF5b3V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVVvQixxQ0FFSSxZQUNNLGtCQUNLLHVCQUNBLHVCQUNELHNCQUNOLENBQUEsb0JBQ1UsQ0FEVixvQkFDVSxDQURWLGFBQ1UsZ0NBQ08sQUFEUCw2QkFDTyxBQURQLDBCQUNPLGtDQUVOLEFBRk0sK0JBRU4sQUFGTSxnQ0FFTixDQUtWLEFBTFUsMkJBQUEscUNBQ0YsNEJBQUEsNkJBQ3hCLEFBRHdCLDhCQUN4QixBQUR3QiwyQkFDeEIsQUFEd0Isc0JBQ3hCLENBQ0YsQ0FBQSxBQUVrQiwwQ0FDRixlQUNILFlBQ2IsQ0FFbUIsMkNBQ0MsbUJBQ0UscUJBQ1UsK0JBQ2hCLHFCQUNDLEFBREQsZUFDQyw2QkFFVyxBQUZYLGVBRVcsQ0FLNUIsQUFMNEIsMkJBQUEsMkNBQ1QsZ0JBQ0QsZUFDZSw2QkFDL0IsQ0FDRixDQUFBO0FDekNYLHlDQUF5QyIsImZpbGUiOiJ0by5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgVG9waWNzIGZyb20gJy4uL2NvbXBvbmVudHMvVG9waWNzJztcbmltcG9ydCBTY29yaW5nIGZyb20gJy4uL2NvbXBvbmVudHMvU2NvcmluZyc7XG5pbXBvcnQgUXVlcmllcyBmcm9tICcuLi9jb21wb25lbnRzL1F1ZXJpZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYWdlTGF5b3V0IGV4dGVuZHMgUmVhY3QuUHVyZUNvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPHN0eWxlIGpzeD57YFxuICAgICAgICAgIC5wYWdlLWxheW91dCB7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIG1heC13aWR0aDogMTMxOXB4O1xuICAgICAgICAgICAgcGFkZGluZzogMCAyNHB4IDAgMjRweDtcbiAgICAgICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgICAgICAgICBtYXJnaW46IDAgYXV0byAwIGF1dG87XG4gICAgICAgICAgICBkaXNwbGF5OiAnZmxleCc7XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogJ2ZsZXgtc3RhcnQnO1xuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiAnc3BhY2UtYmV0d2Vlbic7XG5cbiAgICAgICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuICAgICAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC5wYWdlLWxheW91dC1sZWZ0IHtcbiAgICAgICAgICAgIG1pbi13aWR0aDogMjUlO1xuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLnBhZ2UtbGF5b3V0LXJpZ2h0IHtcbiAgICAgICAgICAgIHBhZGRpbmctbGVmdDogMzJweDtcbiAgICAgICAgICAgIHBhZGRpbmctYm90dG9tOiA0OHB4O1xuICAgICAgICAgICAgYm9yZGVyLWxlZnQ6IDFweCBzb2xpZCAjRUNFQ0VDO1xuICAgICAgICAgICAgZmxleC1zaHJpbms6IDA7XG4gICAgICAgICAgICBmbGV4LWJhc2lzOiAyNSU7XG5cbiAgICAgICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuICAgICAgICAgICAgICBwYWRkaW5nLWxlZnQ6IDA7XG4gICAgICAgICAgICAgIGJvcmRlci1sZWZ0OiAwO1xuICAgICAgICAgICAgICBib3JkZXItdG9wOiAxcHggc29saWQgI0VDRUNFQztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIGB9PC9zdHlsZT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYWdlLWxheW91dFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFnZS1sYXlvdXQtbGVmdFwiPlxuICAgICAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYWdlLWxheW91dC1yaWdodFwiPlxuICAgICAgICAgICAgPFF1ZXJpZXMgLz5cbiAgICAgICAgICAgIDxUb3BpY3MgLz5cbiAgICAgICAgICAgIDxTY29yaW5nIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuIiwiLnBhZ2UtbGF5b3V0W2RhdGEtanN4PVwiMTgwMDkyNjY3OFwiXSB7d2lkdGg6IDEwMCU7bWF4LXdpZHRoOiAxMzE5cHg7cGFkZGluZzogMCAyNHB4IDAgMjRweDtib3gtc2l6aW5nOiBib3JkZXItYm94O21hcmdpbjogMCBhdXRvIDAgYXV0bztkaXNwbGF5Oi13ZWJraXQtZmxleDsgZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOiAnZmxleC1zdGFydCc7anVzdGlmeS1jb250ZW50OiAnc3BhY2UtYmV0d2Vlbic7QG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7LXdlYmtpdC1mbGV4LWRpcmVjdGlvbjogY29sdW1uOy1tb3otZmxleC1kaXJlY3Rpb246IGNvbHVtbjtmbGV4LWRpcmVjdGlvbjogY29sdW1uO319LnBhZ2UtbGF5b3V0LWxlZnRbZGF0YS1qc3g9XCIxODAwOTI2Njc4XCJdIHttaW4td2lkdGg6IDI1JTt3aWR0aDogMTAwJTt9LnBhZ2UtbGF5b3V0LXJpZ2h0W2RhdGEtanN4PVwiMTgwMDkyNjY3OFwiXSB7cGFkZGluZy1sZWZ0OiAzMnB4O3BhZGRpbmctYm90dG9tOiA0OHB4O2JvcmRlci1sZWZ0OiAxcHggc29saWQgI0VDRUNFQzstd2Via2l0LWZsZXgtc2hyaW5rOiAwOy1tb3otZmxleC1zaHJpbms6IDA7ZmxleC1zaHJpbms6IDA7LXdlYmtpdC1mbGV4LWJhc2lzOiAyNSU7LW1vei1mbGV4LWJhc2lzOiAyNSU7ZmxleC1iYXNpczogMjUlO0BtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge3BhZGRpbmctbGVmdDogMDtib3JkZXItbGVmdDogMDtib3JkZXItdG9wOiAxcHggc29saWQgI0VDRUNFQzt9fVxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltTnZiWEJ2Ym1WdWRITXZVR0ZuWlV4aGVXOTFkQzVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGVmIwSXNRVUZEU1N4eFEwRkRRU3haUVVOTkxHdENRVU5MTEhWQ1FVTkJMSFZDUVVORUxITkNRVU5PTEcxRFFVTlZMREJDUVVOUExHbERRVVZPTERKQ1FVTkdMR3RHUVVONFFpeERRVU5HTEVOQlJXdENMREJEUVVOR0xHVkJRMGdzV1VGRFlpeERRVVZ0UWl3eVEwRkRReXh0UWtGRFJTeHhRa0ZEVlN3clFrRkRhRUlzTUVSQlEwTXNOa1JCUlZjc01rSkJRMVFzWjBKQlEwUXNaVUZEWlN3NFFrRkRMMElzUTBGRFJpSXNJbVpwYkdVaU9pSmpiMjF3YjI1bGJuUnpMMUJoWjJWTVlYbHZkWFF1YW5NaUxDSnpiM1Z5WTJWU2IyOTBJam9pTDFWelpYSnpMMHRKVGtkVFRFRlpSVkl2UkdWMlpXeHZjRzFsYm5RdmNtVmhZM1F0Ym1GMGFYWmxMV3hwWW5KaGNtbGxjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW1sdGNHOXlkQ0JTWldGamRDQm1jbTl0SUNkeVpXRmpkQ2M3WEc1Y2JtbHRjRzl5ZENCVWIzQnBZM01nWm5KdmJTQW5MaTR2WTI5dGNHOXVaVzUwY3k5VWIzQnBZM01uTzF4dWFXMXdiM0owSUZOamIzSnBibWNnWm5KdmJTQW5MaTR2WTI5dGNHOXVaVzUwY3k5VFkyOXlhVzVuSnp0Y2JtbHRjRzl5ZENCUmRXVnlhV1Z6SUdaeWIyMGdKeTR1TDJOdmJYQnZibVZ1ZEhNdlVYVmxjbWxsY3ljN1hHNWNibVY0Y0c5eWRDQmtaV1poZFd4MElHTnNZWE56SUZCaFoyVk1ZWGx2ZFhRZ1pYaDBaVzVrY3lCU1pXRmpkQzVRZFhKbFEyOXRjRzl1Wlc1MElIdGNiaUFnY21WdVpHVnlLQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQThaR2wyUGx4dUlDQWdJQ0FnSUNBOGMzUjViR1VnYW5ONFBudGdYRzRnSUNBZ0lDQWdJQ0FnTG5CaFoyVXRiR0Y1YjNWMElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUhkcFpIUm9PaUF4TURBbE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnYldGNExYZHBaSFJvT2lBeE16RTVjSGc3WEc0Z0lDQWdJQ0FnSUNBZ0lDQndZV1JrYVc1bk9pQXdJREkwY0hnZ01DQXlOSEI0TzF4dUlDQWdJQ0FnSUNBZ0lDQWdZbTk0TFhOcGVtbHVaem9nWW05eVpHVnlMV0p2ZUR0Y2JpQWdJQ0FnSUNBZ0lDQWdJRzFoY21kcGJqb2dNQ0JoZFhSdklEQWdZWFYwYnp0Y2JpQWdJQ0FnSUNBZ0lDQWdJR1JwYzNCc1lYazZJQ2RtYkdWNEp6dGNiaUFnSUNBZ0lDQWdJQ0FnSUdGc2FXZHVMV2wwWlcxek9pQW5abXhsZUMxemRHRnlkQ2M3WEc0Z0lDQWdJQ0FnSUNBZ0lDQnFkWE4wYVdaNUxXTnZiblJsYm5RNklDZHpjR0ZqWlMxaVpYUjNaV1Z1Snp0Y2JseHVJQ0FnSUNBZ0lDQWdJQ0FnUUcxbFpHbGhJQ2h0WVhndGQybGtkR2c2SURjMk9IQjRLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJR1pzWlhndFpHbHlaV04wYVc5dU9pQmpiMngxYlc0N1hHNGdJQ0FnSUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJQ0FnTG5CaFoyVXRiR0Y1YjNWMExXeGxablFnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdiV2x1TFhkcFpIUm9PaUF5TlNVN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IzYVdSMGFEb2dNVEF3SlR0Y2JpQWdJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnSUNBdWNHRm5aUzFzWVhsdmRYUXRjbWxuYUhRZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnY0dGa1pHbHVaeTFzWldaME9pQXpNbkI0TzF4dUlDQWdJQ0FnSUNBZ0lDQWdjR0ZrWkdsdVp5MWliM1IwYjIwNklEUTRjSGc3WEc0Z0lDQWdJQ0FnSUNBZ0lDQmliM0prWlhJdGJHVm1kRG9nTVhCNElITnZiR2xrSUNORlEwVkRSVU03WEc0Z0lDQWdJQ0FnSUNBZ0lDQm1iR1Y0TFhOb2NtbHVhem9nTUR0Y2JpQWdJQ0FnSUNBZ0lDQWdJR1pzWlhndFltRnphWE02SURJMUpUdGNibHh1SUNBZ0lDQWdJQ0FnSUNBZ1FHMWxaR2xoSUNodFlYZ3RkMmxrZEdnNklEYzJPSEI0S1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUhCaFpHUnBibWN0YkdWbWREb2dNRHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdZbTl5WkdWeUxXeGxablE2SURBN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUdKdmNtUmxjaTEwYjNBNklERndlQ0J6YjJ4cFpDQWpSVU5GUTBWRE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdZSDA4TDNOMGVXeGxQbHh1SUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56VG1GdFpUMWNJbkJoWjJVdGJHRjViM1YwWENJK1hHNGdJQ0FnSUNBZ0lDQWdQR1JwZGlCamJHRnpjMDVoYldVOVhDSndZV2RsTFd4aGVXOTFkQzFzWldaMFhDSStYRzRnSUNBZ0lDQWdJQ0FnSUNCN2RHaHBjeTV3Y205d2N5NWphR2xzWkhKbGJuMWNiaUFnSUNBZ0lDQWdJQ0E4TDJScGRqNWNiaUFnSUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56VG1GdFpUMWNJbkJoWjJVdGJHRjViM1YwTFhKcFoyaDBYQ0krWEc0Z0lDQWdJQ0FnSUNBZ0lDQThVWFZsY21sbGN5QXZQbHh1SUNBZ0lDQWdJQ0FnSUNBZ1BGUnZjR2xqY3lBdlBseHVJQ0FnSUNBZ0lDQWdJQ0FnUEZOamIzSnBibWNnTHo1Y2JpQWdJQ0FnSUNBZ0lDQThMMlJwZGo1Y2JpQWdJQ0FnSUNBZ1BDOWthWFkrWEc0Z0lDQWdJQ0E4TDJScGRqNWNiaUFnSUNBcE8xeHVJQ0I5WEc1OVhHNGlYWDA9ICovXG4vKkAgc291cmNlVVJMPWNvbXBvbmVudHMvUGFnZUxheW91dC5qcyAqLyJdfQ== */'
      }), _react2.default.createElement('div', { className: 'page-layout', 'data-jsx': 1800926678,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 46
        }
      }, _react2.default.createElement('div', { className: 'page-layout-left', 'data-jsx': 1800926678,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 47
        }
      }, this.props.children), _react2.default.createElement('div', { className: 'page-layout-right', 'data-jsx': 1800926678,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 50
        }
      }, _react2.default.createElement(_Queries2.default, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 51
        }
      }), _react2.default.createElement(_Topics2.default, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 52
        }
      }), _react2.default.createElement(_Scoring2.default, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 53
        }
      }))));
    }
  }]);

  return PageLayout;
}(_react2.default.PureComponent);

exports.default = PageLayout;
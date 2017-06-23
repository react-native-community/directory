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

var _Link = require('../components/Link');

var _Link2 = _interopRequireDefault(_Link);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _jsxFileName = '/Users/KINGSLAYER/Development/react-native-libraries/components/Footer.js';


var Footer = function (_React$PureComponent) {
  (0, _inherits3.default)(Footer, _React$PureComponent);

  function Footer() {
    (0, _classCallCheck3.default)(this, Footer);

    return (0, _possibleConstructorReturn3.default)(this, (Footer.__proto__ || (0, _getPrototypeOf2.default)(Footer)).apply(this, arguments));
  }

  (0, _createClass3.default)(Footer, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement('div', { className: 'container', 'data-jsx': 2269183392,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 8
        }
      }, _react2.default.createElement(_style2.default, {
        styleId: 2269183392,
        css: '.container[data-jsx="2269183392"] {border-top: 1px solid #ECECEC;width: 100%;}.footer[data-jsx="2269183392"] {width: 100%;max-width: 1319px;padding: 0 24px 0 24px;box-sizing: border-box;margin: 0 auto 0 auto; display:-webkit-box; display:-ms-flexbox; display:flex;-webkit-box-align: \'flex-start\';-ms-flex-align: \'flex-start\';align-items: \'flex-start\';-webkit-box-pack: \'space-between\';-ms-flex-pack: \'space-between\';justify-content: \'space-between\';}.text[data-jsx="2269183392"] {margin: 24px 0 24px 0;}\n/*@ sourceURL=components/Footer.js */\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9LSU5HU0xBWUVSL0RldmVsb3BtZW50L3JlYWN0LW5hdGl2ZS1saWJyYXJpZXMvY29tcG9uZW50cy9Gb290ZXIuanMiLCJjb21wb25lbnRzL0Zvb3Rlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFRb0IsbUNBRXNCLDhCQUNsQixZQUNiLENBRVEsZ0NBQ0ssWUFDTSxrQkFDSyx1QkFDQSx1QkFDRCxzQkFDTixDQUFBLG9CQUNVLENBRFYsb0JBQ1UsQ0FEVixhQUNVLGdDQUNPLEFBRFAsNkJBQ08sQUFEUCwwQkFDTyxrQ0FDbEMsQUFEa0MsK0JBQ2xDLEFBRGtDLGlDQUNsQyxDQUVNLDhCQUNpQixzQkFDdkIsQ0FBQTtBQ3pCWCxxQ0FBcUMiLCJmaWxlIjoidG8uY3NzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IExpbmsgZnJvbSAnLi4vY29tcG9uZW50cy9MaW5rJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRm9vdGVyIGV4dGVuZHMgUmVhY3QuUHVyZUNvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgPHN0eWxlIGpzeD57YFxuICAgICAgICAgIC5jb250YWluZXIge1xuICAgICAgICAgICAgYm9yZGVyLXRvcDogMXB4IHNvbGlkICNFQ0VDRUM7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAuZm9vdGVyIHtcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgbWF4LXdpZHRoOiAxMzE5cHg7XG4gICAgICAgICAgICBwYWRkaW5nOiAwIDI0cHggMCAyNHB4O1xuICAgICAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgICAgICAgIG1hcmdpbjogMCBhdXRvIDAgYXV0bztcbiAgICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JztcbiAgICAgICAgICAgIGFsaWduLWl0ZW1zOiAnZmxleC1zdGFydCc7XG4gICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAudGV4dCB7XG4gICAgICAgICAgICBtYXJnaW46IDI0cHggMCAyNHB4IDA7XG4gICAgICAgICAgfVxuICAgICAgICBgfTwvc3R5bGU+XG4gICAgICAgIDxoZWFkZXIgY2xhc3NOYW1lPVwiZm9vdGVyXCI+XG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dFwiPlxuICAgICAgICAgICAgV2FudCB0byBsZWFybiBtb3JlIGFib3V0IFJlYWN0IE5hdGl2ZT8gQ2hlY2sgb3V0IHRoZVxuICAgICAgICAgICAgeycgJ31cbiAgICAgICAgICAgIDxMaW5rXG4gICAgICAgICAgICAgIGlzU3R5bGVkXG4gICAgICAgICAgICAgIGhyZWY9XCJodHRwczovL2ZhY2Vib29rLmdpdGh1Yi5pby9yZWFjdC1uYXRpdmUvZG9jcy9nZXR0aW5nLXN0YXJ0ZWQuaHRtbFwiPlxuICAgICAgICAgICAgICBvZmZpY2FsIGRvY3NcbiAgICAgICAgICAgIDwvTGluaz4sIGFuZCA8TGluayBpc1N0eWxlZCBocmVmPVwiaHR0cHM6Ly9leHBvLmlvXCI+XG4gICAgICAgICAgICAgIEV4cG9cbiAgICAgICAgICAgIDwvTGluaz4uXG4gICAgICAgICAgPC9wPlxuICAgICAgICA8L2hlYWRlcj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiIsIi5jb250YWluZXJbZGF0YS1qc3g9XCIyMjY5MTgzMzkyXCJdIHtib3JkZXItdG9wOiAxcHggc29saWQgI0VDRUNFQzt3aWR0aDogMTAwJTt9LmZvb3RlcltkYXRhLWpzeD1cIjIyNjkxODMzOTJcIl0ge3dpZHRoOiAxMDAlO21heC13aWR0aDogMTMxOXB4O3BhZGRpbmc6IDAgMjRweCAwIDI0cHg7Ym94LXNpemluZzogYm9yZGVyLWJveDttYXJnaW46IDAgYXV0byAwIGF1dG87ZGlzcGxheTotd2Via2l0LWZsZXg7IGRpc3BsYXk6ZmxleDthbGlnbi1pdGVtczogJ2ZsZXgtc3RhcnQnO2p1c3RpZnktY29udGVudDogJ3NwYWNlLWJldHdlZW4nO30udGV4dFtkYXRhLWpzeD1cIjIyNjkxODMzOTJcIl0ge21hcmdpbjogMjRweCAwIDI0cHggMDt9XG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW1OdmJYQnZibVZ1ZEhNdlJtOXZkR1Z5TG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFWRnZRaXhCUVVORkxHMURRVU52UWl3NFFrRkRiRUlzV1VGRFlpeERRVVZSTEdkRFFVTkxMRmxCUTAwc2EwSkJRMHNzZFVKQlEwRXNkVUpCUTBRc2MwSkJRMDRzYlVOQlExVXNNRUpCUTA4c2FVTkJRMnhETEVOQlJVMHNPRUpCUTJsQ0xITkNRVU4yUWlJc0ltWnBiR1VpT2lKamIyMXdiMjVsYm5SekwwWnZiM1JsY2k1cWN5SXNJbk52ZFhKalpWSnZiM1FpT2lJdlZYTmxjbk12UzBsT1IxTk1RVmxGVWk5RVpYWmxiRzl3YldWdWRDOXlaV0ZqZEMxdVlYUnBkbVV0YkdsaWNtRnlhV1Z6SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaWFXMXdiM0owSUZKbFlXTjBJR1p5YjIwZ0ozSmxZV04wSnp0Y2JseHVhVzF3YjNKMElFeHBibXNnWm5KdmJTQW5MaTR2WTI5dGNHOXVaVzUwY3k5TWFXNXJKenRjYmx4dVpYaHdiM0owSUdSbFptRjFiSFFnWTJ4aGMzTWdSbTl2ZEdWeUlHVjRkR1Z1WkhNZ1VtVmhZM1F1VUhWeVpVTnZiWEJ2Ym1WdWRDQjdYRzRnSUhKbGJtUmxjaWdwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdLRnh1SUNBZ0lDQWdQR1JwZGlCamJHRnpjMDVoYldVOVhDSmpiMjUwWVdsdVpYSmNJajVjYmlBZ0lDQWdJQ0FnUEhOMGVXeGxJR3B6ZUQ1N1lGeHVJQ0FnSUNBZ0lDQWdJQzVqYjI1MFlXbHVaWElnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdZbTl5WkdWeUxYUnZjRG9nTVhCNElITnZiR2xrSUNORlEwVkRSVU03WEc0Z0lDQWdJQ0FnSUNBZ0lDQjNhV1IwYURvZ01UQXdKVHRjYmlBZ0lDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdJQ0F1Wm05dmRHVnlJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIZHBaSFJvT2lBeE1EQWxPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2JXRjRMWGRwWkhSb09pQXhNekU1Y0hnN1hHNGdJQ0FnSUNBZ0lDQWdJQ0J3WVdSa2FXNW5PaUF3SURJMGNIZ2dNQ0F5TkhCNE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnWW05NExYTnBlbWx1WnpvZ1ltOXlaR1Z5TFdKdmVEdGNiaUFnSUNBZ0lDQWdJQ0FnSUcxaGNtZHBiam9nTUNCaGRYUnZJREFnWVhWMGJ6dGNiaUFnSUNBZ0lDQWdJQ0FnSUdScGMzQnNZWGs2SUNkbWJHVjRKenRjYmlBZ0lDQWdJQ0FnSUNBZ0lHRnNhV2R1TFdsMFpXMXpPaUFuWm14bGVDMXpkR0Z5ZENjN1hHNGdJQ0FnSUNBZ0lDQWdJQ0JxZFhOMGFXWjVMV052Ym5SbGJuUTZJQ2R6Y0dGalpTMWlaWFIzWldWdUp6dGNiaUFnSUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ0lDQXVkR1Y0ZENCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0J0WVhKbmFXNDZJREkwY0hnZ01DQXlOSEI0SURBN1hHNGdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0JnZlR3dmMzUjViR1UrWEc0Z0lDQWdJQ0FnSUR4b1pXRmtaWElnWTJ4aGMzTk9ZVzFsUFZ3aVptOXZkR1Z5WENJK1hHNGdJQ0FnSUNBZ0lDQWdQSEFnWTJ4aGMzTk9ZVzFsUFZ3aWRHVjRkRndpUGx4dUlDQWdJQ0FnSUNBZ0lDQWdWMkZ1ZENCMGJ5QnNaV0Z5YmlCdGIzSmxJR0ZpYjNWMElGSmxZV04wSUU1aGRHbDJaVDhnUTJobFkyc2diM1YwSUhSb1pWeHVJQ0FnSUNBZ0lDQWdJQ0FnZXljZ0ozMWNiaUFnSUNBZ0lDQWdJQ0FnSUR4TWFXNXJYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lHbHpVM1I1YkdWa1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUdoeVpXWTlYQ0pvZEhSd2N6b3ZMMlpoWTJWaWIyOXJMbWRwZEdoMVlpNXBieTl5WldGamRDMXVZWFJwZG1VdlpHOWpjeTluWlhSMGFXNW5MWE4wWVhKMFpXUXVhSFJ0YkZ3aVBseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNCdlptWnBZMkZzSUdSdlkzTmNiaUFnSUNBZ0lDQWdJQ0FnSUR3dlRHbHVhejRzSUdGdVpDQThUR2x1YXlCcGMxTjBlV3hsWkNCb2NtVm1QVndpYUhSMGNITTZMeTlsZUhCdkxtbHZYQ0krWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJRVY0Y0c5Y2JpQWdJQ0FnSUNBZ0lDQWdJRHd2VEdsdWF6NHVYRzRnSUNBZ0lDQWdJQ0FnUEM5d1BseHVJQ0FnSUNBZ0lDQThMMmhsWVdSbGNqNWNiaUFnSUNBZ0lEd3ZaR2wyUGx4dUlDQWdJQ2s3WEc0Z0lIMWNibjFjYmlKZGZRPT0gKi9cbi8qQCBzb3VyY2VVUkw9Y29tcG9uZW50cy9Gb290ZXIuanMgKi8iXX0= */'
      }), _react2.default.createElement('header', { className: 'footer', 'data-jsx': 2269183392,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 30
        }
      }, _react2.default.createElement('p', { className: 'text', 'data-jsx': 2269183392,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 31
        }
      }, 'Want to learn more about React Native? Check out the', ' ', _react2.default.createElement(_Link2.default, {
        isStyled: true,
        href: 'https://facebook.github.io/react-native/docs/getting-started.html', __source: {
          fileName: _jsxFileName,
          lineNumber: 34
        }
      }, 'offical docs'), ', and ', _react2.default.createElement(_Link2.default, { isStyled: true, href: 'https://expo.io', __source: {
          fileName: _jsxFileName,
          lineNumber: 38
        }
      }, 'Expo'), '.')));
    }
  }]);

  return Footer;
}(_react2.default.PureComponent);

exports.default = Footer;
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

var _head = require('next/dist/lib/head.js');

var _head2 = _interopRequireDefault(_head);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _jsxFileName = '/Users/KINGSLAYER/Development/react-native-libraries/components/Document.js';


var Document = function (_React$Component) {
  (0, _inherits3.default)(Document, _React$Component);

  function Document() {
    (0, _classCallCheck3.default)(this, Document);

    return (0, _possibleConstructorReturn3.default)(this, (Document.__proto__ || (0, _getPrototypeOf2.default)(Document)).apply(this, arguments));
  }

  (0, _createClass3.default)(Document, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement('div', {
        'data-jsx': 798263436,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 12
        }
      }, _react2.default.createElement(_style2.default, {
        styleId: 798263436,
        css: '\n          @font-face {\n            font-family: \'office-code\';\n            src: url(\'static/fonts/OfficeCodePro-Regular.eot\');\n            src: url(\'static/fonts/OfficeCodePro-Regular.woff2\') format(\'woff2\'),\n                 url(\'static/fonts/OfficeCodePro-Regular.woff\') format(\'woff\'),\n                 url(\'static/fonts/OfficeCodePro-Regular.ttf\') format(\'truetype\');\n          }\n\n          @font-face {\n            font-family: \'office-code-medium\';\n            src: url(\'static/fonts/OfficeCodePro-Medium.eot\');\n            src: url(\'static/fonts/OfficeCodePro-Medium.woff2\') format(\'woff2\'),\n                 url(\'static/fonts/OfficeCodePro-Medium.woff\') format(\'woff\'),\n                 url(\'static/fonts/OfficeCodePro-Medium.ttf\') format(\'truetype\');\n          }\n\n          html, body, div, span, applet, object, iframe,\n          h1, h2, h3, h4, h5, h6, p, blockquote, pre,\n          a, abbr, acronym, address, big, cite, code,\n          del, dfn, em, img, ins, kbd, q, s, samp,\n          small, strike, strong, sub, sup, tt, var,\n          b, u, i, center,\n          dl, dt, dd, ol, ul, li,\n          fieldset, form, label, legend,\n          table, caption, tbody, tfoot, thead, tr, th, td,\n          article, aside, canvas, details, embed,\n          figure, figcaption, footer, header, hgroup,\n          menu, nav, output, ruby, section, summary,\n          time, mark, audio, video {\n            margin: 0;\n            padding: 0;\n            border: 0;\n            font-size: 100%;\n            font: inherit;\n            vertical-align: baseline;\n            box-sizing: border-box;\n          }\n\n          article, aside, details, figcaption, figure,\n          footer, header, hgroup, menu, nav, section {\n            display: block;\n          }\n\n          body {\n            line-height: 1;\n            font-size: 14px;\n            color: #000000;\n            font-family: \'office-code\', monospace\n          }\n\n          @media (max-width: 768px) {\n\n            body {\n                        font-size: 12px;\n            }\n            }\n\n          p, h1, h2, h3, h4, h5, h6 {\n            line-height: 1.5;\n          }\n\n          ol, ul {\n            list-style: none;\n          }\n\n          button, textarea, input {\n            resize: none;\n            border: 0;\n            outline: 0;\n            padding: 0;\n            margin: 0\n          }\n\n          button:focus, textarea:focus, input:focus {\n            border: 0;\n            outline: 0;\n}\n\n          blockquote, q {\n            quotes: none\n          }\n\n          blockquote:before,\n            blockquote:after,\n            q:before,\n            q:after {\n            content: \'\';\n            content: none;\n}\n\n          table {\n            border-collapse: collapse;\n            border-spacing: 0;\n          }\n        '
      }), _react2.default.createElement(_head2.default, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 104
        }
      }, _react2.default.createElement('title', {
        'data-jsx': 798263436,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 105
        }
      }, this.props.title), _react2.default.createElement('meta', { name: 'twitter:title', content: this.props.title, 'data-jsx': 798263436,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 108
        }
      }), _react2.default.createElement('meta', { property: 'og:title', content: this.props.title, 'data-jsx': 798263436,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 109
        }
      }), _react2.default.createElement('meta', { name: 'description', content: this.props.description, 'data-jsx': 798263436,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 111
        }
      }), _react2.default.createElement('meta', { property: 'og:description', content: this.props.description, 'data-jsx': 798263436,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 112
        }
      }), _react2.default.createElement('meta', { name: 'twitter:description', content: this.props.description, 'data-jsx': 798263436,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 113
        }
      }), _react2.default.createElement('meta', { name: 'format-detection', content: 'telephone=no', 'data-jsx': 798263436,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 115
        }
      }), _react2.default.createElement('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1', 'data-jsx': 798263436,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 116
        }
      }), _react2.default.createElement('meta', { charSet: 'UTF-8', 'data-jsx': 798263436,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 117
        }
      }), _react2.default.createElement('meta', { name: 'sourceApp', content: 'mobileWeb', 'data-jsx': 798263436,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 118
        }
      }), _react2.default.createElement('meta', { httpEquiv: 'X-UA-Compatible', content: 'IE=edge', 'data-jsx': 798263436,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 119
        }
      }), _react2.default.createElement('meta', { property: 'og:locale', content: 'en_US', 'data-jsx': 798263436,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 120
        }
      }), _react2.default.createElement('meta', { property: 'og:type', content: 'website', 'data-jsx': 798263436,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 121
        }
      }), _react2.default.createElement('meta', { name: 'twitter:card', content: 'summary', 'data-jsx': 798263436,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 123
        }
      }), _react2.default.createElement('meta', { name: 'apple-mobile-web-app-capable', content: 'yes', 'data-jsx': 798263436,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 124
        }
      }), _react2.default.createElement('meta', { property: 'og:site_name', content: 'React Native Directory', 'data-jsx': 798263436,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 125
        }
      }), _react2.default.createElement('meta', { name: 'twitter:site', content: '@expo_io', 'data-jsx': 798263436,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 126
        }
      }), _react2.default.createElement('link', { rel: 'shortcut icon', href: '/static/favicon.png', 'data-jsx': 798263436,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 128
        }
      }), _react2.default.createElement('link', { rel: 'apple-touch-icon-precomposed', content: '/static/logo.png', 'data-jsx': 798263436,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 130
        }
      }), _react2.default.createElement('meta', { property: 'og:image', content: '/static/logo.png', 'data-jsx': 798263436,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 131
        }
      }), _react2.default.createElement('meta', { name: 'twitter:image', content: '/static/logo.png', 'data-jsx': 798263436,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 132
        }
      }), _react2.default.createElement('meta', { name: 'msapplication-TileImage', content: '/static/logo.png', 'data-jsx': 798263436,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 133
        }
      })), this.props.children);
    }
  }]);

  return Document;
}(_react2.default.Component);

Document.defaultProps = {
  title: 'Native Directory',
  description: 'Native Directory is a curated list of React Native libraries to help you build your projects.'
};
exports.default = Document;
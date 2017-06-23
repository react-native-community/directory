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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _nextReduxWrapper = require('next-redux-wrapper');

var _nextReduxWrapper2 = _interopRequireDefault(_nextReduxWrapper);

var _Document = require('../components/Document');

var _Document2 = _interopRequireDefault(_Document);

var _PageLayout = require('../components/PageLayout');

var _PageLayout2 = _interopRequireDefault(_PageLayout);

var _Navigation = require('../components/Navigation');

var _Navigation2 = _interopRequireDefault(_Navigation);

var _Footer = require('../components/Footer');

var _Footer2 = _interopRequireDefault(_Footer);

var _Header = require('../components/Header');

var _Header2 = _interopRequireDefault(_Header);

var _List = require('../components/List');

var _List2 = _interopRequireDefault(_List);

var _store = require('../common/store');

var _search = require('../common/search');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ExpoPage = function (_React$PureComponent) {
  (0, _inherits3.default)(ExpoPage, _React$PureComponent);

  function ExpoPage() {
    (0, _classCallCheck3.default)(this, ExpoPage);

    return (0, _possibleConstructorReturn3.default)(this, (ExpoPage.__proto__ || (0, _getPrototypeOf2.default)(ExpoPage)).apply(this, arguments));
  }

  (0, _createClass3.default)(ExpoPage, [{
    key: 'render',
    value: function render() {
      var sortedData = this.props.topic ? (0, _search.handleTopicSorting)({
        data: this.props.expo,
        topic: this.props.topic,
        search: this.props.search
      }) : (0, _search.handleSearchSorting)({
        data: this.props.expo,
        topic: this.props.topic,
        search: this.props.search
      });

      return _react2.default.createElement(_Document2.default, null, _react2.default.createElement(_Header2.default, null), _react2.default.createElement(_Navigation2.default, { category: 'expo' }), _react2.default.createElement(_PageLayout2.default, null, _react2.default.createElement(_List2.default, { topics: this.props.topics, data: sortedData })), _react2.default.createElement(_Footer2.default, null));
    }
  }]);

  return ExpoPage;
}(_react2.default.PureComponent);

exports.default = (0, _nextReduxWrapper2.default)(_store.initStore, function (state) {
  return state;
})(ExpoPage);
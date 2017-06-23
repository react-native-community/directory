'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initStore = exports.reducer = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _redux = require('redux');

var _data = require('../build/data.json');

var _data2 = _interopRequireDefault(_data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var topics = {};
var all = [].concat((0, _toConsumableArray3.default)(_data2.default.imcompatible), (0, _toConsumableArray3.default)(_data2.default.expo));

all.forEach(function (repo) {
  repo.topics.forEach(function (topic) {
    if (!topics[topic]) {
      topics[topic] = 1;
      return;
    }

    topics[topic] += 1;
    return;
  });
});

var INITIAL_STATE = {
  all: all,
  expo: _data2.default.expo,
  topics: topics,
  search: '',
  topic: undefined
};

var reducer = exports.reducer = function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE;
  var action = arguments[1];

  switch (action.type) {
    case 'SEARCH_LIBRARY':
      return (0, _extends3.default)({}, state, { search: action.value });
    case 'TOPIC_PICKED':
      return (0, _extends3.default)({}, state, { topic: action.value, search: '' });
    case 'CLEAR_TOPIC':
      return (0, _extends3.default)({}, state, { topic: '' });
    case 'CLEAR_SEARCH':
      return (0, _extends3.default)({}, state, { search: '' });
    default:
      return state;
  }
};

var initStore = exports.initStore = function initStore(initialState) {
  return (0, _redux.createStore)(reducer, initialState);
};
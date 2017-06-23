'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getTimeSinceToday = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _strings = require('../common/strings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MINUTE = 60;
var HOUR = MINUTE * 60;
var DAY = HOUR * 24;
var WEEK = DAY * 7;
var MONTH = DAY * 30;
var YEAR = DAY * 365;

var getTimeSinceToday = exports.getTimeSinceToday = function getTimeSinceToday(date) {
    var updateTimeSeconds = new Date(date).getTime();
    var currentTimeSeconds = new Date().getTime();

    var seconds = Math.abs(currentTimeSeconds - updateTimeSeconds) / 1000;
    seconds = seconds > 0 ? seconds : 1;

    var _ref = seconds < MINUTE ? [Math.round(seconds), 'second'] : seconds < HOUR ? [Math.round(seconds / MINUTE), 'minute'] : seconds < DAY ? [Math.round(seconds / HOUR), 'hour'] : seconds < WEEK ? [Math.round(seconds / DAY), 'day'] : seconds < MONTH ? [Math.round(seconds / WEEK), 'week'] : seconds < YEAR ? [Math.round(seconds / MONTH), 'month'] : [Math.round(seconds / YEAR), 'year'],
        _ref2 = (0, _slicedToArray3.default)(_ref, 2),
        value = _ref2[0],
        unit = _ref2[1];

    unit = (0, _strings.pluralize)(unit, value);

    return value + ' ' + unit + ' ago';
};
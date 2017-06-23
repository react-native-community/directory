'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var pluralize = exports.pluralize = function pluralize(text, count) {
  return count > 1 || count === 0 ? text + 's' : text;
};

var elide = exports.elide = function elide(string) {
  return string ? string.substring(0, 140) + '...' : '...';
};

var isEmptyOrNull = exports.isEmptyOrNull = function isEmptyOrNull(text) {
  return !text || !text.trim();
};
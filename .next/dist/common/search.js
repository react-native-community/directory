'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleSearchSorting = exports.handleTopicSorting = undefined;

var _strings = require('../common/strings');

var handleTopicSorting = exports.handleTopicSorting = function handleTopicSorting(_ref) {
  var data = _ref.data,
      topic = _ref.topic,
      search = _ref.search;

  return data.filter(function (e) {
    var isTopicMatch = void 0;
    e.topics.forEach(function (t) {
      if (t.includes(topic)) {
        isTopicMatch = true;
      }
    });

    if (!(0, _strings.isEmptyOrNull)(search)) {
      var isNameMatch = e.name.includes(search);
      var isDescriptionMatch = e.description.includes(search);

      return isTopicMatch && (isNameMatch || isDescriptionMatch);
    }

    return isTopicMatch;
  });
};

var handleSearchSorting = exports.handleSearchSorting = function handleSearchSorting(_ref2) {
  var data = _ref2.data,
      search = _ref2.search;

  return data.filter(function (e) {
    if ((0, _strings.isEmptyOrNull)(search)) {
      return true;
    }

    var isNameMatch = e.name.includes(search);
    var isDescriptionMatch = e.description.includes(search);

    var isTopicMatch = void 0;
    e.topics.forEach(function (t) {
      if (t.includes(search)) {
        isTopicMatch = true;
      }
    });

    return isNameMatch || isTopicMatch || isDescriptionMatch;
  });
};
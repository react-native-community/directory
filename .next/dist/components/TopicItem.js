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

var _jsxFileName = '/Users/KINGSLAYER/Development/react-native-libraries/components/TopicItem.js';


var TopicItem = function (_React$PureComponent) {
  (0, _inherits3.default)(TopicItem, _React$PureComponent);

  function TopicItem() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, TopicItem);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = TopicItem.__proto__ || (0, _getPrototypeOf2.default)(TopicItem)).call.apply(_ref, [this].concat(args))), _this), _this._handleChooseTopic = function () {
      if (document) {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      }

      _this.props.dispatch({
        type: 'TOPIC_PICKED',
        value: _this.props.children
      });
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(TopicItem, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement('span', { className: 'item', onClick: this._handleChooseTopic, 'data-jsx': 3413578913,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 18
        }
      }, _react2.default.createElement(_style2.default, {
        styleId: 3413578913,
        css: '.item[data-jsx="3413578913"] {display: inline-block;margin-right: 8px;text-decoration: underline;transition: all 200ms ease;transition-property: opacity, -webkit-transform;transition-property: opacity, transform;transition-property: opacity, transform, -webkit-transform;cursor: pointer;word-wrap: break-word;word-break: break-word}.item[data-jsx="3413578913"][data-jsx="3413578913"]:hover {opacity: 0.5}.item[data-jsx="3413578913"][data-jsx="3413578913"]:active {-webkit-transform: scale(1.2);transform: scale(1.2)}.item-count[data-jsx="3413578913"] {font-family: \'office-code-medium\', monospace;color: rgba(65, 160, 248, 1);}\n/*@ sourceURL=components/TopicItem.js */\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9LSU5HU0xBWUVSL0RldmVsb3BtZW50L3JlYWN0LW5hdGl2ZS1saWJyYXJpZXMvY29tcG9uZW50cy9Ub3BpY0l0ZW0uanMiLCJjb21wb25lbnRzL1RvcGljSXRlbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFrQm9CLDhCQUVjLHNCQUNKLGtCQUNTLDJCQUNBLDJCQUNhLGdEQUN4QixBQUR3Qix3Q0FDeEIsQUFEd0IsMkRBQ3hCLGdCQUNVLHNCQUNILHNCQUVkLENBU0UsQUFURiwyREFDTSxZQUNkLENBRVMsNERBQ2MsOEJBQUEscUJBQ3ZCLENBQ0YsQUFFWSxvQ0FDa0MsNkNBQ2hCLDZCQUM5QixDQUFBO0FDdkNYLHdDQUF3QyIsImZpbGUiOiJ0by5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcblxuY2xhc3MgVG9waWNJdGVtIGV4dGVuZHMgUmVhY3QuUHVyZUNvbXBvbmVudCB7XG4gIF9oYW5kbGVDaG9vc2VUb3BpYyA9ICgpID0+IHtcbiAgICBpZiAoZG9jdW1lbnQpIHtcbiAgICAgIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCA9IDA7XG4gICAgfVxuXG4gICAgdGhpcy5wcm9wcy5kaXNwYXRjaCh7XG4gICAgICB0eXBlOiAnVE9QSUNfUElDS0VEJyxcbiAgICAgIHZhbHVlOiB0aGlzLnByb3BzLmNoaWxkcmVuLFxuICAgIH0pO1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaXRlbVwiIG9uQ2xpY2s9e3RoaXMuX2hhbmRsZUNob29zZVRvcGljfT5cbiAgICAgICAgPHN0eWxlIGpzeD57YFxuICAgICAgICAgIC5pdGVtIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgICAgIG1hcmdpbi1yaWdodDogOHB4O1xuICAgICAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiBhbGwgMjAwbXMgZWFzZTtcbiAgICAgICAgICAgIHRyYW5zaXRpb24tcHJvcGVydHk6IG9wYWNpdHksIHRyYW5zZm9ybTtcbiAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgICAgIG92ZXJmbG93LXdyYXA6IGJyZWFrLXdvcmQ7XG4gICAgICAgICAgICB3b3JkLWJyZWFrOiBicmVhay13b3JkO1xuXG4gICAgICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgICAgb3BhY2l0eTogMC41O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAmOmFjdGl2ZSB7XG4gICAgICAgICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMS4yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAuaXRlbS1jb3VudCB7XG4gICAgICAgICAgICBmb250LWZhbWlseTogJ29mZmljZS1jb2RlLW1lZGl1bScsIG1vbm9zcGFjZTtcbiAgICAgICAgICAgIGNvbG9yOiByZ2JhKDY1LCAxNjAsIDI0OCwgMSk7XG4gICAgICAgICAgfVxuICAgICAgICBgfTwvc3R5bGU+XG4gICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxuICAgICAgICBbXG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIml0ZW0tY291bnRcIj57dGhpcy5wcm9wcy5jb3VudH08L3NwYW4+XG4gICAgICAgIF1cbiAgICAgIDwvc3Bhbj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3Qoc3RhdGUgPT4ge1xuICByZXR1cm4ge307XG59KShUb3BpY0l0ZW0pO1xuIiwiLml0ZW1bZGF0YS1qc3g9XCIzNDEzNTc4OTEzXCJdIHtkaXNwbGF5OiBpbmxpbmUtYmxvY2s7bWFyZ2luLXJpZ2h0OiA4cHg7dGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7LXdlYmtpdC10cmFuc2l0aW9uOiBhbGwgMjAwbXMgZWFzZTstbW96LXRyYW5zaXRpb246IGFsbCAyMDBtcyBlYXNlOy1tcy10cmFuc2l0aW9uOiBhbGwgMjAwbXMgZWFzZTt0cmFuc2l0aW9uOiBhbGwgMjAwbXMgZWFzZTstd2Via2l0LXRyYW5zaXRpb24tcHJvcGVydHk6IG9wYWNpdHksIHRyYW5zZm9ybTstbW96LXRyYW5zaXRpb24tcHJvcGVydHk6IG9wYWNpdHksIHRyYW5zZm9ybTstbXMtdHJhbnNpdGlvbi1wcm9wZXJ0eTogb3BhY2l0eSwgdHJhbnNmb3JtO3RyYW5zaXRpb24tcHJvcGVydHk6IG9wYWNpdHksIHRyYW5zZm9ybTtjdXJzb3I6IHBvaW50ZXI7b3ZlcmZsb3ctd3JhcDogYnJlYWstd29yZDt3b3JkLWJyZWFrOiBicmVhay13b3JkOyZbZGF0YS1qc3g9XCIzNDEzNTc4OTEzXCJdOmhvdmVyIHtvcGFjaXR5OiAwLjU7fSZbZGF0YS1qc3g9XCIzNDEzNTc4OTEzXCJdOmFjdGl2ZSB7LXdlYmtpdC10cmFuc2Zvcm06IHNjYWxlKDEuMik7LW1vei10cmFuc2Zvcm06IHNjYWxlKDEuMik7LW1zLXRyYW5zZm9ybTogc2NhbGUoMS4yKTt0cmFuc2Zvcm06IHNjYWxlKDEuMik7fX0uaXRlbS1jb3VudFtkYXRhLWpzeD1cIjM0MTM1Nzg5MTNcIl0ge2ZvbnQtZmFtaWx5OiAnb2ZmaWNlLWNvZGUtbWVkaXVtJywgbW9ub3NwYWNlO2NvbG9yOiByZ2JhKDY1LCAxNjAsIDI0OCwgMSk7fVxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltTnZiWEJ2Ym1WdWRITXZWRzl3YVdOSmRHVnRMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVd0Q2IwSXNRVUZEU0N3NFFrRkRhVUlzYzBKQlEwb3NhMEpCUTFNc01rSkJRMEVzTmtoQlEyRXNhVXhCUTNoQ0xHZENRVU5WTERCQ1FVTklMSFZDUVVWa0xHZERRVU5OTEdGQlEyUXNRMEZGVXl4cFEwRkRZeXg1UjBGRGRrSXNRMEZEUml4RFFVVlpMRzlEUVVOclF5dzJRMEZEYUVJc05rSkJRemxDSWl3aVptbHNaU0k2SW1OdmJYQnZibVZ1ZEhNdlZHOXdhV05KZEdWdExtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpOVZjMlZ5Y3k5TFNVNUhVMHhCV1VWU0wwUmxkbVZzYjNCdFpXNTBMM0psWVdOMExXNWhkR2wyWlMxc2FXSnlZWEpwWlhNaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SnBiWEJ2Y25RZ1VtVmhZM1FnWm5KdmJTQW5jbVZoWTNRbk8xeHVhVzF3YjNKMElIc2dZMjl1Ym1WamRDQjlJR1p5YjIwZ0ozSmxZV04wTFhKbFpIVjRKenRjYmx4dVkyeGhjM01nVkc5d2FXTkpkR1Z0SUdWNGRHVnVaSE1nVW1WaFkzUXVVSFZ5WlVOdmJYQnZibVZ1ZENCN1hHNGdJRjlvWVc1a2JHVkRhRzl2YzJWVWIzQnBZeUE5SUNncElEMCtJSHRjYmlBZ0lDQnBaaUFvWkc5amRXMWxiblFwSUh0Y2JpQWdJQ0FnSUdSdlkzVnRaVzUwTG1KdlpIa3VjMk55YjJ4c1ZHOXdJRDBnWkc5amRXMWxiblF1Wkc5amRXMWxiblJGYkdWdFpXNTBMbk5qY205c2JGUnZjQ0E5SURBN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnZEdocGN5NXdjbTl3Y3k1a2FYTndZWFJqYUNoN1hHNGdJQ0FnSUNCMGVYQmxPaUFuVkU5UVNVTmZVRWxEUzBWRUp5eGNiaUFnSUNBZ0lIWmhiSFZsT2lCMGFHbHpMbkJ5YjNCekxtTm9hV3hrY21WdUxGeHVJQ0FnSUgwcE8xeHVJQ0I5TzF4dVhHNGdJSEpsYm1SbGNpZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z0tGeHVJQ0FnSUNBZ1BITndZVzRnWTJ4aGMzTk9ZVzFsUFZ3aWFYUmxiVndpSUc5dVEyeHBZMnM5ZTNSb2FYTXVYMmhoYm1Sc1pVTm9iMjl6WlZSdmNHbGpmVDVjYmlBZ0lDQWdJQ0FnUEhOMGVXeGxJR3B6ZUQ1N1lGeHVJQ0FnSUNBZ0lDQWdJQzVwZEdWdElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUdScGMzQnNZWGs2SUdsdWJHbHVaUzFpYkc5amF6dGNiaUFnSUNBZ0lDQWdJQ0FnSUcxaGNtZHBiaTF5YVdkb2REb2dPSEI0TzF4dUlDQWdJQ0FnSUNBZ0lDQWdkR1Y0ZEMxa1pXTnZjbUYwYVc5dU9pQjFibVJsY214cGJtVTdYRzRnSUNBZ0lDQWdJQ0FnSUNCMGNtRnVjMmwwYVc5dU9pQmhiR3dnTWpBd2JYTWdaV0Z6WlR0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFJ5WVc1emFYUnBiMjR0Y0hKdmNHVnlkSGs2SUc5d1lXTnBkSGtzSUhSeVlXNXpabTl5YlR0Y2JpQWdJQ0FnSUNBZ0lDQWdJR04xY25OdmNqb2djRzlwYm5SbGNqdGNiaUFnSUNBZ0lDQWdJQ0FnSUc5MlpYSm1iRzkzTFhkeVlYQTZJR0p5WldGckxYZHZjbVE3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjNiM0prTFdKeVpXRnJPaUJpY21WaGF5MTNiM0prTzF4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0FtT21odmRtVnlJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdiM0JoWTJsMGVUb2dNQzQxTzF4dUlDQWdJQ0FnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQW1PbUZqZEdsMlpTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lIUnlZVzV6Wm05eWJUb2djMk5oYkdVb01TNHlLVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ0lDQXVhWFJsYlMxamIzVnVkQ0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQm1iMjUwTFdaaGJXbHNlVG9nSjI5bVptbGpaUzFqYjJSbExXMWxaR2wxYlNjc0lHMXZibTl6Y0dGalpUdGNiaUFnSUNBZ0lDQWdJQ0FnSUdOdmJHOXlPaUJ5WjJKaEtEWTFMQ0F4TmpBc0lESTBPQ3dnTVNrN1hHNGdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0JnZlR3dmMzUjViR1UrWEc0Z0lDQWdJQ0FnSUh0MGFHbHpMbkJ5YjNCekxtTm9hV3hrY21WdWZWeHVJQ0FnSUNBZ0lDQmJYRzRnSUNBZ0lDQWdJRHh6Y0dGdUlHTnNZWE56VG1GdFpUMWNJbWwwWlcwdFkyOTFiblJjSWo1N2RHaHBjeTV3Y205d2N5NWpiM1Z1ZEgwOEwzTndZVzQrWEc0Z0lDQWdJQ0FnSUYxY2JpQWdJQ0FnSUR3dmMzQmhiajVjYmlBZ0lDQXBPMXh1SUNCOVhHNTlYRzVjYm1WNGNHOXlkQ0JrWldaaGRXeDBJR052Ym01bFkzUW9jM1JoZEdVZ1BUNGdlMXh1SUNCeVpYUjFjbTRnZTMwN1hHNTlLU2hVYjNCcFkwbDBaVzBwTzF4dUlsMTkgKi9cbi8qQCBzb3VyY2VVUkw9Y29tcG9uZW50cy9Ub3BpY0l0ZW0uanMgKi8iXX0= */'
      }), this.props.children, '[', _react2.default.createElement('span', { className: 'item-count', 'data-jsx': 3413578913,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 46
        }
      }, this.props.count), ']');
    }
  }]);

  return TopicItem;
}(_react2.default.PureComponent);

exports.default = (0, _reactRedux.connect)(function (state) {
  return {};
})(TopicItem);
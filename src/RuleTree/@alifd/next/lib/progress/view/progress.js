'use strict';

exports.__esModule = true;
exports.default = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _progressLine = require('./progress-line');

var _progressLine2 = _interopRequireDefault(_progressLine);

var _progressCircle = require('./progress-circle');

var _progressCircle2 = _interopRequireDefault(_progressCircle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Progress
 */
var Progress = (_temp = _class = function (_Component) {
  (0, _inherits3.default)(Progress, _Component);

  function Progress() {
    (0, _classCallCheck3.default)(this, Progress);
    return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
  }

  Progress.prototype.render = function render() {
    var _props = this.props,
        shape = _props.shape,
        hasBorder = _props.hasBorder,
        others = (0, _objectWithoutProperties3.default)(_props, ['shape', 'hasBorder']);

    return shape === 'circle' ? _react2.default.createElement(_progressCircle2.default, others) : _react2.default.createElement(_progressLine2.default, (0, _extends3.default)({}, others, { hasBorder: hasBorder }));
  };

  return Progress;
}(_react.Component), _class.propTypes = {
  prefix: _propTypes2.default.string,
  /**
   * ??????
   */
  shape: _propTypes2.default.oneOf(['circle', 'line']),
  /**
   * ??????
   */
  size: _propTypes2.default.oneOf(['small', 'medium', 'large']),
  /**
   * ???????????????
   */
  percent: _propTypes2.default.number,
  /**
   * ????????????, ???????????????: color > progressive > state
   */
  state: _propTypes2.default.oneOf(['normal', 'success', 'error']),
  /**
   * ?????????????????????????????????, ???????????????: color > progressive > state
   */
  progressive: _propTypes2.default.bool,
  /**
   * ???????????? Border??????????????? Line Progress)
   */
  hasBorder: _propTypes2.default.bool,
  /**
   * ??????????????????
   * @param {Number} percent ?????????????????????
   * @param {Object} option ???????????????
   * @property {Boolean} option.rtl ?????????rtl ???????????????
   * @return {ReactNode} ??????????????????
   */
  textRender: _propTypes2.default.func,
  /**
   * ???????????????, ???????????????: color > progressive > state
   */
  color: _propTypes2.default.string,
  /**
   * ?????????
   */
  backgroundColor: _propTypes2.default.string,
  rtl: _propTypes2.default.bool
}, _class.defaultProps = {
  prefix: 'next-',
  shape: 'line',
  state: 'normal',
  size: 'medium',
  percent: 0,
  progressive: false,
  hasBorder: false,
  textRender: function textRender(percent) {
    return Math.floor(percent) + '%';
  }
}, _class.contextTypes = {
  prefix: _propTypes2.default.string
}, _temp);
Progress.displayName = 'Progress';
exports.default = Progress;
module.exports = exports['default'];
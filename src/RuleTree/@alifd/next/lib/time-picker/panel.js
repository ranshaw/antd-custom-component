'use strict';

exports.__esModule = true;

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

var _class, _temp2;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _zhCn = require('../locale/zh-cn');

var _zhCn2 = _interopRequireDefault(_zhCn);

var _util = require('../util');

var _timeMenu = require('./module/time-menu');

var _timeMenu2 = _interopRequireDefault(_timeMenu);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var noop = _util.func.noop;
var TimePickerPanel = (_temp2 = _class = function (_Component) {
    (0, _inherits3.default)(TimePickerPanel, _Component);

    function TimePickerPanel() {
        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, TimePickerPanel);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.onSelectMenuItem = function (index, type) {
            var value = _this.props.value;

            var clonedValue = value ? value.clone() : (0, _moment2.default)('00:00:00', 'HH:mm:ss', true);
            switch (type) {
                case 'hour':
                    clonedValue.hour(index);
                    break;
                case 'minute':
                    clonedValue.minute(index);
                    break;
                case 'second':
                    clonedValue.second(index);
                    break;
            }
            _this.props.onSelect(clonedValue);
        }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
    }

    TimePickerPanel.prototype.render = function render() {
        var _props = this.props,
            prefix = _props.prefix,
            value = _props.value,
            locale = _props.locale,
            className = _props.className,
            disabled = _props.disabled,
            showHour = _props.showHour,
            showMinute = _props.showMinute,
            showSecond = _props.showSecond,
            hourStep = _props.hourStep,
            minuteStep = _props.minuteStep,
            secondStep = _props.secondStep,
            disabledHours = _props.disabledHours,
            disabledMinutes = _props.disabledMinutes,
            disabledSeconds = _props.disabledSeconds,
            renderTimeMenuItems = _props.renderTimeMenuItems,
            others = (0, _objectWithoutProperties3.default)(_props, ['prefix', 'value', 'locale', 'className', 'disabled', 'showHour', 'showMinute', 'showSecond', 'hourStep', 'minuteStep', 'secondStep', 'disabledHours', 'disabledMinutes', 'disabledSeconds', 'renderTimeMenuItems']);


        var colLen = [showHour, showMinute, showSecond].filter(function (v) {
            return v;
        }).length;
        var classNames = (0, _classnames2.default)(prefix + 'time-picker-panel', prefix + 'time-picker-panel-col-' + colLen, className);

        var commonProps = {
            prefix: prefix,
            disabled: disabled,
            onSelect: this.onSelectMenuItem,
            renderTimeMenuItems: renderTimeMenuItems,
            value: value
        };

        var activeHour = void 0;
        var activeMinute = void 0;
        var activeSecond = void 0;

        if (value && _moment2.default.isMoment(value)) {
            activeHour = value.hour();
            activeMinute = value.minute();
            activeSecond = value.second();
        }

        return _react2.default.createElement(
            'div',
            (0, _extends3.default)({}, others, { className: classNames }),
            showHour ? _react2.default.createElement(_timeMenu2.default, (0, _extends3.default)({}, commonProps, {
                activeIndex: activeHour,
                title: locale.hour,
                mode: 'hour',
                step: hourStep,
                disabledItems: disabledHours
            })) : null,
            showMinute ? _react2.default.createElement(_timeMenu2.default, (0, _extends3.default)({}, commonProps, {
                activeIndex: activeMinute,
                title: locale.minute,
                mode: 'minute',
                step: minuteStep,
                disabledItems: disabledMinutes
            })) : null,
            showSecond ? _react2.default.createElement(_timeMenu2.default, (0, _extends3.default)({}, commonProps, {
                activeIndex: activeSecond,
                title: locale.second,
                step: secondStep,
                mode: 'second',
                disabledItems: disabledSeconds
            })) : null
        );
    };

    return TimePickerPanel;
}(_react.Component), _class.propTypes = {
    prefix: _propTypes2.default.string,
    /**
     * ????????????moment ?????????
     */
    value: _utils.checkMomentObj,
    /**
     * ??????????????????
     */
    showHour: _propTypes2.default.bool,
    /**
     * ??????????????????
     */
    showMinute: _propTypes2.default.bool,
    /**
     * ???????????????
     */
    showSecond: _propTypes2.default.bool,
    /**
     * ??????????????????
     */
    hourStep: _propTypes2.default.number,
    /**
     * ??????????????????
     */
    minuteStep: _propTypes2.default.number,
    /**
     * ??????????????????
     */
    secondStep: _propTypes2.default.number,
    /**
     * ??????????????????
     * @param {Number} index ??? 0 - 23
     * @return {Boolean} ????????????
     */
    disabledHours: _propTypes2.default.func,
    /**
     * ??????????????????
     * @param {Number} index ??? 0 - 59
     * @return {Boolean} ????????????
     */
    disabledMinutes: _propTypes2.default.func,
    /**
     * ???????????????
     * @param {Number} index ??? 0 - 59
     * @return {Boolean} ????????????
     */
    disabledSeconds: _propTypes2.default.func,
    /**
     * ??????????????????????????????
     * [{
     *  label: '01',
     *  value: 1
     * }]
     * @param {Array} list ?????????????????????
     * @param {String} mode ??????????????? hour, minute, second
     * @param {moment} value ???????????????????????? null
     * @return {Array} ???????????????????????????
     */
    renderTimeMenuItems: _propTypes2.default.func,
    /**
     * ?????????????????????????????????
     * @param {Object} ?????????????????????
     */
    onSelect: _propTypes2.default.func,
    locale: _propTypes2.default.object,
    disabled: _propTypes2.default.bool,
    className: _propTypes2.default.string
}, _class.defaultProps = {
    prefix: 'next-',
    showHour: true,
    showSecond: true,
    showMinute: true,
    disabledHours: noop,
    disabledMinutes: noop,
    disabledSeconds: noop,
    onSelect: noop,
    disabled: false,
    locale: _zhCn2.default.TimePicker
}, _temp2);
TimePickerPanel.displayName = 'TimePickerPanel';
exports.default = TimePickerPanel;
module.exports = exports['default'];
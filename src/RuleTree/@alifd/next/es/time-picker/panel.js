import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp2;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import moment from 'moment';
import nextLocale from '../locale/zh-cn';
import { func } from '../util';
import TimeMenu from './module/time-menu';
import { checkMomentObj } from './utils';

var noop = func.noop;
var TimePickerPanel = (_temp2 = _class = function (_Component) {
    _inherits(TimePickerPanel, _Component);

    function TimePickerPanel() {
        var _temp, _this, _ret;

        _classCallCheck(this, TimePickerPanel);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.onSelectMenuItem = function (index, type) {
            var value = _this.props.value;

            var clonedValue = value ? value.clone() : moment('00:00:00', 'HH:mm:ss', true);
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
        }, _temp), _possibleConstructorReturn(_this, _ret);
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
            others = _objectWithoutProperties(_props, ['prefix', 'value', 'locale', 'className', 'disabled', 'showHour', 'showMinute', 'showSecond', 'hourStep', 'minuteStep', 'secondStep', 'disabledHours', 'disabledMinutes', 'disabledSeconds', 'renderTimeMenuItems']);

        var colLen = [showHour, showMinute, showSecond].filter(function (v) {
            return v;
        }).length;
        var classNames = classnames(prefix + 'time-picker-panel', prefix + 'time-picker-panel-col-' + colLen, className);

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

        if (value && moment.isMoment(value)) {
            activeHour = value.hour();
            activeMinute = value.minute();
            activeSecond = value.second();
        }

        return React.createElement(
            'div',
            _extends({}, others, { className: classNames }),
            showHour ? React.createElement(TimeMenu, _extends({}, commonProps, {
                activeIndex: activeHour,
                title: locale.hour,
                mode: 'hour',
                step: hourStep,
                disabledItems: disabledHours
            })) : null,
            showMinute ? React.createElement(TimeMenu, _extends({}, commonProps, {
                activeIndex: activeMinute,
                title: locale.minute,
                mode: 'minute',
                step: minuteStep,
                disabledItems: disabledMinutes
            })) : null,
            showSecond ? React.createElement(TimeMenu, _extends({}, commonProps, {
                activeIndex: activeSecond,
                title: locale.second,
                step: secondStep,
                mode: 'second',
                disabledItems: disabledSeconds
            })) : null
        );
    };

    return TimePickerPanel;
}(Component), _class.propTypes = {
    prefix: PropTypes.string,
    /**
     * ????????????moment ?????????
     */
    value: checkMomentObj,
    /**
     * ??????????????????
     */
    showHour: PropTypes.bool,
    /**
     * ??????????????????
     */
    showMinute: PropTypes.bool,
    /**
     * ???????????????
     */
    showSecond: PropTypes.bool,
    /**
     * ??????????????????
     */
    hourStep: PropTypes.number,
    /**
     * ??????????????????
     */
    minuteStep: PropTypes.number,
    /**
     * ??????????????????
     */
    secondStep: PropTypes.number,
    /**
     * ??????????????????
     * @param {Number} index ??? 0 - 23
     * @return {Boolean} ????????????
     */
    disabledHours: PropTypes.func,
    /**
     * ??????????????????
     * @param {Number} index ??? 0 - 59
     * @return {Boolean} ????????????
     */
    disabledMinutes: PropTypes.func,
    /**
     * ???????????????
     * @param {Number} index ??? 0 - 59
     * @return {Boolean} ????????????
     */
    disabledSeconds: PropTypes.func,
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
    renderTimeMenuItems: PropTypes.func,
    /**
     * ?????????????????????????????????
     * @param {Object} ?????????????????????
     */
    onSelect: PropTypes.func,
    locale: PropTypes.object,
    disabled: PropTypes.bool,
    className: PropTypes.string
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
    locale: nextLocale.TimePicker
}, _temp2);
TimePickerPanel.displayName = 'TimePickerPanel';


export default TimePickerPanel;
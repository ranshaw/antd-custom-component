import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp, _initialiseProps;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';
import classnames from 'classnames';
import moment from 'moment';
import ConfigProvider from '../config-provider';
import Input from '../input';
import Icon from '../icon';
import Overlay from '../overlay';
import nextLocale from '../locale/zh-cn';
import { func, obj } from '../util';
import TimePickerPanel from './panel';
import { checkDateValue, formatDateValue } from './utils';
import { onTimeKeydown } from '../date-picker/util';

var Popup = Overlay.Popup;
var noop = func.noop;

var timePickerLocale = nextLocale.TimePicker;

/**
 * TimePicker
 */
var TimePicker = (_temp = _class = function (_Component) {
    _inherits(TimePicker, _Component);

    function TimePicker(props, context) {
        _classCallCheck(this, TimePicker);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

        _initialiseProps.call(_this);

        var value = formatDateValue(props.value || props.defaultValue, props.format);
        _this.inputAsString = typeof (props.value || props.defaultValue) === 'string';
        _this.state = {
            value: value,
            inputStr: '',
            inputing: false,
            visible: props.visible || props.defaultVisible
        };
        return _this;
    }

    TimePicker.getDerivedStateFromProps = function getDerivedStateFromProps(props) {
        var state = {};

        if ('value' in props) {
            state.value = formatDateValue(props.value, props.format);
        }

        if ('visible' in props) {
            state.visible = props.visible;
        }

        return state;
    };

    TimePicker.prototype.onValueChange = function onValueChange(newValue) {
        var ret = this.inputAsString && newValue ? newValue.format(this.props.format) : newValue;
        this.props.onChange(ret);
    };

    TimePicker.prototype.renderPreview = function renderPreview(others) {
        var _props = this.props,
            prefix = _props.prefix,
            format = _props.format,
            className = _props.className,
            renderPreview = _props.renderPreview;
        var value = this.state.value;

        var previewCls = classnames(className, prefix + 'form-preview');

        var label = value ? value.format(format) : '';

        if (typeof renderPreview === 'function') {
            return React.createElement(
                'div',
                _extends({}, others, { className: previewCls }),
                renderPreview(value, this.props)
            );
        }

        return React.createElement(
            'p',
            _extends({}, others, { className: previewCls }),
            label
        );
    };

    TimePicker.prototype.render = function render() {
        var _classnames, _classnames2;

        var _props2 = this.props,
            prefix = _props2.prefix,
            label = _props2.label,
            state = _props2.state,
            placeholder = _props2.placeholder,
            size = _props2.size,
            format = _props2.format,
            hasClear = _props2.hasClear,
            hourStep = _props2.hourStep,
            minuteStep = _props2.minuteStep,
            secondStep = _props2.secondStep,
            disabledHours = _props2.disabledHours,
            disabledMinutes = _props2.disabledMinutes,
            disabledSeconds = _props2.disabledSeconds,
            renderTimeMenuItems = _props2.renderTimeMenuItems,
            inputProps = _props2.inputProps,
            popupAlign = _props2.popupAlign,
            popupTriggerType = _props2.popupTriggerType,
            popupContainer = _props2.popupContainer,
            popupStyle = _props2.popupStyle,
            popupClassName = _props2.popupClassName,
            popupProps = _props2.popupProps,
            popupComponent = _props2.popupComponent,
            popupContent = _props2.popupContent,
            followTrigger = _props2.followTrigger,
            disabled = _props2.disabled,
            className = _props2.className,
            locale = _props2.locale,
            rtl = _props2.rtl,
            isPreview = _props2.isPreview,
            others = _objectWithoutProperties(_props2, ['prefix', 'label', 'state', 'placeholder', 'size', 'format', 'hasClear', 'hourStep', 'minuteStep', 'secondStep', 'disabledHours', 'disabledMinutes', 'disabledSeconds', 'renderTimeMenuItems', 'inputProps', 'popupAlign', 'popupTriggerType', 'popupContainer', 'popupStyle', 'popupClassName', 'popupProps', 'popupComponent', 'popupContent', 'followTrigger', 'disabled', 'className', 'locale', 'rtl', 'isPreview']);

        var _state = this.state,
            value = _state.value,
            inputStr = _state.inputStr,
            inputing = _state.inputing,
            visible = _state.visible;


        var triggerCls = classnames((_classnames = {}, _classnames[prefix + 'time-picker-trigger'] = true, _classnames));

        if (rtl) {
            others.dir = 'rtl';
        }

        if (isPreview) {
            return this.renderPreview(obj.pickOthers(others, TimePicker.PropTypes));
        }

        var inputValue = inputing ? inputStr : value && value.format(format) || '';
        var sharedInputProps = _extends({}, inputProps, {
            size: size,
            disabled: disabled,
            value: inputValue,
            hasClear: value && hasClear,
            onChange: this.onInputChange,
            onBlur: this.onInputBlur,
            onPressEnter: this.onInputBlur,
            onKeyDown: this.onKeyown,
            hint: React.createElement(Icon, {
                type: 'clock',
                className: prefix + 'time-picker-symbol-clock-icon'
            })
        });

        var triggerInput = React.createElement(
            'div',
            { className: triggerCls },
            React.createElement(Input, _extends({}, sharedInputProps, {
                label: label,
                state: state,
                placeholder: placeholder || locale.placeholder,
                className: prefix + 'time-picker-input'
            }))
        );

        var panelProps = {
            prefix: prefix,
            locale: locale,
            value: value,
            disabled: disabled,
            showHour: format.indexOf('H') > -1,
            showSecond: format.indexOf('s') > -1,
            showMinute: format.indexOf('m') > -1,
            hourStep: hourStep,
            minuteStep: minuteStep,
            secondStep: secondStep,
            disabledHours: disabledHours,
            disabledMinutes: disabledMinutes,
            disabledSeconds: disabledSeconds,
            renderTimeMenuItems: renderTimeMenuItems,
            onSelect: this.onTimePanelSelect
        };

        var classNames = classnames((_classnames2 = {}, _classnames2[prefix + 'time-picker'] = true, _classnames2[prefix + 'time-picker-' + size] = size, _classnames2[prefix + 'disabled'] = disabled, _classnames2), className);

        var PopupComponent = popupComponent ? popupComponent : Popup;

        return React.createElement(
            'div',
            _extends({}, obj.pickOthers(TimePicker.propTypes, others), {
                className: classNames
            }),
            React.createElement(
                PopupComponent,
                _extends({
                    autoFocus: true,
                    align: popupAlign
                }, popupProps, {
                    followTrigger: followTrigger,
                    visible: visible,
                    onVisibleChange: this.onVisibleChange,
                    trigger: triggerInput,
                    container: popupContainer,
                    disabled: disabled,
                    triggerType: popupTriggerType,
                    style: popupStyle,
                    className: popupClassName
                }),
                popupContent ? popupContent : React.createElement(
                    'div',
                    {
                        dir: others.dir,
                        className: prefix + 'time-picker-body'
                    },
                    React.createElement(
                        'div',
                        {
                            className: prefix + 'time-picker-panel-header'
                        },
                        React.createElement(Input, _extends({}, sharedInputProps, {
                            placeholder: format,
                            className: prefix + 'time-picker-panel-input'
                        }))
                    ),
                    React.createElement(TimePickerPanel, panelProps)
                )
            )
        );
    };

    return TimePicker;
}(Component), _class.propTypes = _extends({}, ConfigProvider.propTypes, {
    prefix: PropTypes.string,
    rtl: PropTypes.bool,
    /**
     * ???????????????
     */
    label: PropTypes.node,
    /**
     * ???????????????
     */
    state: PropTypes.oneOf(['error', 'success']),
    /**
     * ???????????????
     */
    placeholder: PropTypes.string,
    /**
     * ????????????moment ????????????????????????????????????????????????
     */
    value: checkDateValue,
    /**
     * ???????????????moment ???????????????????????????????????????????????????
     */
    defaultValue: checkDateValue,
    /**
     * ????????????????????????
     */
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    /**
     * ????????????????????????
     */
    hasClear: PropTypes.bool,
    /**
     * ???????????????
     * https://momentjs.com/docs/#/parsing/string-format/
     */
    format: PropTypes.string,
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
     * ??????????????????
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
     * ??????????????????????????????
     */
    visible: PropTypes.bool,
    /**
     * ???????????????????????????????????????
     */
    defaultVisible: PropTypes.bool,
    /**
     * ????????????
     * @param {Object} target ????????????
     * @return {ReactNode} ????????????
     */
    popupContainer: PropTypes.any,
    /**
     * ??????????????????, ?????????Overlay ??????
     */
    popupAlign: PropTypes.string,
    /**
     * ??????????????????
     */
    popupTriggerType: PropTypes.oneOf(['click', 'hover']),
    /**
     * ????????????????????????????????????
     * @param {Boolean} visible ???????????????????????????
     * @param {String} type ???????????????????????????????????? fromTrigger ?????????trigger?????????????????? docClick ?????????document???????????????
     */
    onVisibleChange: PropTypes.func,
    /**
     * ?????????????????????
     */
    popupStyle: PropTypes.object,
    /**
     * ????????????????????????
     */
    popupClassName: PropTypes.string,
    /**
     * ????????????
     */
    popupProps: PropTypes.object,
    /**
     * ??????????????????
     */
    followTrigger: PropTypes.bool,
    /**
     * ????????????
     */
    disabled: PropTypes.bool,
    /**
     * ??????????????????
     */
    isPreview: PropTypes.bool,
    /**
     * ?????????????????????????????????
     * @param {MomentObject} value ??????
     */
    renderPreview: PropTypes.func,
    /**
     * ???????????????????????????
     * @param {Object|String} value ??????????????????????????????
     */
    onChange: PropTypes.func,
    className: PropTypes.string,
    name: PropTypes.string,
    inputProps: PropTypes.object,
    popupComponent: PropTypes.elementType,
    popupContent: PropTypes.node
}), _class.defaultProps = {
    prefix: 'next-',
    rtl: false,
    locale: timePickerLocale,
    size: 'medium',
    format: 'HH:mm:ss',
    hasClear: true,
    disabled: false,
    popupAlign: 'tl tl',
    popupTriggerType: 'click',
    onChange: noop,
    onVisibleChange: noop
}, _initialiseProps = function _initialiseProps() {
    var _this2 = this;

    this.onClearValue = function () {
        _this2.setState({
            value: null
        });
        if (_this2.state.value) {
            _this2.onValueChange(null);
        }
    };

    this.onInputChange = function (inputValue, e, eventType) {
        if (!('value' in _this2.props)) {
            if (eventType === 'clear' || !inputValue) {
                e.stopPropagation();
                _this2.onClearValue();
            }

            _this2.setState({
                inputStr: inputValue,
                inputing: true
            });
        } else if (eventType === 'clear') {
            // ??????????????????????????? clear
            e.stopPropagation();
            _this2.onValueChange(null);
        }
    };

    this.onInputBlur = function () {
        var inputStr = _this2.state.inputStr;

        if (inputStr) {
            var format = _this2.props.format;

            var parsed = moment(inputStr, format, true);
            if (parsed.isValid()) {
                _this2.setState({
                    value: parsed,
                    inputStr: ''
                });
                _this2.onValueChange(parsed);
            }
            _this2.setState({
                inputing: false
            });
        }
    };

    this.onKeyown = function (e) {
        var _state2 = _this2.state,
            value = _state2.value,
            inputStr = _state2.inputStr;
        var _props3 = _this2.props,
            format = _props3.format,
            _props3$hourStep = _props3.hourStep,
            hourStep = _props3$hourStep === undefined ? 1 : _props3$hourStep,
            _props3$minuteStep = _props3.minuteStep,
            minuteStep = _props3$minuteStep === undefined ? 1 : _props3$minuteStep,
            _props3$secondStep = _props3.secondStep,
            secondStep = _props3$secondStep === undefined ? 1 : _props3$secondStep,
            disabledMinutes = _props3.disabledMinutes,
            disabledSeconds = _props3.disabledSeconds;


        var unit = 'second';

        if (disabledSeconds) {
            unit = disabledMinutes ? 'hour' : 'minute';
        }
        var timeStr = onTimeKeydown(e, {
            format: format,
            timeInputStr: inputStr,
            steps: {
                hour: hourStep,
                minute: minuteStep,
                second: secondStep
            },
            value: value
        }, unit);

        if (!timeStr) return;

        _this2.onInputChange(timeStr);
    };

    this.onTimePanelSelect = function (value) {
        if (!('value' in _this2.props)) {
            _this2.setState({
                value: value,
                inputing: false
            });
        }
        if (!_this2.state.value || value.valueOf() !== _this2.state.value.valueOf()) {
            _this2.onValueChange(value);
        }
    };

    this.onVisibleChange = function (visible, type) {
        if (!('visible' in _this2.props)) {
            _this2.setState({
                visible: visible
            });
        }
        _this2.props.onVisibleChange(visible, type);
    };
}, _temp);
TimePicker.displayName = 'TimePicker';


export default polyfill(TimePicker);
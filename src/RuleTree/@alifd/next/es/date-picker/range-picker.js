import _typeof from 'babel-runtime/helpers/typeof';
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
import Overlay from '../overlay';
import Input from '../input';
import Icon from '../icon';
import Calendar from '../calendar';
import RangeCalendar from '../calendar/range-calendar';
import TimePickerPanel from '../time-picker/panel';
import nextLocale from '../locale/zh-cn';
import { func, obj } from '../util';
import { PANEL, resetValueTime, formatDateValue, getDateTimeFormat, isFunction, onDateKeydown, onTimeKeydown } from './util';
import PanelFooter from './module/panel-footer';

var Popup = Overlay.Popup;


function mapInputStateName(name) {
    return {
        startValue: 'startDateInputStr',
        endValue: 'endDateInputStr',
        startTime: 'startTimeInputStr',
        endTime: 'endTimeInputStr'
    }[name];
}

function mapTimeToValue(name) {
    return {
        startTime: 'startValue',
        endTime: 'endValue'
    }[name];
}

function getFormatValues(values, format) {
    if (!Array.isArray(values)) {
        return [null, null];
    }
    return [formatDateValue(values[0], format), formatDateValue(values[1], format)];
}

/**
 * DatePicker.RangePicker
 */
var RangePicker = (_temp = _class = function (_Component) {
    _inherits(RangePicker, _Component);

    function RangePicker(props, context) {
        _classCallCheck(this, RangePicker);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

        _initialiseProps.call(_this);

        var _getDateTimeFormat = getDateTimeFormat(props.format, props.showTime, props.type),
            format = _getDateTimeFormat.format,
            timeFormat = _getDateTimeFormat.timeFormat,
            dateTimeFormat = _getDateTimeFormat.dateTimeFormat;

        var val = props.value || props.defaultValue;
        var values = getFormatValues(val, dateTimeFormat);

        _this.state = {
            visible: props.visible || props.defaultVisible,
            startValue: values[0],
            endValue: values[1],
            startDateInputStr: '',
            endDateInputStr: '',
            activeDateInput: 'startValue',
            startTimeInputStr: '',
            endTimeInputStr: '',
            inputing: false, // ??????????????????????????????
            panel: PANEL.DATE,
            format: format,
            timeFormat: timeFormat,
            dateTimeFormat: dateTimeFormat,
            inputAsString: val && (typeof val[0] === 'string' || typeof val[1] === 'string')
        };
        return _this;
    }

    RangePicker.getDerivedStateFromProps = function getDerivedStateFromProps(props) {
        var formatStates = getDateTimeFormat(props.format, props.showTime, props.type);
        var states = {};

        if ('value' in props) {
            var values = getFormatValues(props.value, formatStates.dateTimeFormat);
            states.startValue = values[0];
            states.endValue = values[1];
            states.inputAsString = props.value && (typeof props.value[0] === 'string' || typeof props.value[1] === 'string');
        }

        if ('visible' in props) {
            states.visible = props.visible;
        }

        return _extends({}, states, formatStates);
    };

    // ????????????????????????????????????????????????????????????????????????


    RangePicker.prototype.renderPreview = function renderPreview(_ref, others) {
        var startValue = _ref[0],
            endValue = _ref[1];
        var _props = this.props,
            prefix = _props.prefix,
            className = _props.className,
            renderPreview = _props.renderPreview;
        var dateTimeFormat = this.state.dateTimeFormat;


        var previewCls = classnames(className, prefix + 'form-preview');
        var startLabel = startValue ? startValue.format(dateTimeFormat) : '';
        var endLabel = endValue ? endValue.format(dateTimeFormat) : '';

        if (typeof renderPreview === 'function') {
            return React.createElement(
                'div',
                _extends({}, others, { className: previewCls }),
                renderPreview([startValue, endValue], this.props)
            );
        }

        return React.createElement(
            'p',
            _extends({}, others, { className: previewCls }),
            startLabel,
            ' - ',
            endLabel
        );
    };

    RangePicker.prototype.render = function render() {
        var _classnames,
            _classnames2,
            _classnames3,
            _classnames4,
            _classnames5,
            _this2 = this,
            _PANEL$DATE$PANEL$TIM;

        var _props2 = this.props,
            prefix = _props2.prefix,
            rtl = _props2.rtl,
            type = _props2.type,
            defaultVisibleMonth = _props2.defaultVisibleMonth,
            onVisibleMonthChange = _props2.onVisibleMonthChange,
            showTime = _props2.showTime,
            _disabledDate = _props2.disabledDate,
            footerRender = _props2.footerRender,
            label = _props2.label,
            _props2$ranges = _props2.ranges,
            ranges = _props2$ranges === undefined ? {} : _props2$ranges,
            inputState = _props2.state,
            size = _props2.size,
            disabled = _props2.disabled,
            hasClear = _props2.hasClear,
            popupTriggerType = _props2.popupTriggerType,
            popupAlign = _props2.popupAlign,
            popupContainer = _props2.popupContainer,
            popupStyle = _props2.popupStyle,
            popupClassName = _props2.popupClassName,
            popupProps = _props2.popupProps,
            popupComponent = _props2.popupComponent,
            popupContent = _props2.popupContent,
            followTrigger = _props2.followTrigger,
            className = _props2.className,
            locale = _props2.locale,
            inputProps = _props2.inputProps,
            dateCellRender = _props2.dateCellRender,
            monthCellRender = _props2.monthCellRender,
            yearCellRender = _props2.yearCellRender,
            startDateInputAriaLabel = _props2.startDateInputAriaLabel,
            startTimeInputAriaLabel = _props2.startTimeInputAriaLabel,
            endDateInputAriaLabel = _props2.endDateInputAriaLabel,
            endTimeInputAriaLabel = _props2.endTimeInputAriaLabel,
            isPreview = _props2.isPreview,
            disableChangeMode = _props2.disableChangeMode,
            yearRange = _props2.yearRange,
            placeholder = _props2.placeholder,
            others = _objectWithoutProperties(_props2, ['prefix', 'rtl', 'type', 'defaultVisibleMonth', 'onVisibleMonthChange', 'showTime', 'disabledDate', 'footerRender', 'label', 'ranges', 'state', 'size', 'disabled', 'hasClear', 'popupTriggerType', 'popupAlign', 'popupContainer', 'popupStyle', 'popupClassName', 'popupProps', 'popupComponent', 'popupContent', 'followTrigger', 'className', 'locale', 'inputProps', 'dateCellRender', 'monthCellRender', 'yearCellRender', 'startDateInputAriaLabel', 'startTimeInputAriaLabel', 'endDateInputAriaLabel', 'endTimeInputAriaLabel', 'isPreview', 'disableChangeMode', 'yearRange', 'placeholder']);

        var state = this.state;

        var classNames = classnames((_classnames = {}, _classnames[prefix + 'range-picker'] = true, _classnames['' + prefix + size] = size, _classnames[prefix + 'disabled'] = disabled, _classnames), className);

        var panelBodyClassName = classnames((_classnames2 = {}, _classnames2[prefix + 'range-picker-body'] = true, _classnames2[prefix + 'range-picker-body-show-time'] = showTime, _classnames2));

        var triggerCls = classnames((_classnames3 = {}, _classnames3[prefix + 'range-picker-trigger'] = true, _classnames3[prefix + 'error'] = inputState === 'error', _classnames3));

        var startDateInputCls = classnames((_classnames4 = {}, _classnames4[prefix + 'range-picker-panel-input-start-date'] = true, _classnames4[prefix + 'focus'] = state.activeDateInput === 'startValue', _classnames4));

        var endDateInputCls = classnames((_classnames5 = {}, _classnames5[prefix + 'range-picker-panel-input-end-date'] = true, _classnames5[prefix + 'focus'] = state.activeDateInput === 'endValue', _classnames5));

        if (rtl) {
            others.dir = 'rtl';
        }

        if (isPreview) {
            return this.renderPreview([state.startValue, state.endValue], obj.pickOthers(others, RangePicker.PropTypes));
        }

        var startDateInputValue = state.inputing === 'startValue' ? state.startDateInputStr : state.startValue && state.startValue.format(state.format) || '';
        var endDateInputValue = state.inputing === 'endValue' ? state.endDateInputStr : state.endValue && state.endValue.format(state.format) || '';

        var startTriggerValue = startDateInputValue;
        var endTriggerValue = endDateInputValue;

        var sharedInputProps = _extends({}, inputProps, {
            size: size,
            disabled: disabled,
            onChange: this.onDateInputChange,
            onBlur: this.onDateInputBlur,
            onPressEnter: this.onDateInputBlur,
            onKeyDown: this.onDateInputKeyDown
        });

        var startDateInput = React.createElement(Input, _extends({}, sharedInputProps, {
            'aria-label': startDateInputAriaLabel,
            placeholder: state.format,
            value: startDateInputValue,
            onFocus: function onFocus() {
                return _this2.onFocusDateInput('startValue');
            },
            className: startDateInputCls
        }));

        var endDateInput = React.createElement(Input, _extends({}, sharedInputProps, {
            'aria-label': endDateInputAriaLabel,
            placeholder: state.format,
            value: endDateInputValue,
            onFocus: function onFocus() {
                return _this2.onFocusDateInput('endValue');
            },
            className: endDateInputCls
        }));

        var shareCalendarProps = {
            showOtherMonth: true,
            dateCellRender: dateCellRender,
            monthCellRender: monthCellRender,
            yearCellRender: yearCellRender,
            format: state.format,
            defaultVisibleMonth: defaultVisibleMonth,
            onVisibleMonthChange: onVisibleMonthChange
        };

        var datePanel = type === 'date' ? React.createElement(RangeCalendar, _extends({}, shareCalendarProps, {
            yearRange: yearRange,
            disableChangeMode: disableChangeMode,
            disabledDate: _disabledDate,
            onSelect: this.onSelectCalendarPanel,
            startValue: state.startValue,
            endValue: state.endValue
        })) : React.createElement(
            'div',
            { className: prefix + 'range-picker-panel-body' },
            React.createElement(Calendar, _extends({
                shape: 'panel',
                modes: type === 'month' ? ['month', 'year'] : ['year']
            }, _extends({}, shareCalendarProps), {
                disabledDate: function disabledDate(date) {
                    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                        args[_key - 1] = arguments[_key];
                    }

                    return state.endValue && date.isAfter(state.endValue, type) || _disabledDate && _disabledDate.apply(undefined, [date].concat(args));
                },
                onSelect: function onSelect(value) {
                    var selectedValue = value.clone().date(1).hour(0).minute(0).second(0);
                    if (type === 'year') {
                        selectedValue.month(0);
                    }
                    _this2.onSelectCalendarPanel(selectedValue, 'startValue');
                },
                value: state.startValue
            })),
            React.createElement(Calendar, _extends({
                shape: 'panel',
                modes: type === 'month' ? ['month', 'year'] : ['year']
            }, shareCalendarProps, {
                disabledDate: function disabledDate(date) {
                    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                        args[_key2 - 1] = arguments[_key2];
                    }

                    return state.startValue && date.isBefore(state.startValue, type) || _disabledDate && _disabledDate.apply(undefined, [date].concat(args));
                },
                onSelect: function onSelect(value) {
                    var selectedValue = value.clone().hour(23).minute(59).second(59);
                    if (type === 'year') {
                        selectedValue.month(11).date(31);
                    } else {
                        selectedValue.date(selectedValue.daysInMonth());
                    }
                    _this2.onSelectCalendarPanel(selectedValue, 'endValue');
                },
                value: state.endValue
            }))
        );

        var startTimeInput = null;
        var endTimeInput = null;
        var timePanel = null;
        var panelFooter = footerRender();

        if (showTime) {
            var _classnames6, _classnames7;

            var startTimeInputValue = state.inputing === 'startTime' ? state.startTimeInputStr : state.startValue && state.startValue.format(state.timeFormat) || '';
            var endTimeInputValue = state.inputing === 'endTime' ? state.endTimeInputStr : state.endValue && state.endValue.format(state.timeFormat) || '';

            startTriggerValue = state.startValue && state.startValue.format(state.dateTimeFormat) || '';
            endTriggerValue = state.endValue && state.endValue.format(state.dateTimeFormat) || '';

            var sharedTimeInputProps = {
                size: size,
                placeholder: state.timeFormat,
                onFocus: this.onFocusTimeInput,
                onBlur: this.onTimeInputBlur,
                onPressEnter: this.onTimeInputBlur,
                onChange: this.onTimeInputChange,
                onKeyDown: this.onTimeInputKeyDown
            };

            var startTimeInputCls = classnames((_classnames6 = {}, _classnames6[prefix + 'range-picker-panel-input-start-time'] = true, _classnames6[prefix + 'focus'] = state.activeDateInput === 'startTime', _classnames6));

            startTimeInput = React.createElement(Input, _extends({}, sharedTimeInputProps, {
                value: startTimeInputValue,
                'aria-label': startTimeInputAriaLabel,
                disabled: disabled || !state.startValue,
                onFocus: function onFocus() {
                    return _this2.onFocusTimeInput('startTime');
                },
                className: startTimeInputCls
            }));

            var endTimeInputCls = classnames((_classnames7 = {}, _classnames7[prefix + 'range-picker-panel-input-end-time'] = true, _classnames7[prefix + 'focus'] = state.activeDateInput === 'endTime', _classnames7));

            endTimeInput = React.createElement(Input, _extends({}, sharedTimeInputProps, {
                value: endTimeInputValue,
                'aria-label': endTimeInputAriaLabel,
                disabled: disabled || !state.endValue,
                onFocus: function onFocus() {
                    return _this2.onFocusTimeInput('endTime');
                },
                className: endTimeInputCls
            }));

            var showSecond = state.timeFormat.indexOf('s') > -1;
            var showMinute = state.timeFormat.indexOf('m') > -1;

            var sharedTimePickerProps = _extends({}, showTime, {
                prefix: prefix,
                locale: locale,
                disabled: disabled,
                showSecond: showSecond,
                showMinute: showMinute
            });

            var disabledTime = this.getDisabledTime(state);

            timePanel = React.createElement(
                'div',
                { className: prefix + 'range-picker-panel-time' },
                React.createElement(TimePickerPanel, _extends({}, sharedTimePickerProps, {
                    disabled: disabled || !state.startValue,
                    className: prefix + 'range-picker-panel-time-start',
                    value: state.startValue,
                    onSelect: this.onSelectStartTime
                })),
                React.createElement(TimePickerPanel, _extends({}, sharedTimePickerProps, disabledTime, {
                    disabled: disabled || !state.endValue,
                    className: prefix + 'range-picker-panel-time-end',
                    value: state.endValue,
                    onSelect: this.onSelectEndTime
                }))
            );
        }

        panelFooter = panelFooter || React.createElement(PanelFooter, {
            prefix: prefix,
            value: state.startValue || state.endValue,
            ranges: Object.keys(ranges).map(function (key) {
                return {
                    label: key,
                    value: ranges[key],
                    onChange: function onChange(values) {
                        _this2.setState({
                            startValue: values[0],
                            endValue: values[1]
                        });
                        _this2.onValueChange(values);
                    }
                };
            }),
            disabledOk: !state.startValue || !state.endValue || state.startValue.valueOf() > state.endValue.valueOf(),
            locale: locale,
            panel: state.panel,
            onPanelChange: showTime ? this.changePanel : null,
            onOk: this.onOk
        });

        var panelBody = (_PANEL$DATE$PANEL$TIM = {}, _PANEL$DATE$PANEL$TIM[PANEL.DATE] = datePanel, _PANEL$DATE$PANEL$TIM[PANEL.TIME] = timePanel, _PANEL$DATE$PANEL$TIM)[state.panel];

        var allowClear = state.startValue && state.endValue && hasClear;

        var _ref2 = placeholder || [],
            startPlaceholder = _ref2[0],
            endPlaceholder = _ref2[1];

        if (typeof placeholder === 'string') {
            startPlaceholder = placeholder;
            endPlaceholder = placeholder;
        }

        var trigger = React.createElement(
            'div',
            { className: triggerCls },
            React.createElement(Input, _extends({}, sharedInputProps, {
                readOnly: true,
                role: 'combobox',
                'aria-expanded': state.visible,
                label: label,
                placeholder: startPlaceholder || locale.startPlaceholder,
                value: startTriggerValue,
                hasBorder: false,
                className: prefix + 'range-picker-trigger-input',
                onFocus: function onFocus() {
                    return _this2.onFocusDateInput('startValue');
                }
            })),
            React.createElement(
                'span',
                { className: prefix + 'range-picker-trigger-separator' },
                '-'
            ),
            React.createElement(Input, _extends({}, sharedInputProps, {
                readOnly: true,
                role: 'combobox',
                'aria-expanded': state.visible,
                placeholder: endPlaceholder || locale.endPlaceholder,
                value: endTriggerValue,
                hasBorder: false,
                className: prefix + 'range-picker-trigger-input',
                onFocus: function onFocus() {
                    return _this2.onFocusDateInput('endValue');
                },
                hasClear: allowClear,
                hint: React.createElement(Icon, { type: 'calendar', className: prefix + 'date-picker-symbol-calendar-icon' })
            }))
        );

        var PopupComponent = popupComponent ? popupComponent : Popup;

        return React.createElement(
            'div',
            _extends({}, obj.pickOthers(RangePicker.propTypes, others), { className: classNames }),
            React.createElement(
                PopupComponent,
                _extends({
                    autoFocus: true,
                    align: popupAlign
                }, popupProps, {
                    followTrigger: followTrigger,
                    disabled: disabled,
                    visible: state.visible,
                    onVisibleChange: this.onVisibleChange,
                    triggerType: popupTriggerType,
                    container: popupContainer,
                    style: popupStyle,
                    className: popupClassName,
                    trigger: trigger
                }),
                popupContent ? popupContent : React.createElement(
                    'div',
                    { dir: others.dir, className: panelBodyClassName },
                    React.createElement(
                        'div',
                        { className: prefix + 'range-picker-panel-header' },
                        React.createElement(
                            'div',
                            { className: prefix + 'range-picker-panel-input' },
                            startDateInput,
                            startTimeInput,
                            React.createElement(
                                'span',
                                { className: prefix + 'range-picker-panel-input-separator' },
                                '-'
                            ),
                            endDateInput,
                            endTimeInput
                        )
                    ),
                    panelBody,
                    panelFooter
                )
            )
        );
    };

    return RangePicker;
}(Component), _class.propTypes = _extends({}, ConfigProvider.propTypes, {
    prefix: PropTypes.string,
    rtl: PropTypes.bool,
    /**
     * ??????????????????
     */
    type: PropTypes.oneOf(['date', 'month', 'year']),
    /**
     * ???????????????????????????
     * @return {MomentObject} ??????????????????????????? moment ????????????
     */
    defaultVisibleMonth: PropTypes.func,
    onVisibleMonthChange: PropTypes.func,
    /**
     * ????????????????????? [moment, moment]
     */
    value: PropTypes.array,
    /**
     * ?????????????????????????????? [moment, moment]
     */
    defaultValue: PropTypes.array,
    /**
     * ????????????
     */
    format: PropTypes.string,
    /**
     * ??????????????????????????????????????? TimePicker ?????????
     */
    showTime: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    /**
     * ??????????????????????????????????????? showTime ??????????????????
     */
    resetTime: PropTypes.bool,
    /**
     * ??????????????????
     * @param {MomentObject} ?????????
     * @param {String} view ?????????????????????year: ?????? month: ???, date: ???
     * @return {Boolean} ????????????
     */
    disabledDate: PropTypes.func,
    /**
     * ?????????????????????
     * @return {Node} ??????????????????????????????
     */
    footerRender: PropTypes.func,
    /**
     * ????????????????????????????????? [ MomentObject|String, MomentObject|String ]
     * @param {Array<MomentObject|String>} value ?????????
     */
    onChange: PropTypes.func,
    /**
     * ?????????????????????????????? ?????????????????????????????????`[ MomentObject|String, MomentObject|String ]`
     * @return {Array} ????????????
     */
    onOk: PropTypes.func,
    /**
     * ?????????????????????
     */
    label: PropTypes.node,
    /**
     * ???????????????
     */
    state: PropTypes.oneOf(['error', 'loading', 'success']),
    /**
     * ???????????????
     */
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    /**
     * ????????????
     */
    disabled: PropTypes.bool,
    /**
     * ????????????????????????
     */
    hasClear: PropTypes.bool,
    /**
     * ??????????????????
     */
    visible: PropTypes.bool,
    /**
     * ????????????????????????
     */
    defaultVisible: PropTypes.bool,
    /**
     * ????????????????????????????????????
     * @param {Boolean} visible ??????????????????
     * @param {String} type ???????????????????????????????????? okBtnClick ?????????????????????????????? fromTrigger ?????????trigger?????????????????? docClick ?????????document???????????????
     */
    onVisibleChange: PropTypes.func,
    /**
     * ??????????????????
     */
    popupTriggerType: PropTypes.oneOf(['click', 'hover']),
    /**
     * ??????????????????, ??????????????? OverLay??????
     */
    popupAlign: PropTypes.string,
    /**
     * ????????????
     * @param {Element} target ????????????
     * @return {Element} ?????????????????????
     */
    popupContainer: PropTypes.any,
    /**
     * ?????????????????????
     */
    popupStyle: PropTypes.object,
    /**
     * ????????????????????????
     */
    popupClassName: PropTypes.string,
    /**
     * ??????????????????
     */
    popupProps: PropTypes.object,
    /**
     * ??????????????????
     */
    followTrigger: PropTypes.bool,
    /**
     * ?????????????????????
     */
    inputProps: PropTypes.object,
    /**
     * ??????????????????????????????
     */
    dateCellRender: PropTypes.func,
    /**
     * ???????????????????????????
     * @param {Object} calendarDate ?????? Calendar ??????????????????????????????
     * @returns {ReactNode}
     */
    monthCellRender: PropTypes.func,
    yearCellRender: PropTypes.func, // ?????? 0.x yearCellRender
    /**
     * ???????????????????????? aria-label ??????
     */
    startDateInputAriaLabel: PropTypes.string,
    /**
     * ???????????????????????? aria-label ??????
     */
    startTimeInputAriaLabel: PropTypes.string,
    /**
     * ???????????????????????? aria-label ??????
     */
    endDateInputAriaLabel: PropTypes.string,
    /**
     * ???????????????????????? aria-label ??????
     */
    endTimeInputAriaLabel: PropTypes.string,
    /**
     * ??????????????????
     */
    isPreview: PropTypes.bool,
    /**
     * ?????????????????????????????????
     * @param {Array<MomentObject, MomentObject>} value ????????????
     */
    renderPreview: PropTypes.func,
    disableChangeMode: PropTypes.bool,
    yearRange: PropTypes.arrayOf(PropTypes.number),
    ranges: PropTypes.object, // ??????0.x??????
    locale: PropTypes.object,
    className: PropTypes.string,
    name: PropTypes.string,
    popupComponent: PropTypes.elementType,
    popupContent: PropTypes.node,
    placeholder: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string])
}), _class.defaultProps = {
    prefix: 'next-',
    rtl: false,
    type: 'date',
    size: 'medium',
    showTime: false,
    resetTime: false,
    disabledDate: function disabledDate() {
        return false;
    },
    footerRender: function footerRender() {
        return null;
    },
    hasClear: true,
    defaultVisible: false,
    popupTriggerType: 'click',
    popupAlign: 'tl tl',
    locale: nextLocale.DatePicker,
    disableChangeMode: false,
    onChange: func.noop,
    onOk: func.noop,
    onVisibleChange: func.noop
}, _initialiseProps = function _initialiseProps() {
    var _this3 = this;

    this.onValueChange = function (values) {
        var handler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'onChange';

        var ret = void 0;
        if (!values.length || !_this3.state.inputAsString) {
            ret = values;
        } else {
            ret = [values[0] ? values[0].format(_this3.state.dateTimeFormat) : null, values[1] ? values[1].format(_this3.state.dateTimeFormat) : null];
        }
        _this3.props[handler](ret);
    };

    this.onSelectCalendarPanel = function (value, active) {
        var _props3 = _this3.props,
            showTime = _props3.showTime,
            resetTime = _props3.resetTime;
        var _state = _this3.state,
            prevActiveDateInput = _state.activeDateInput,
            prevStartValue = _state.startValue,
            prevEndValue = _state.endValue,
            timeFormat = _state.timeFormat;


        var newState = {
            activeDateInput: active || prevActiveDateInput,
            inputing: false
        };

        var newValue = value;

        switch (active || prevActiveDateInput) {
            case 'startValue':
                {
                    if (!prevEndValue || value.valueOf() <= prevEndValue.valueOf()) {
                        newState.activeDateInput = 'endValue';
                    }

                    if (showTime) {
                        if (!prevStartValue) {
                            // ???????????????????????????????????????????????????????????????????????????
                            if (showTime.defaultValue) {
                                var defaultTimeValue = formatDateValue(Array.isArray(showTime.defaultValue) ? showTime.defaultValue[0] : showTime.defaultValue, timeFormat);
                                newValue = resetValueTime(value, defaultTimeValue);
                            }
                        } else if (!resetTime) {
                            // ???????????????????????????????????? resetTime ????????????????????????????????????
                            newValue = resetValueTime(value, prevStartValue);
                        }
                    }

                    newState.startValue = newValue;

                    // ????????????????????????????????????
                    if (prevEndValue && newValue.valueOf() > prevEndValue.valueOf()) {
                        // ???????????????????????????????????? ??????????????????????????????
                        newState.endValue = resetTime ? newValue : resetValueTime(value, prevEndValue);

                        // ????????????????????????????????????????????????????????????????????????????????????
                        if (newState.endValue.valueOf() < newState.startValue.valueOf()) {
                            newState.endValue = moment(newState.startValue);
                        }
                        newState.activeDateInput = 'endValue';
                    }
                    break;
                }

            case 'endValue':
                if (!prevStartValue) {
                    newState.activeDateInput = 'startValue';
                }

                if (showTime) {
                    if (!prevEndValue) {
                        // ???????????????????????????????????????????????????????????????????????????
                        if (showTime.defaultValue) {
                            var _defaultTimeValue = formatDateValue(Array.isArray(showTime.defaultValue) ? showTime.defaultValue[1] || showTime.defaultValue[0] : showTime.defaultValue, timeFormat);
                            newValue = resetValueTime(value, _defaultTimeValue);
                        }
                    } else if (!resetTime) {
                        // ???????????????????????????????????? resetTime ????????????????????????????????????
                        newValue = resetValueTime(value, prevEndValue);
                    }
                }

                newState.endValue = newValue;

                // ???????????????????????????????????????????????????????????????????????????????????????
                if (prevStartValue && newValue.valueOf() <= prevStartValue.valueOf()) {
                    newState.startValue = resetTime ? value : resetValueTime(value, prevStartValue);
                    newState.endValue = resetTime ? value : resetValueTime(value, prevEndValue);

                    // ????????????????????????????????????????????????????????????????????????????????????
                    if (newState.endValue.valueOf() < newState.startValue.valueOf()) {
                        newState.endValue = moment(newState.startValue);
                    }
                }
                break;
        }

        var newStartValue = 'startValue' in newState ? newState.startValue : prevStartValue;
        var newEndValue = 'endValue' in newState ? newState.endValue : prevEndValue;

        // ??????????????????????????????
        if ('value' in _this3.props) {
            delete newState.startValue;
            delete newState.endValue;
        }

        _this3.setState(newState);

        _this3.onValueChange([newStartValue, newEndValue]);
    };

    this.clearRange = function () {
        _this3.setState({
            startDateInputStr: '',
            endDateInputStr: '',
            startTimeInputStr: '',
            endTimeInputStr: ''
        });

        if (!('value' in _this3.props)) {
            _this3.setState({
                startValue: null,
                endValue: null
            });
        }

        _this3.onValueChange([]);
    };

    this.onDateInputChange = function (inputStr, e, eventType) {
        if (eventType === 'clear' || !inputStr) {
            e.stopPropagation();
            _this3.clearRange();
        } else {
            var _this3$setState;

            var stateName = mapInputStateName(_this3.state.activeDateInput);
            _this3.setState((_this3$setState = {}, _this3$setState[stateName] = inputStr, _this3$setState.inputing = _this3.state.activeDateInput, _this3$setState));
        }
    };

    this.onDateInputBlur = function () {
        var resetTime = _this3.props.resetTime;
        var activeDateInput = _this3.state.activeDateInput;

        var stateName = mapInputStateName(activeDateInput);
        var dateInputStr = _this3.state[stateName];

        if (dateInputStr) {
            var _this3$setState2;

            var _props4 = _this3.props,
                format = _props4.format,
                disabledDate = _props4.disabledDate;

            var parsed = moment(dateInputStr, format, true);

            _this3.setState((_this3$setState2 = {}, _this3$setState2[stateName] = '', _this3$setState2.inputing = false, _this3$setState2));

            if (parsed.isValid() && !disabledDate(parsed, 'date')) {
                var valueName = activeDateInput;
                var newValue = resetTime ? parsed : resetValueTime(parsed, _this3.state[activeDateInput]);

                _this3.handleChange(valueName, newValue);
            }
        }
    };

    this.onDateInputKeyDown = function (e) {
        var type = _this3.props.type;
        var _state2 = _this3.state,
            activeDateInput = _state2.activeDateInput,
            format = _state2.format;

        var stateName = mapInputStateName(activeDateInput);
        var dateInputStr = _this3.state[stateName];
        var dateStr = onDateKeydown(e, {
            format: format,
            value: _this3.state[activeDateInput],
            dateInputStr: dateInputStr
        }, type === 'date' ? 'day' : type);
        if (!dateStr) return;

        return _this3.onDateInputChange(dateStr);
    };

    this.onFocusDateInput = function (type) {
        if (type !== _this3.state.activeDateInput) {
            _this3.setState({
                activeDateInput: type
            });
        }
        if (_this3.state.panel !== PANEL.DATE) {
            _this3.setState({
                panel: PANEL.DATE
            });
        }
    };

    this.onFocusTimeInput = function (type) {
        if (type !== _this3.state.activeDateInput) {
            _this3.setState({
                activeDateInput: type
            });
        }

        if (_this3.state.panel !== PANEL.TIME) {
            _this3.setState({
                panel: PANEL.TIME
            });
        }
    };

    this.onSelectStartTime = function (value) {
        if (!('value' in _this3.props)) {
            _this3.setState({
                startValue: value,
                inputing: false,
                activeDateInput: 'startTime'
            });
        }

        if (value.valueOf() !== _this3.state.startValue.valueOf()) {
            _this3.onValueChange([value, _this3.state.endValue]);
        }
    };

    this.onSelectEndTime = function (value) {
        if (!('value' in _this3.props)) {
            _this3.setState({
                endValue: value,
                inputing: false,
                activeDateInput: 'endTime'
            });
        }
        if (value.valueOf() !== _this3.state.endValue.valueOf()) {
            _this3.onValueChange([_this3.state.startValue, value]);
        }
    };

    this.onTimeInputChange = function (inputStr) {
        var _this3$setState3;

        var stateName = mapInputStateName(_this3.state.activeDateInput);
        _this3.setState((_this3$setState3 = {}, _this3$setState3[stateName] = inputStr, _this3$setState3.inputing = _this3.state.activeDateInput, _this3$setState3));
    };

    this.onTimeInputBlur = function () {
        var _this3$setState4;

        var stateName = mapInputStateName(_this3.state.activeDateInput);
        var timeInputStr = _this3.state[stateName];

        var parsed = moment(timeInputStr, _this3.state.timeFormat, true);

        _this3.setState((_this3$setState4 = {}, _this3$setState4[stateName] = '', _this3$setState4.inputing = false, _this3$setState4));

        if (parsed.isValid()) {
            var hour = parsed.hour();
            var minute = parsed.minute();
            var second = parsed.second();
            var valueName = mapTimeToValue(_this3.state.activeDateInput);
            var newValue = _this3.state[valueName].clone().hour(hour).minute(minute).second(second);

            _this3.handleChange(valueName, newValue);
        }
    };

    this.onTimeInputKeyDown = function (e) {
        var showTime = _this3.props.showTime;
        var _state3 = _this3.state,
            activeDateInput = _state3.activeDateInput,
            timeFormat = _state3.timeFormat;

        var stateName = mapInputStateName(activeDateInput);
        var timeInputStr = _this3.state[stateName];

        var _ref3 = (typeof showTime === 'undefined' ? 'undefined' : _typeof(showTime)) === 'object' ? showTime : {},
            disabledMinutes = _ref3.disabledMinutes,
            disabledSeconds = _ref3.disabledSeconds,
            _ref3$hourStep = _ref3.hourStep,
            hourStep = _ref3$hourStep === undefined ? 1 : _ref3$hourStep,
            _ref3$minuteStep = _ref3.minuteStep,
            minuteStep = _ref3$minuteStep === undefined ? 1 : _ref3$minuteStep,
            _ref3$secondStep = _ref3.secondStep,
            secondStep = _ref3$secondStep === undefined ? 1 : _ref3$secondStep;

        var unit = 'second';

        if (disabledSeconds) {
            unit = disabledMinutes ? 'hour' : 'minute';
        }

        var timeStr = onTimeKeydown(e, {
            format: timeFormat,
            timeInputStr: timeInputStr,
            value: _this3.state[activeDateInput.indexOf('start') ? 'startValue' : 'endValue'],
            steps: {
                hour: hourStep,
                minute: minuteStep,
                second: secondStep
            }
        }, unit);

        if (!timeStr) return;

        _this3.onTimeInputChange(timeStr);
    };

    this.handleChange = function (valueName, newValue) {
        var values = ['startValue', 'endValue'].map(function (name) {
            return valueName === name ? newValue : _this3.state[name];
        });

        // ??????????????????????????????????????????
        if (values[0] && values[1] && values[0].valueOf() > values[1].valueOf()) {
            return;
        }

        if (!('value' in _this3.props)) {
            var _this3$setState5;

            _this3.setState((_this3$setState5 = {}, _this3$setState5[valueName] = newValue, _this3$setState5));
        }

        _this3.onValueChange(values);
    };

    this.onVisibleChange = function (visible, type) {
        if (!('visible' in _this3.props)) {
            _this3.setState({
                visible: visible
            });
        }
        _this3.props.onVisibleChange(visible, type);
    };

    this.changePanel = function (panel) {
        var _state4 = _this3.state,
            startValue = _state4.startValue,
            endValue = _state4.endValue;

        _this3.setState({
            panel: panel,
            activeDateInput: panel === PANEL.DATE ? !!startValue && !endValue ? 'endValue' : 'startValue' : 'startTime'
        });
    };

    this.onOk = function (value) {
        _this3.onVisibleChange(false, 'okBtnClick');
        _this3.onValueChange(value || [_this3.state.startValue, _this3.state.endValue], 'onOk');
    };

    this.getDisabledTime = function (_ref4) {
        var startValue = _ref4.startValue,
            endValue = _ref4.endValue;

        var _ref5 = _this3.props.showTime || {},
            disabledHours = _ref5.disabledHours,
            disabledMinutes = _ref5.disabledMinutes,
            disabledSeconds = _ref5.disabledSeconds;

        var disabledTime = {};

        if (startValue && endValue) {
            var isSameDay = startValue.format('L') === endValue.format('L');
            var newDisabledHours = isFunction(disabledHours) ? disabledHours : function (index) {
                if (isSameDay && index < startValue.hour()) {
                    return true;
                }
            };

            var newDisabledMinutes = isFunction(disabledMinutes) ? disabledMinutes : function (index) {
                if (isSameDay && startValue.hour() === endValue.hour() && index < startValue.minute()) {
                    return true;
                }
            };

            var newDisabledSeconds = isFunction(disabledSeconds) ? disabledSeconds : function (index) {
                if (isSameDay && startValue.hour() === endValue.hour() && startValue.minute() === endValue.minute() && index < startValue.second()) {
                    return true;
                }
            };
            disabledTime = {
                disabledHours: newDisabledHours,
                disabledMinutes: newDisabledMinutes,
                disabledSeconds: newDisabledSeconds
            };
        }

        return disabledTime;
    };
}, _temp);
RangePicker.displayName = 'RangePicker';


export default polyfill(RangePicker);
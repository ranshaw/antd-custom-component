import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';
import classnames from 'classnames';
import moment from 'moment';
import Overlay from '../overlay';
import Input from '../input';
import Icon from '../icon';
import Calendar from '../calendar';
import nextLocale from '../locale/zh-cn';
import { func, obj } from '../util';
import { checkDateValue, formatDateValue, onDateKeydown } from './util';

var Popup = Overlay.Popup;

/**
 * DatePicker.YearPicker
 */

var YearPicker = (_temp = _class = function (_Component) {
    _inherits(YearPicker, _Component);

    function YearPicker(props, context) {
        _classCallCheck(this, YearPicker);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

        _this.onValueChange = function (newValue) {
            var ret = _this.state.inputAsString && newValue ? newValue.format(_this.props.format) : newValue;
            _this.props.onChange(ret);
        };

        _this.onSelectCalendarPanel = function (value) {
            // const { format } = this.props;
            var prevSelectedMonth = _this.state.value;
            var selectedMonth = value.clone().month(0).date(1).hour(0).minute(0).second(0);

            _this.handleChange(selectedMonth, prevSelectedMonth, { inputing: false }, function () {
                _this.onVisibleChange(false, 'calendarSelect');
            });
        };

        _this.clearValue = function () {
            _this.setState({
                dateInputStr: ''
            });

            _this.handleChange(null, _this.state.value);
        };

        _this.onDateInputChange = function (inputStr, e, eventType) {
            if (eventType === 'clear' || !inputStr) {
                e.stopPropagation();
                _this.clearValue();
            } else {
                _this.setState({
                    dateInputStr: inputStr,
                    inputing: true
                });
            }
        };

        _this.onDateInputBlur = function () {
            var dateInputStr = _this.state.dateInputStr;

            if (dateInputStr) {
                var _this$props = _this.props,
                    disabledDate = _this$props.disabledDate,
                    format = _this$props.format;

                var parsed = moment(dateInputStr, format, true);

                _this.setState({
                    dateInputStr: '',
                    inputing: false
                });

                if (parsed.isValid() && !disabledDate(parsed, 'year')) {
                    _this.handleChange(parsed, _this.state.value);
                }
            }
        };

        _this.onKeyDown = function (e) {
            var format = _this.props.format;
            var _this$state = _this.state,
                dateInputStr = _this$state.dateInputStr,
                value = _this$state.value;

            var dateStr = onDateKeydown(e, { format: format, dateInputStr: dateInputStr, value: value }, 'year');
            if (!dateStr) return;
            _this.onDateInputChange(dateStr);
        };

        _this.handleChange = function (newValue, prevValue) {
            var others = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
            var callback = arguments[3];

            if (!('value' in _this.props)) {
                _this.setState(_extends({
                    value: newValue
                }, others));
            } else {
                _this.setState(_extends({}, others));
            }

            var format = _this.props.format;


            var newValueOf = newValue ? newValue.format(format) : null;
            var preValueOf = prevValue ? prevValue.format(format) : null;

            if (newValueOf !== preValueOf) {
                _this.onValueChange(newValue);
                if (typeof callback === 'function') {
                    return callback();
                }
            }
        };

        _this.onVisibleChange = function (visible, reason) {
            if (!('visible' in _this.props)) {
                _this.setState({
                    visible: visible
                });
            }
            _this.props.onVisibleChange(visible, reason);
        };

        _this.state = {
            value: formatDateValue(props.defaultValue, props.format),
            dateInputStr: '',
            inputing: false,
            visible: props.defaultVisible,
            inputAsString: typeof props.defaultValue === 'string' // ????????????????????????????????????
        };
        return _this;
    }

    YearPicker.getDerivedStateFromProps = function getDerivedStateFromProps(props) {
        var states = {};
        if ('value' in props) {
            states.value = formatDateValue(props.value, props.format);
            states.inputAsString = typeof props.value === 'string';
        }

        if ('visible' in props) {
            states.visible = props.visible;
        }

        return states;
    };

    YearPicker.prototype.renderPreview = function renderPreview(others) {
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

    YearPicker.prototype.render = function render() {
        var _classnames, _classnames2, _classnames3;

        var _props2 = this.props,
            prefix = _props2.prefix,
            rtl = _props2.rtl,
            locale = _props2.locale,
            label = _props2.label,
            state = _props2.state,
            format = _props2.format,
            disabledDate = _props2.disabledDate,
            footerRender = _props2.footerRender,
            placeholder = _props2.placeholder,
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
            inputProps = _props2.inputProps,
            dateInputAriaLabel = _props2.dateInputAriaLabel,
            yearCellRender = _props2.yearCellRender,
            isPreview = _props2.isPreview,
            others = _objectWithoutProperties(_props2, ['prefix', 'rtl', 'locale', 'label', 'state', 'format', 'disabledDate', 'footerRender', 'placeholder', 'size', 'disabled', 'hasClear', 'popupTriggerType', 'popupAlign', 'popupContainer', 'popupStyle', 'popupClassName', 'popupProps', 'popupComponent', 'popupContent', 'followTrigger', 'className', 'inputProps', 'dateInputAriaLabel', 'yearCellRender', 'isPreview']);

        var _state = this.state,
            visible = _state.visible,
            value = _state.value,
            dateInputStr = _state.dateInputStr,
            inputing = _state.inputing;


        var yearPickerCls = classnames((_classnames = {}, _classnames[prefix + 'year-picker'] = true, _classnames), className);

        var triggerInputCls = classnames((_classnames2 = {}, _classnames2[prefix + 'year-picker-input'] = true, _classnames2[prefix + 'error'] = false, _classnames2));

        var panelBodyClassName = classnames((_classnames3 = {}, _classnames3[prefix + 'year-picker-body'] = true, _classnames3));

        if (rtl) {
            others.dir = 'rtl';
        }

        if (isPreview) {
            return this.renderPreview(obj.pickOthers(others, YearPicker.PropTypes));
        }

        var panelInputCls = prefix + 'year-picker-panel-input';

        var sharedInputProps = _extends({}, inputProps, {
            size: size,
            disabled: disabled,
            onChange: this.onDateInputChange,
            onBlur: this.onDateInputBlur,
            onPressEnter: this.onDateInputBlur,
            onKeyDown: this.onKeyDown
        });

        var dateInputValue = inputing ? dateInputStr : value && value.format(format) || '';
        var triggerInputValue = dateInputValue;

        var dateInput = React.createElement(Input, _extends({}, sharedInputProps, {
            'aria-label': dateInputAriaLabel,
            value: dateInputValue,
            placeholder: format,
            className: panelInputCls
        }));

        var datePanel = React.createElement(Calendar, {
            shape: 'panel',
            modes: ['year'],
            value: value,
            yearCellRender: yearCellRender,
            onSelect: this.onSelectCalendarPanel,
            disabledDate: disabledDate
        });

        var panelBody = datePanel;
        var panelFooter = footerRender();

        var allowClear = value && hasClear;
        var trigger = React.createElement(
            'div',
            { className: prefix + 'year-picker-trigger' },
            React.createElement(Input, _extends({}, sharedInputProps, {
                label: label,
                state: state,
                value: triggerInputValue,
                role: 'combobox',
                'aria-expanded': visible,
                readOnly: true,
                placeholder: placeholder || locale.yearPlaceholder,
                hint: React.createElement(Icon, {
                    type: 'calendar',
                    className: prefix + 'date-picker-symbol-calendar-icon'
                }),
                hasClear: allowClear,
                className: triggerInputCls
            }))
        );

        var PopupComponent = popupComponent ? popupComponent : Popup;

        return React.createElement(
            'div',
            _extends({}, obj.pickOthers(YearPicker.propTypes, others), {
                className: yearPickerCls
            }),
            React.createElement(
                PopupComponent,
                _extends({
                    autoFocus: true,
                    align: popupAlign
                }, popupProps, {
                    followTrigger: followTrigger,
                    disabled: disabled,
                    visible: visible,
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
                        {
                            className: prefix + 'year-picker-panel-header'
                        },
                        dateInput
                    ),
                    panelBody,
                    panelFooter
                )
            )
        );
    };

    return YearPicker;
}(Component), _class.propTypes = {
    prefix: PropTypes.string,
    rtl: PropTypes.bool,
    /**
     * ?????????????????????
     */
    label: PropTypes.node,
    /**
     * ???????????????
     */
    state: PropTypes.oneOf(['success', 'loading', 'error']),
    /**
     * ????????????
     */
    placeholder: PropTypes.string,
    /**
     * ?????????????????????moment ??????
     */
    value: checkDateValue,
    /**
     * ??????????????????moment ??????
     */
    defaultValue: checkDateValue,
    /**
     * ?????????????????????????????????????????????????????????
     */
    format: PropTypes.string,
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
     * ???????????????????????????
     * @param {MomentObject|String} value ?????????
     */
    onChange: PropTypes.func,
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
     * @param {String} reason ???????????????????????????????????? calendarSelect ??????????????????????????????????????? fromTrigger ?????????trigger?????????????????? docClick ?????????document???????????????
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
    yearCellRender: PropTypes.func, // ?????? 0.x yearCellRender
    /**
     * ?????????????????? aria-label ??????
     */
    dateInputAriaLabel: PropTypes.string,
    /**
     * ??????????????????
     */
    isPreview: PropTypes.bool,
    /**
     * ?????????????????????????????????
     * @param {MomentObject} value ??????
     */
    renderPreview: PropTypes.func,
    locale: PropTypes.object,
    className: PropTypes.string,
    name: PropTypes.string,
    popupComponent: PropTypes.elementType,
    popupContent: PropTypes.node
}, _class.defaultProps = {
    prefix: 'next-',
    rtl: false,
    format: 'YYYY',
    size: 'medium',
    disabledDate: function disabledDate() {
        return false;
    },
    footerRender: function footerRender() {
        return null;
    },
    hasClear: true,
    popupTriggerType: 'click',
    popupAlign: 'tl tl',
    locale: nextLocale.DatePicker,
    onChange: func.noop,
    onVisibleChange: func.noop
}, _temp);
YearPicker.displayName = 'YearPicker';


export default polyfill(YearPicker);
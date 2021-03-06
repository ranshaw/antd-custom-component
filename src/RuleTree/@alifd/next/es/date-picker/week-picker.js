import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp, _initialiseProps;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import moment from 'moment';
import { polyfill } from 'react-lifecycles-compat';
import Overlay from '../overlay';
import Input from '../input';
import Icon from '../icon';
import Calendar from '../calendar';
import ConfigProvider from '../config-provider';
import nextLocale from '../locale/zh-cn';
import { func, obj, KEYCODE } from '../util';
import { checkDateValue, formatDateValue } from './util';

var Popup = Overlay.Popup;

/**
 * DatePicker.WeekPicker
 */

var WeekPicker = (_temp = _class = function (_Component) {
    _inherits(WeekPicker, _Component);

    function WeekPicker(props, context) {
        _classCallCheck(this, WeekPicker);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

        _initialiseProps.call(_this);

        var value = formatDateValue(props.value || props.defaultValue, props.format);

        _this.state = {
            value: value,
            visible: props.visible || props.defaultVisible
        };
        return _this;
    }

    WeekPicker.getDerivedStateFromProps = function getDerivedStateFromProps(props) {
        var st = {};
        if ('value' in props) {
            st.value = formatDateValue(props.value, props.format);
        }

        if ('visible' in props) {
            st.visible = props.visible;
        }

        return st;
    };

    WeekPicker.prototype.renderPreview = function renderPreview(others) {
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

    WeekPicker.prototype.render = function render() {
        var _props2 = this.props,
            prefix = _props2.prefix,
            rtl = _props2.rtl,
            locale = _props2.locale,
            label = _props2.label,
            state = _props2.state,
            format = _props2.format,
            defaultVisibleMonth = _props2.defaultVisibleMonth,
            onVisibleMonthChange = _props2.onVisibleMonthChange,
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
            monthCellRender = _props2.monthCellRender,
            yearCellRender = _props2.yearCellRender,
            isPreview = _props2.isPreview,
            others = _objectWithoutProperties(_props2, ['prefix', 'rtl', 'locale', 'label', 'state', 'format', 'defaultVisibleMonth', 'onVisibleMonthChange', 'disabledDate', 'footerRender', 'placeholder', 'size', 'disabled', 'hasClear', 'popupTriggerType', 'popupAlign', 'popupContainer', 'popupStyle', 'popupClassName', 'popupProps', 'popupComponent', 'popupContent', 'followTrigger', 'className', 'inputProps', 'monthCellRender', 'yearCellRender', 'isPreview']);

        var _state = this.state,
            visible = _state.visible,
            value = _state.value;


        var sharedInputProps = _extends({}, inputProps, {
            size: size,
            disabled: disabled,
            onChange: this.onDateInputChange,
            onKeyDown: this.onKeyDown
        });

        if (rtl) {
            others.dir = 'rtl';
        }

        if (isPreview) {
            return this.renderPreview(obj.pickOthers(others, WeekPicker.PropTypes));
        }

        var trigger = React.createElement(
            'div',
            { className: prefix + 'week-picker-trigger' },
            React.createElement(Input, _extends({}, sharedInputProps, {
                label: label,
                state: state,
                value: value ? value.format(format) : '',
                role: 'combobox',
                'aria-expanded': visible,
                readOnly: true,
                placeholder: placeholder || locale.weekPlaceholder,
                hint: React.createElement(Icon, { type: 'calendar', className: prefix + 'date-picker-symbol-calendar-icon' }),
                hasClear: value && hasClear,
                className: prefix + 'week-picker-input'
            }))
        );

        var PopupComponent = popupComponent ? popupComponent : Popup;

        return React.createElement(
            'div',
            _extends({}, obj.pickOthers(WeekPicker.propTypes, others), {
                className: classnames(prefix + 'week-picker', className)
            }),
            React.createElement(
                PopupComponent,
                _extends({
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
                    { dir: others.dir, className: prefix + 'week-picker-body' },
                    React.createElement(Calendar, {
                        shape: 'panel',
                        value: value,
                        format: format,
                        className: prefix + 'calendar-week',
                        dateCellRender: this.dateRender,
                        monthCellRender: monthCellRender,
                        yearCellRender: yearCellRender,
                        onSelect: this.onSelectCalendarPanel,
                        defaultVisibleMonth: defaultVisibleMonth,
                        onVisibleMonthChange: onVisibleMonthChange,
                        disabledDate: disabledDate
                    }),
                    footerRender()
                )
            )
        );
    };

    return WeekPicker;
}(Component), _class.propTypes = _extends({}, ConfigProvider.propTypes, {
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
     * ??????????????????
     * @return {MomentObject} ??????????????????????????? moment ????????????
     */
    defaultVisibleMonth: PropTypes.func,
    onVisibleMonthChange: PropTypes.func,
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
     * @param {String} type ???????????????????????????????????? calendarSelect ??????????????????????????????????????? okBtnClick ?????????????????????????????? fromTrigger ?????????trigger?????????????????? docClick ?????????document???????????????
     */
    onVisibleChange: PropTypes.func,
    /**
     * ??????????????????
     */
    popupTriggerType: PropTypes.oneOf(['click', 'hover']),
    /**
     * ??????????????????,??????????????? OverLay??????
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
     * ???????????????????????????
     * @param {Object} value ????????????moment?????????
     * @returns {ReactNode}
     */
    dateCellRender: PropTypes.func,
    /**
     * ???????????????????????????
     * @param {Object} calendarDate ?????? Calendar ??????????????????????????????
     * @returns {ReactNode}
     */
    monthCellRender: PropTypes.func,
    /**
     * ??????????????????
     */
    isPreview: PropTypes.bool,
    /**
     * ?????????????????????????????????
     * @param {MomentObject} value ??????
     */
    renderPreview: PropTypes.func,
    yearCellRender: PropTypes.func, // ?????? 0.x yearCellRender
    locale: PropTypes.object,
    className: PropTypes.string,
    name: PropTypes.string,
    popupComponent: PropTypes.elementType,
    popupContent: PropTypes.node
}), _class.defaultProps = {
    prefix: 'next-',
    rtl: false,
    format: 'GGGG-Wo',
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
    defaultVisible: false,
    onChange: func.noop,
    onVisibleChange: func.noop
}, _initialiseProps = function _initialiseProps() {
    var _this2 = this;

    this.handleChange = function (newValue, prevValue) {
        if (!('value' in _this2.props)) {
            _this2.setState({
                value: newValue
            });
        }

        var newValueOf = newValue ? newValue.valueOf() : null;
        var preValueOf = prevValue ? prevValue.valueOf() : null;

        if (newValueOf !== preValueOf) {
            _this2.props.onChange(newValue);
        }
    };

    this.onDateInputChange = function (value, e, eventType) {
        if (eventType === 'clear' || !value) {
            e.stopPropagation();
            _this2.handleChange(null, _this2.state.value);
        }
    };

    this.onKeyDown = function (e) {
        if ([KEYCODE.UP, KEYCODE.DOWN, KEYCODE.PAGE_UP, KEYCODE.PAGE_DOWN].indexOf(e.keyCode) === -1) {
            return;
        }

        if (e.altKey && [KEYCODE.PAGE_UP, KEYCODE.PAGE_DOWN].indexOf(e.keyCode) === -1 || e.controlKey || e.shiftKey) {
            return;
        }

        var date = _this2.state.value;

        if (date && date.isValid()) {
            var stepUnit = e.altKey ? 'year' : 'month';
            switch (e.keyCode) {
                case KEYCODE.UP:
                    date.subtract(1, 'w');
                    break;
                case KEYCODE.DOWN:
                    date.add(1, 'w');
                    break;
                case KEYCODE.PAGE_UP:
                    date.subtract(1, stepUnit);
                    break;
                case KEYCODE.PAGE_DOWN:
                    date.add(1, stepUnit);
                    break;
            }
        } else {
            date = moment();
        }

        e.preventDefault();

        _this2.handleChange(date, _this2.state.value);
    };

    this.onVisibleChange = function (visible, type) {
        if (!('visible' in _this2.props)) {
            _this2.setState({
                visible: visible
            });
        }
        _this2.props.onVisibleChange(visible, type);
    };

    this.onSelectCalendarPanel = function (value) {
        _this2.handleChange(value, _this2.state.value);
        _this2.onVisibleChange(false, 'calendarSelect');
    };

    this.dateRender = function (value) {
        var _props3 = _this2.props,
            prefix = _props3.prefix,
            dateCellRender = _props3.dateCellRender;

        var selectedValue = _this2.state.value;
        var content = dateCellRender && typeof dateCellRender === 'function' ? dateCellRender(value) : value.dates();
        if (selectedValue && selectedValue.years() === value.years() && selectedValue.weeks() === value.weeks()) {
            var _classnames;

            var firstDay = moment.localeData().firstDayOfWeek();
            var endDay = firstDay - 1 < 0 ? 6 : firstDay - 1;
            return React.createElement(
                'div',
                {
                    className: classnames(prefix + 'calendar-week-active-date', (_classnames = {}, _classnames[prefix + 'calendar-week-active-start'] = value.days() === moment.localeData().firstDayOfWeek(), _classnames[prefix + 'calendar-week-active-end'] = value.days() === endDay, _classnames))
                },
                React.createElement(
                    'span',
                    null,
                    content
                )
            );
        }

        return content;
    };
}, _temp);
WeekPicker.displayName = 'WeekPicker';


export default polyfill(WeekPicker);
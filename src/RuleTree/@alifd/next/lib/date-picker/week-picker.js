'use strict';

exports.__esModule = true;

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _class, _temp, _initialiseProps;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames2 = require('classnames');

var _classnames3 = _interopRequireDefault(_classnames2);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _reactLifecyclesCompat = require('react-lifecycles-compat');

var _overlay = require('../overlay');

var _overlay2 = _interopRequireDefault(_overlay);

var _input = require('../input');

var _input2 = _interopRequireDefault(_input);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _calendar = require('../calendar');

var _calendar2 = _interopRequireDefault(_calendar);

var _configProvider = require('../config-provider');

var _configProvider2 = _interopRequireDefault(_configProvider);

var _zhCn = require('../locale/zh-cn');

var _zhCn2 = _interopRequireDefault(_zhCn);

var _util = require('../util');

var _util2 = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Popup = _overlay2.default.Popup;

/**
 * DatePicker.WeekPicker
 */

var WeekPicker = (_temp = _class = function (_Component) {
    (0, _inherits3.default)(WeekPicker, _Component);

    function WeekPicker(props, context) {
        (0, _classCallCheck3.default)(this, WeekPicker);

        var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call(this, props, context));

        _initialiseProps.call(_this);

        var value = (0, _util2.formatDateValue)(props.value || props.defaultValue, props.format);

        _this.state = {
            value: value,
            visible: props.visible || props.defaultVisible
        };
        return _this;
    }

    WeekPicker.getDerivedStateFromProps = function getDerivedStateFromProps(props) {
        var st = {};
        if ('value' in props) {
            st.value = (0, _util2.formatDateValue)(props.value, props.format);
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

        var previewCls = (0, _classnames3.default)(className, prefix + 'form-preview');

        var label = value ? value.format(format) : '';

        if (typeof renderPreview === 'function') {
            return _react2.default.createElement(
                'div',
                (0, _extends3.default)({}, others, { className: previewCls }),
                renderPreview(value, this.props)
            );
        }

        return _react2.default.createElement(
            'p',
            (0, _extends3.default)({}, others, { className: previewCls }),
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
            others = (0, _objectWithoutProperties3.default)(_props2, ['prefix', 'rtl', 'locale', 'label', 'state', 'format', 'defaultVisibleMonth', 'onVisibleMonthChange', 'disabledDate', 'footerRender', 'placeholder', 'size', 'disabled', 'hasClear', 'popupTriggerType', 'popupAlign', 'popupContainer', 'popupStyle', 'popupClassName', 'popupProps', 'popupComponent', 'popupContent', 'followTrigger', 'className', 'inputProps', 'monthCellRender', 'yearCellRender', 'isPreview']);
        var _state = this.state,
            visible = _state.visible,
            value = _state.value;


        var sharedInputProps = (0, _extends3.default)({}, inputProps, {
            size: size,
            disabled: disabled,
            onChange: this.onDateInputChange,
            onKeyDown: this.onKeyDown
        });

        if (rtl) {
            others.dir = 'rtl';
        }

        if (isPreview) {
            return this.renderPreview(_util.obj.pickOthers(others, WeekPicker.PropTypes));
        }

        var trigger = _react2.default.createElement(
            'div',
            { className: prefix + 'week-picker-trigger' },
            _react2.default.createElement(_input2.default, (0, _extends3.default)({}, sharedInputProps, {
                label: label,
                state: state,
                value: value ? value.format(format) : '',
                role: 'combobox',
                'aria-expanded': visible,
                readOnly: true,
                placeholder: placeholder || locale.weekPlaceholder,
                hint: _react2.default.createElement(_icon2.default, { type: 'calendar', className: prefix + 'date-picker-symbol-calendar-icon' }),
                hasClear: value && hasClear,
                className: prefix + 'week-picker-input'
            }))
        );

        var PopupComponent = popupComponent ? popupComponent : Popup;

        return _react2.default.createElement(
            'div',
            (0, _extends3.default)({}, _util.obj.pickOthers(WeekPicker.propTypes, others), {
                className: (0, _classnames3.default)(prefix + 'week-picker', className)
            }),
            _react2.default.createElement(
                PopupComponent,
                (0, _extends3.default)({
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
                popupContent ? popupContent : _react2.default.createElement(
                    'div',
                    { dir: others.dir, className: prefix + 'week-picker-body' },
                    _react2.default.createElement(_calendar2.default, {
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
}(_react.Component), _class.propTypes = (0, _extends3.default)({}, _configProvider2.default.propTypes, {
    prefix: _propTypes2.default.string,
    rtl: _propTypes2.default.bool,
    /**
     * ?????????????????????
     */
    label: _propTypes2.default.node,
    /**
     * ???????????????
     */
    state: _propTypes2.default.oneOf(['success', 'loading', 'error']),
    /**
     * ????????????
     */
    placeholder: _propTypes2.default.string,
    /**
     * ??????????????????
     * @return {MomentObject} ??????????????????????????? moment ????????????
     */
    defaultVisibleMonth: _propTypes2.default.func,
    onVisibleMonthChange: _propTypes2.default.func,
    /**
     * ?????????????????????moment ??????
     */
    value: _util2.checkDateValue,
    /**
     * ??????????????????moment ??????
     */
    defaultValue: _util2.checkDateValue,
    /**
     * ?????????????????????????????????????????????????????????
     */
    format: _propTypes2.default.string,
    /**
     * ??????????????????
     * @param {MomentObject} ?????????
     * @param {String} view ?????????????????????year: ?????? month: ???, date: ???
     * @return {Boolean} ????????????
     */
    disabledDate: _propTypes2.default.func,
    /**
     * ?????????????????????
     * @return {Node} ??????????????????????????????
     */
    footerRender: _propTypes2.default.func,
    /**
     * ???????????????????????????
     * @param {MomentObject|String} value ?????????
     */
    onChange: _propTypes2.default.func,
    /**
     * ???????????????
     */
    size: _propTypes2.default.oneOf(['small', 'medium', 'large']),
    /**
     * ????????????
     */
    disabled: _propTypes2.default.bool,
    /**
     * ????????????????????????
     */
    hasClear: _propTypes2.default.bool,
    /**
     * ??????????????????
     */
    visible: _propTypes2.default.bool,
    /**
     * ????????????????????????
     */
    defaultVisible: _propTypes2.default.bool,
    /**
     * ????????????????????????????????????
     * @param {Boolean} visible ??????????????????
     * @param {String} type ???????????????????????????????????? calendarSelect ??????????????????????????????????????? okBtnClick ?????????????????????????????? fromTrigger ?????????trigger?????????????????? docClick ?????????document???????????????
     */
    onVisibleChange: _propTypes2.default.func,
    /**
     * ??????????????????
     */
    popupTriggerType: _propTypes2.default.oneOf(['click', 'hover']),
    /**
     * ??????????????????,??????????????? OverLay??????
     */
    popupAlign: _propTypes2.default.string,
    /**
     * ????????????
     * @param {Element} target ????????????
     * @return {Element} ?????????????????????
     */
    popupContainer: _propTypes2.default.any,
    /**
     * ?????????????????????
     */
    popupStyle: _propTypes2.default.object,
    /**
     * ????????????????????????
     */
    popupClassName: _propTypes2.default.string,
    /**
     * ??????????????????
     */
    popupProps: _propTypes2.default.object,
    /**
     * ??????????????????
     */
    followTrigger: _propTypes2.default.bool,
    /**
     * ?????????????????????
     */
    inputProps: _propTypes2.default.object,
    /**
     * ???????????????????????????
     * @param {Object} value ????????????moment?????????
     * @returns {ReactNode}
     */
    dateCellRender: _propTypes2.default.func,
    /**
     * ???????????????????????????
     * @param {Object} calendarDate ?????? Calendar ??????????????????????????????
     * @returns {ReactNode}
     */
    monthCellRender: _propTypes2.default.func,
    /**
     * ??????????????????
     */
    isPreview: _propTypes2.default.bool,
    /**
     * ?????????????????????????????????
     * @param {MomentObject} value ??????
     */
    renderPreview: _propTypes2.default.func,
    yearCellRender: _propTypes2.default.func, // ?????? 0.x yearCellRender
    locale: _propTypes2.default.object,
    className: _propTypes2.default.string,
    name: _propTypes2.default.string,
    popupComponent: _propTypes2.default.elementType,
    popupContent: _propTypes2.default.node
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
    locale: _zhCn2.default.DatePicker,
    defaultVisible: false,
    onChange: _util.func.noop,
    onVisibleChange: _util.func.noop
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
        if ([_util.KEYCODE.UP, _util.KEYCODE.DOWN, _util.KEYCODE.PAGE_UP, _util.KEYCODE.PAGE_DOWN].indexOf(e.keyCode) === -1) {
            return;
        }

        if (e.altKey && [_util.KEYCODE.PAGE_UP, _util.KEYCODE.PAGE_DOWN].indexOf(e.keyCode) === -1 || e.controlKey || e.shiftKey) {
            return;
        }

        var date = _this2.state.value;

        if (date && date.isValid()) {
            var stepUnit = e.altKey ? 'year' : 'month';
            switch (e.keyCode) {
                case _util.KEYCODE.UP:
                    date.subtract(1, 'w');
                    break;
                case _util.KEYCODE.DOWN:
                    date.add(1, 'w');
                    break;
                case _util.KEYCODE.PAGE_UP:
                    date.subtract(1, stepUnit);
                    break;
                case _util.KEYCODE.PAGE_DOWN:
                    date.add(1, stepUnit);
                    break;
            }
        } else {
            date = (0, _moment2.default)();
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

            var firstDay = _moment2.default.localeData().firstDayOfWeek();
            var endDay = firstDay - 1 < 0 ? 6 : firstDay - 1;
            return _react2.default.createElement(
                'div',
                {
                    className: (0, _classnames3.default)(prefix + 'calendar-week-active-date', (_classnames = {}, _classnames[prefix + 'calendar-week-active-start'] = value.days() === _moment2.default.localeData().firstDayOfWeek(), _classnames[prefix + 'calendar-week-active-end'] = value.days() === endDay, _classnames))
                },
                _react2.default.createElement(
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
exports.default = (0, _reactLifecyclesCompat.polyfill)(WeekPicker);
module.exports = exports['default'];
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

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactLifecyclesCompat = require('react-lifecycles-compat');

var _classnames4 = require('classnames');

var _classnames5 = _interopRequireDefault(_classnames4);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _configProvider = require('../config-provider');

var _configProvider2 = _interopRequireDefault(_configProvider);

var _overlay = require('../overlay');

var _overlay2 = _interopRequireDefault(_overlay);

var _input = require('../input');

var _input2 = _interopRequireDefault(_input);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _calendar = require('../calendar');

var _calendar2 = _interopRequireDefault(_calendar);

var _zhCn = require('../locale/zh-cn');

var _zhCn2 = _interopRequireDefault(_zhCn);

var _util = require('../util');

var _util2 = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Popup = _overlay2.default.Popup;

/**
 * DatePicker.MonthPicker
 */

var MonthPicker = (_temp = _class = function (_Component) {
    (0, _inherits3.default)(MonthPicker, _Component);

    function MonthPicker(props, context) {
        (0, _classCallCheck3.default)(this, MonthPicker);

        var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call(this, props, context));

        _this.onValueChange = function (newValue) {
            var ret = _this.state.inputAsString && newValue ? newValue.format(_this.props.format) : newValue;
            _this.props.onChange(ret);
        };

        _this.onSelectCalendarPanel = function (value) {
            // const { format } = this.props;
            var prevSelectedMonth = _this.state.value;
            var selectedMonth = value.clone().date(1).hour(0).minute(0).second(0);

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

                var parsed = (0, _moment2.default)(dateInputStr, format, true);

                _this.setState({
                    dateInputStr: '',
                    inputing: false
                });

                if (parsed.isValid() && !disabledDate(parsed, 'month')) {
                    _this.handleChange(parsed, _this.state.value);
                }
            }
        };

        _this.onKeyDown = function (e) {
            var format = _this.props.format;
            var _this$state = _this.state,
                dateInputStr = _this$state.dateInputStr,
                value = _this$state.value;

            var dateStr = (0, _util2.onDateKeydown)(e, { format: format, dateInputStr: dateInputStr, value: value }, 'month');
            if (!dateStr) return;
            _this.onDateInputChange(dateStr);
        };

        _this.handleChange = function (newValue, prevValue) {
            var others = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
            var callback = arguments[3];

            if (!('value' in _this.props)) {
                _this.setState((0, _extends3.default)({
                    value: newValue
                }, others));
            } else {
                _this.setState((0, _extends3.default)({}, others));
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

        _this.onVisibleChange = function (visible, type) {
            if (!('visible' in _this.props)) {
                _this.setState({
                    visible: visible
                });
            }
            _this.props.onVisibleChange(visible, type);
        };

        _this.state = {
            value: (0, _util2.formatDateValue)(props.defaultValue, props.format),
            dateInputStr: '',
            inputing: false,
            visible: props.defaultVisible,
            inputAsString: typeof props.defaultValue === 'string'
        };
        return _this;
    }

    MonthPicker.getDerivedStateFromProps = function getDerivedStateFromProps(props) {
        var states = {};
        if ('value' in props) {
            states.value = (0, _util2.formatDateValue)(props.value, props.format);
            states.inputAsString = typeof props.value === 'string';
        }

        if ('visible' in props) {
            states.visible = props.visible;
        }

        return states;
    };

    MonthPicker.prototype.renderPreview = function renderPreview(others) {
        var _props = this.props,
            prefix = _props.prefix,
            format = _props.format,
            className = _props.className,
            renderPreview = _props.renderPreview;
        var value = this.state.value;

        var previewCls = (0, _classnames5.default)(className, prefix + 'form-preview');

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

    MonthPicker.prototype.render = function render() {
        var _classnames, _classnames2, _classnames3;

        var _props2 = this.props,
            prefix = _props2.prefix,
            rtl = _props2.rtl,
            locale = _props2.locale,
            label = _props2.label,
            state = _props2.state,
            format = _props2.format,
            defaultVisibleYear = _props2.defaultVisibleYear,
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
            dateInputAriaLabel = _props2.dateInputAriaLabel,
            isPreview = _props2.isPreview,
            others = (0, _objectWithoutProperties3.default)(_props2, ['prefix', 'rtl', 'locale', 'label', 'state', 'format', 'defaultVisibleYear', 'disabledDate', 'footerRender', 'placeholder', 'size', 'disabled', 'hasClear', 'popupTriggerType', 'popupAlign', 'popupContainer', 'popupStyle', 'popupClassName', 'popupProps', 'popupComponent', 'popupContent', 'followTrigger', 'className', 'inputProps', 'monthCellRender', 'yearCellRender', 'dateInputAriaLabel', 'isPreview']);
        var _state = this.state,
            visible = _state.visible,
            value = _state.value,
            dateInputStr = _state.dateInputStr,
            inputing = _state.inputing;


        var monthPickerCls = (0, _classnames5.default)((_classnames = {}, _classnames[prefix + 'month-picker'] = true, _classnames), className);

        var triggerInputCls = (0, _classnames5.default)((_classnames2 = {}, _classnames2[prefix + 'month-picker-input'] = true, _classnames2[prefix + 'error'] = false, _classnames2));

        var panelBodyClassName = (0, _classnames5.default)((_classnames3 = {}, _classnames3[prefix + 'month-picker-body'] = true, _classnames3));

        if (rtl) {
            others.dir = 'rtl';
        }

        if (isPreview) {
            return this.renderPreview(_util.obj.pickOthers(others, MonthPicker.PropTypes));
        }

        var panelInputCls = prefix + 'month-picker-panel-input';

        var sharedInputProps = (0, _extends3.default)({}, inputProps, {
            size: size,
            disabled: disabled,
            onChange: this.onDateInputChange,
            onBlur: this.onDateInputBlur,
            onPressEnter: this.onDateInputBlur,
            onKeyDown: this.onKeyDown
        });

        var dateInputValue = inputing ? dateInputStr : value && value.format(format) || '';
        var triggerInputValue = dateInputValue;

        var dateInput = _react2.default.createElement(_input2.default, (0, _extends3.default)({}, sharedInputProps, {
            value: dateInputValue,
            'aria-label': dateInputAriaLabel,
            onFocus: this.onFoucsDateInput,
            placeholder: format,
            className: panelInputCls
        }));

        var datePanel = _react2.default.createElement(_calendar2.default, {
            shape: 'panel',
            modes: ['month', 'year'],
            monthCellRender: monthCellRender,
            yearCellRender: yearCellRender,
            value: value,
            onSelect: this.onSelectCalendarPanel,
            defaultVisibleMonth: defaultVisibleYear,
            disabledDate: disabledDate
        });

        var panelBody = datePanel;
        var panelFooter = footerRender();

        var allowClear = value && hasClear;
        var trigger = _react2.default.createElement(
            'div',
            { className: prefix + 'month-picker-trigger' },
            _react2.default.createElement(_input2.default, (0, _extends3.default)({}, sharedInputProps, {
                label: label,
                state: state,
                readOnly: true,
                value: triggerInputValue,
                placeholder: placeholder || locale.monthPlaceholder,
                hint: _react2.default.createElement(_icon2.default, {
                    type: 'calendar',
                    className: prefix + 'date-picker-symbol-calendar-icon'
                }),
                hasClear: allowClear,
                className: triggerInputCls
            }))
        );

        var PopupComponent = popupComponent ? popupComponent : Popup;

        return _react2.default.createElement(
            'div',
            (0, _extends3.default)({}, _util.obj.pickOthers(MonthPicker.propTypes, others), {
                className: monthPickerCls
            }),
            _react2.default.createElement(
                PopupComponent,
                (0, _extends3.default)({
                    autoFocus: true,
                    align: popupAlign
                }, popupProps, {
                    followTrigger: followTrigger,
                    role: 'combobox',
                    'aria-expanded': visible,
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
                    { className: panelBodyClassName, dir: others.dir },
                    _react2.default.createElement(
                        'div',
                        {
                            className: prefix + 'month-picker-panel-header'
                        },
                        dateInput
                    ),
                    panelBody,
                    panelFooter
                )
            )
        );
    };

    return MonthPicker;
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
    defaultVisibleYear: _propTypes2.default.func,
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
     * @param {String} type ???????????????????????????????????? calendarSelect ??????????????????????????????????????? fromTrigger ?????????trigger?????????????????? docClick ?????????document???????????????
     */
    onVisibleChange: _propTypes2.default.func,
    /**
     * ??????????????????
     */
    popupTriggerType: _propTypes2.default.oneOf(['click', 'hover']),
    /**
     * ??????????????????, ??????????????? OverLay??????
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
     * @param {Object} calendarDate ?????? Calendar ??????????????????????????????
     * @returns {ReactNode}
     */
    monthCellRender: _propTypes2.default.func,
    yearCellRender: _propTypes2.default.func, // ?????? 0.x yearCellRender
    /**
     * ?????????????????? aria-label ??????
     */
    dateInputAriaLabel: _propTypes2.default.string,
    /**
     * ??????????????????
     */
    isPreview: _propTypes2.default.bool,
    /**
     * ?????????????????????????????????
     * @param {MomentObject} value ??????
     */
    renderPreview: _propTypes2.default.func,
    locale: _propTypes2.default.object,
    className: _propTypes2.default.string,
    name: _propTypes2.default.string,
    popupComponent: _propTypes2.default.elementType,
    popupContent: _propTypes2.default.node
}), _class.defaultProps = {
    prefix: 'next-',
    rtl: false,
    format: 'YYYY-MM',
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
    onChange: _util.func.noop,
    onVisibleChange: _util.func.noop
}, _temp);
MonthPicker.displayName = 'MonthPicker';
exports.default = (0, _reactLifecyclesCompat.polyfill)(MonthPicker);
module.exports = exports['default'];
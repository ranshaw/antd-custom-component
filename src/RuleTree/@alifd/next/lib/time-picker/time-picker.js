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

var _reactLifecyclesCompat = require('react-lifecycles-compat');

var _classnames3 = require('classnames');

var _classnames4 = _interopRequireDefault(_classnames3);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _configProvider = require('../config-provider');

var _configProvider2 = _interopRequireDefault(_configProvider);

var _input = require('../input');

var _input2 = _interopRequireDefault(_input);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _overlay = require('../overlay');

var _overlay2 = _interopRequireDefault(_overlay);

var _zhCn = require('../locale/zh-cn');

var _zhCn2 = _interopRequireDefault(_zhCn);

var _util = require('../util');

var _panel = require('./panel');

var _panel2 = _interopRequireDefault(_panel);

var _utils = require('./utils');

var _util2 = require('../date-picker/util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Popup = _overlay2.default.Popup;
var noop = _util.func.noop;

var timePickerLocale = _zhCn2.default.TimePicker;

/**
 * TimePicker
 */
var TimePicker = (_temp = _class = function (_Component) {
    (0, _inherits3.default)(TimePicker, _Component);

    function TimePicker(props, context) {
        (0, _classCallCheck3.default)(this, TimePicker);

        var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call(this, props, context));

        _initialiseProps.call(_this);

        var value = (0, _utils.formatDateValue)(props.value || props.defaultValue, props.format);
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
            state.value = (0, _utils.formatDateValue)(props.value, props.format);
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

        var previewCls = (0, _classnames4.default)(className, prefix + 'form-preview');

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
            others = (0, _objectWithoutProperties3.default)(_props2, ['prefix', 'label', 'state', 'placeholder', 'size', 'format', 'hasClear', 'hourStep', 'minuteStep', 'secondStep', 'disabledHours', 'disabledMinutes', 'disabledSeconds', 'renderTimeMenuItems', 'inputProps', 'popupAlign', 'popupTriggerType', 'popupContainer', 'popupStyle', 'popupClassName', 'popupProps', 'popupComponent', 'popupContent', 'followTrigger', 'disabled', 'className', 'locale', 'rtl', 'isPreview']);
        var _state = this.state,
            value = _state.value,
            inputStr = _state.inputStr,
            inputing = _state.inputing,
            visible = _state.visible;


        var triggerCls = (0, _classnames4.default)((_classnames = {}, _classnames[prefix + 'time-picker-trigger'] = true, _classnames));

        if (rtl) {
            others.dir = 'rtl';
        }

        if (isPreview) {
            return this.renderPreview(_util.obj.pickOthers(others, TimePicker.PropTypes));
        }

        var inputValue = inputing ? inputStr : value && value.format(format) || '';
        var sharedInputProps = (0, _extends3.default)({}, inputProps, {
            size: size,
            disabled: disabled,
            value: inputValue,
            hasClear: value && hasClear,
            onChange: this.onInputChange,
            onBlur: this.onInputBlur,
            onPressEnter: this.onInputBlur,
            onKeyDown: this.onKeyown,
            hint: _react2.default.createElement(_icon2.default, {
                type: 'clock',
                className: prefix + 'time-picker-symbol-clock-icon'
            })
        });

        var triggerInput = _react2.default.createElement(
            'div',
            { className: triggerCls },
            _react2.default.createElement(_input2.default, (0, _extends3.default)({}, sharedInputProps, {
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

        var classNames = (0, _classnames4.default)((_classnames2 = {}, _classnames2[prefix + 'time-picker'] = true, _classnames2[prefix + 'time-picker-' + size] = size, _classnames2[prefix + 'disabled'] = disabled, _classnames2), className);

        var PopupComponent = popupComponent ? popupComponent : Popup;

        return _react2.default.createElement(
            'div',
            (0, _extends3.default)({}, _util.obj.pickOthers(TimePicker.propTypes, others), {
                className: classNames
            }),
            _react2.default.createElement(
                PopupComponent,
                (0, _extends3.default)({
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
                popupContent ? popupContent : _react2.default.createElement(
                    'div',
                    {
                        dir: others.dir,
                        className: prefix + 'time-picker-body'
                    },
                    _react2.default.createElement(
                        'div',
                        {
                            className: prefix + 'time-picker-panel-header'
                        },
                        _react2.default.createElement(_input2.default, (0, _extends3.default)({}, sharedInputProps, {
                            placeholder: format,
                            className: prefix + 'time-picker-panel-input'
                        }))
                    ),
                    _react2.default.createElement(_panel2.default, panelProps)
                )
            )
        );
    };

    return TimePicker;
}(_react.Component), _class.propTypes = (0, _extends3.default)({}, _configProvider2.default.propTypes, {
    prefix: _propTypes2.default.string,
    rtl: _propTypes2.default.bool,
    /**
     * ???????????????
     */
    label: _propTypes2.default.node,
    /**
     * ???????????????
     */
    state: _propTypes2.default.oneOf(['error', 'success']),
    /**
     * ???????????????
     */
    placeholder: _propTypes2.default.string,
    /**
     * ????????????moment ????????????????????????????????????????????????
     */
    value: _utils.checkDateValue,
    /**
     * ???????????????moment ???????????????????????????????????????????????????
     */
    defaultValue: _utils.checkDateValue,
    /**
     * ????????????????????????
     */
    size: _propTypes2.default.oneOf(['small', 'medium', 'large']),
    /**
     * ????????????????????????
     */
    hasClear: _propTypes2.default.bool,
    /**
     * ???????????????
     * https://momentjs.com/docs/#/parsing/string-format/
     */
    format: _propTypes2.default.string,
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
     * ??????????????????
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
     * ??????????????????????????????
     */
    visible: _propTypes2.default.bool,
    /**
     * ???????????????????????????????????????
     */
    defaultVisible: _propTypes2.default.bool,
    /**
     * ????????????
     * @param {Object} target ????????????
     * @return {ReactNode} ????????????
     */
    popupContainer: _propTypes2.default.any,
    /**
     * ??????????????????, ?????????Overlay ??????
     */
    popupAlign: _propTypes2.default.string,
    /**
     * ??????????????????
     */
    popupTriggerType: _propTypes2.default.oneOf(['click', 'hover']),
    /**
     * ????????????????????????????????????
     * @param {Boolean} visible ???????????????????????????
     * @param {String} type ???????????????????????????????????? fromTrigger ?????????trigger?????????????????? docClick ?????????document???????????????
     */
    onVisibleChange: _propTypes2.default.func,
    /**
     * ?????????????????????
     */
    popupStyle: _propTypes2.default.object,
    /**
     * ????????????????????????
     */
    popupClassName: _propTypes2.default.string,
    /**
     * ????????????
     */
    popupProps: _propTypes2.default.object,
    /**
     * ??????????????????
     */
    followTrigger: _propTypes2.default.bool,
    /**
     * ????????????
     */
    disabled: _propTypes2.default.bool,
    /**
     * ??????????????????
     */
    isPreview: _propTypes2.default.bool,
    /**
     * ?????????????????????????????????
     * @param {MomentObject} value ??????
     */
    renderPreview: _propTypes2.default.func,
    /**
     * ???????????????????????????
     * @param {Object|String} value ??????????????????????????????
     */
    onChange: _propTypes2.default.func,
    className: _propTypes2.default.string,
    name: _propTypes2.default.string,
    inputProps: _propTypes2.default.object,
    popupComponent: _propTypes2.default.elementType,
    popupContent: _propTypes2.default.node
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

            var parsed = (0, _moment2.default)(inputStr, format, true);
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
        var timeStr = (0, _util2.onTimeKeydown)(e, {
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
exports.default = (0, _reactLifecyclesCompat.polyfill)(TimePicker);
module.exports = exports['default'];
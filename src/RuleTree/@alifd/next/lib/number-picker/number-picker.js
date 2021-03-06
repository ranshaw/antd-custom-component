'use strict';

exports.__esModule = true;

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

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _bignumber = require('bignumber.js');

var _bignumber2 = _interopRequireDefault(_bignumber);

var _reactLifecyclesCompat = require('react-lifecycles-compat');

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _button = require('../button');

var _button2 = _interopRequireDefault(_button);

var _input = require('../input');

var _input2 = _interopRequireDefault(_input);

var _util = require('../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1;
var MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER || -Math.pow(2, 53) + 1;

var isNil = _util.obj.isNil;
/** NumberPicker */

var NumberPicker = (_temp = _class = function (_React$Component) {
    (0, _inherits3.default)(NumberPicker, _React$Component);

    function NumberPicker(props) {
        (0, _classCallCheck3.default)(this, NumberPicker);

        var _this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call(this, props));

        var defaultValue = props.defaultValue,
            stringMode = props.stringMode;


        var value = void 0;
        if ('value' in props) {
            value = props.value;
        } else {
            value = defaultValue;
        }
        value = value === undefined || value === null ? '' : stringMode ? '' + value : value;
        _this.state = {
            value: value,
            hasFocused: false,
            onlyDisplay: false,
            displayValue: value,
            max: stringMode ? Infinity : MAX_SAFE_INTEGER,
            min: stringMode ? -Infinity : MIN_SAFE_INTEGER
        };
        return _this;
    }

    NumberPicker.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, prevState) {
        // ????????????????????????render??????????????????onChange??????????????????????????????????????????value
        if (prevState.onlyDisplay) {
            return {
                value: prevState.value,
                displayValue: prevState.displayValue,
                onlyDisplay: false
            };
        }

        var state = {};
        var value = nextProps.value,
            stringMode = nextProps.stringMode;
        // ????????????render??????

        if ('value' in nextProps && '' + nextProps.value !== '' + prevState.value) {
            var newValue = value === undefined || value === null ? '' : stringMode ? '' + value : value;
            state.value = newValue;
            state.displayValue = newValue;
        }

        // ?????????undefined???null?????????????????????????????????
        var min = nextProps.min,
            max = nextProps.max;

        if ('min' in nextProps && min !== prevState.min) {
            state.min = !isNil(min) ? min : stringMode ? Infinity : MIN_SAFE_INTEGER;
        }

        if ('max' in nextProps && max !== prevState.max) {
            state.max = !isNil(max) ? max : stringMode ? Infinity : MAX_SAFE_INTEGER;
        }

        if (Object.keys(state).length) {
            return state;
        }

        return null;
    };

    NumberPicker.prototype.isGreaterThan = function isGreaterThan(v1, v2) {
        var stringMode = this.props.stringMode;

        if (stringMode) return (0, _bignumber2.default)(v1).isGreaterThan((0, _bignumber2.default)(v2));
        return Number(v1) > Number(v2);
    };

    NumberPicker.prototype.correctBoundary = function correctBoundary(value) {
        var _state = this.state,
            max = _state.max,
            min = _state.min;

        return this.isGreaterThan(min, value) ? min : this.isGreaterThan(value, max) ? max : value;
    };

    NumberPicker.prototype.setFocus = function setFocus(status) {
        var format = this.props.format;
        // Only trigger `setState` if `format` is settled to avoid unnecessary rendering

        if (typeof format === 'function') {
            this.setState({
                hasFocused: status
            });
        }
    };

    NumberPicker.prototype.onFocus = function onFocus(e) {
        var onFocus = this.props.onFocus;

        this.setFocus(true);

        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        onFocus && onFocus.apply(undefined, [e].concat(args));
    };

    NumberPicker.prototype.onBlur = function onBlur(e) {
        var _props = this.props,
            editable = _props.editable,
            stringMode = _props.stringMode;

        var displayValue = '' + this.state.displayValue;
        // ?????????????????????????????????????????????Blur?????????onChange
        // ?????????????????????????????????????????????
        if (editable === true && !isNaN(displayValue) && !this.shouldFireOnChange(displayValue) && !this.withinMinMax(displayValue)) {
            var valueCorrected = this.correctValue(displayValue);
            valueCorrected = stringMode ? (0, _bignumber2.default)(valueCorrected).toFixed(this.getPrecision()) : valueCorrected;
            if (this.state.value !== valueCorrected) {
                this.setValue({ value: valueCorrected, e: e });
            }
            this.setDisplayValue({ displayValue: valueCorrected });
        } else {
            this.setDisplayValue({ displayValue: this.state.value });
        }
        this.setFocus(false);
        var onBlur = this.props.onBlur;

        for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
        }

        onBlur && onBlur.apply(undefined, [e].concat(args));
    };

    NumberPicker.prototype.withinMinMax = function withinMinMax(value) {
        var _state2 = this.state,
            max = _state2.max,
            min = _state2.min;

        if (isNaN(value) || this.isGreaterThan(value, max) || this.isGreaterThan(min, value)) return false;
        return true;
    };

    NumberPicker.prototype.setDisplayValue = function setDisplayValue(_ref) {
        var displayValue = _ref.displayValue,
            _ref$onlyDisplay = _ref.onlyDisplay,
            onlyDisplay = _ref$onlyDisplay === undefined ? false : _ref$onlyDisplay;

        this.setState({ displayValue: displayValue, onlyDisplay: onlyDisplay });
    };

    NumberPicker.prototype.getDisplayValue = function getDisplayValue() {
        var _state3 = this.state,
            displayValue = _state3.displayValue,
            hasFocused = _state3.hasFocused;
        var format = this.props.format;


        return typeof format === 'function' && !hasFocused ? format(displayValue) : // ????????????input???number?????????-0????????????0
        typeof displayValue === 'number' && 1 / displayValue === -Infinity ? '-0' : displayValue;
    };

    NumberPicker.prototype.shouldFireOnChange = function shouldFireOnChange(value) {
        // ?????????onChange???a.?????????  b.???????????????????????????
        if (isNaN(value) || !this.withinMinMax(value)) {
            return false;
        }
        return true;
    };

    NumberPicker.prototype.onChange = function onChange(value, e) {
        // ignore space & Compatible Chinese Input Method
        value = value.replace('???', '.').trim();
        var onlyDisplay = false;
        if (this.props.editable === true && this.shouldFireOnChange(value)) {
            var valueCorrected = this.correctValue(value);
            if (this.state.value !== valueCorrected) {
                this.setValue({ value: valueCorrected, e: e });
            }
        } else {
            onlyDisplay = true;
        }

        // ????????????????????????????????????????????????????????????????????????input.value???????????????????????????string
        // if (`${valueCorrected}` === value) value = valueCorrected;

        this.setDisplayValue({ displayValue: value, onlyDisplay: onlyDisplay });
    };

    NumberPicker.prototype.correctValue = function correctValue(value) {
        var val = value;

        // take care of isNaN('')=false
        if (val !== '') {
            // ?????????????????????cut??????????????????
            var precisionSet = this.getPrecision();
            var precisionCurrent = value.length - value.indexOf('.') - 1;
            var dotIndex = value.indexOf('.');
            // precision === 0 should cut '.' for stringMode
            var cutPosition = precisionSet !== 0 ? dotIndex + 1 + precisionSet : dotIndex + precisionSet;
            if (dotIndex > -1 && precisionCurrent > precisionSet) val = val.substr(0, cutPosition);

            // ???????????????
            val = this.correctBoundary(val);
            val = this.props.stringMode ? (0, _bignumber2.default)(val).toFixed() : Number(val);
        }

        if (isNaN(val)) val = this.state.value;

        if ('' + val !== '' + value) {
            // .0* ??? .x0* ????????????onCorrect
            if (!/\.[0-9]*0+$/g.test(value)) {
                this.props.onCorrect({
                    currentValue: val,
                    oldValue: value
                });
            }
        }

        return val;
    };

    NumberPicker.prototype.setValue = function setValue(_ref2) {
        var value = _ref2.value,
            e = _ref2.e,
            triggerType = _ref2.triggerType;

        if (!('value' in this.props) || value === this.props.value) {
            this.setState({
                value: value
            });
        }

        this.props.onChange(isNaN(value) || value === '' ? undefined : value, (0, _extends3.default)({}, e, {
            triggerType: triggerType
        }));
    };

    NumberPicker.prototype.getPrecision = function getPrecision() {
        var stepString = this.props.step.toString();
        if (stepString.indexOf('e-') >= 0) {
            return parseInt(stepString.slice(stepString.indexOf('e-')), 10);
        }
        var precision = 0;
        if (stepString.indexOf('.') >= 0) {
            precision = stepString.length - stepString.indexOf('.') - 1;
        }

        return Math.max(precision, this.props.precision);
    };

    NumberPicker.prototype.getPrecisionFactor = function getPrecisionFactor() {
        var precision = this.getPrecision();
        return Math.pow(10, precision);
    };

    NumberPicker.prototype.onKeyDown = function onKeyDown(e) {
        var _props2;

        if (e.keyCode === 38) {
            this.up(false, e);
        } else if (e.keyCode === 40) {
            this.down(false, e);
        }

        for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
            args[_key3 - 1] = arguments[_key3];
        }

        (_props2 = this.props).onKeyDown.apply(_props2, [e].concat(args));
    };

    NumberPicker.prototype.up = function up(disabled, e) {
        this.step('up', disabled, e);
    };

    NumberPicker.prototype.down = function down(disabled, e) {
        this.step('down', disabled, e);
    };

    NumberPicker.prototype.step = function step(type, disabled, e) {
        if (e) {
            e.preventDefault();
        }

        var onDisabled = this.props.onDisabled;

        if (disabled) {
            return onDisabled(e);
        }

        var value = this.state.value;
        // ???????????????????????????????????????
        if (isNaN(value)) {
            return;
        }

        var val = this[type + 'Step'](value);
        val = this.correctBoundary(val);
        this.setDisplayValue({ displayValue: val });
        this.setValue({ value: val, e: e, triggerType: type });
    };

    NumberPicker.prototype.upStep = function upStep(val) {
        var _props3 = this.props,
            step = _props3.step,
            stringMode = _props3.stringMode;

        var precisionFactor = this.getPrecisionFactor();
        if (typeof val === 'number' && !stringMode) {
            var result = (precisionFactor * val + precisionFactor * step) / precisionFactor;
            return this.hackChrome(result);
        }
        return (0, _bignumber2.default)(val || '0').plus(step).toFixed(this.getPrecision());
    };

    NumberPicker.prototype.downStep = function downStep(val) {
        var _props4 = this.props,
            step = _props4.step,
            stringMode = _props4.stringMode;

        var precisionFactor = this.getPrecisionFactor();
        if (typeof val === 'number' && !stringMode) {
            var result = (precisionFactor * val - precisionFactor * step) / precisionFactor;
            return this.hackChrome(result);
        }
        return (0, _bignumber2.default)(val || '0').minus(step).toFixed(this.getPrecision());
    };

    /**
     * fix bug in chrome browser
     * 0.28 + 0.01 = 0.29000000000000004
     * 0.29 - 0.01 = 0.27999999999999997
     * @param {Number} value value
     */


    NumberPicker.prototype.hackChrome = function hackChrome(value) {
        var precision = this.getPrecision();
        if (precision > 0) {
            return Number(Number(value).toFixed(precision));
        }
        return value;
    };

    NumberPicker.prototype.focus = function focus() {
        this.inputRef.getInstance().focus();
    };

    NumberPicker.prototype.saveInputRef = function saveInputRef(ref) {
        this.inputRef = ref;
    };

    NumberPicker.prototype.getInputNode = function getInputNode() {
        return this.inputRef;
    };

    NumberPicker.prototype.handleMouseDown = function handleMouseDown(e) {
        e.preventDefault();
    };

    NumberPicker.prototype.render = function render() {
        var _classNames, _classNames2;

        var _props5 = this.props,
            device = _props5.device,
            prefix = _props5.prefix,
            rtl = _props5.rtl,
            disabled = _props5.disabled,
            style = _props5.style,
            className = _props5.className,
            size = _props5.size,
            autoFocus = _props5.autoFocus,
            editable = _props5.editable,
            state = _props5.state,
            label = _props5.label,
            _props5$upBtnProps = _props5.upBtnProps,
            upBtnProps = _props5$upBtnProps === undefined ? {} : _props5$upBtnProps,
            _props5$downBtnProps = _props5.downBtnProps,
            downBtnProps = _props5$downBtnProps === undefined ? {} : _props5$downBtnProps,
            innerAfter = _props5.innerAfter,
            isPreview = _props5.isPreview,
            renderPreview = _props5.renderPreview,
            hasTrigger = _props5.hasTrigger,
            alwaysShowTrigger = _props5.alwaysShowTrigger;
        var _state4 = this.state,
            max = _state4.max,
            min = _state4.min;

        var type = device === 'phone' || this.props.type === 'inline' ? 'inline' : 'normal';

        var prefixCls = prefix + 'number-picker';

        var cls = (0, _classnames2.default)((_classNames = {}, _classNames[prefixCls] = true, _classNames[prefixCls + '-' + type] = type, _classNames['' + prefix + size] = true, _classNames[prefixCls + '-show-trigger'] = alwaysShowTrigger, _classNames[prefixCls + '-no-trigger'] = !hasTrigger, _classNames[prefix + 'disabled'] = disabled, _classNames[className] = className, _classNames));

        var upDisabled = false;
        var downDisabled = false;
        var value = this.state.value;
        if (!isNaN(value)) {
            if (!this.isGreaterThan(max, value)) {
                upDisabled = true;
            }
            if (this.isGreaterThan(min, value) || min === value) {
                downDisabled = true;
            }
        }

        var extra = null,
            innerAfterClassName = null,
            addonBefore = null,
            addonAfter = null;
        if (type === 'normal') {
            extra = _react2.default.createElement(
                'span',
                { className: prefixCls + '-handler' },
                _react2.default.createElement(
                    _button2.default,
                    (0, _extends3.default)({}, upBtnProps, {
                        onMouseDown: this.handleMouseDown,
                        disabled: disabled,
                        className: (upBtnProps.className || '') + ' ' + (upDisabled ? 'disabled' : ''),
                        onClick: this.up.bind(this, upDisabled),
                        tabIndex: -1
                    }),
                    _react2.default.createElement(_icon2.default, { type: 'arrow-up', className: prefixCls + '-up-icon' })
                ),
                _react2.default.createElement(
                    _button2.default,
                    (0, _extends3.default)({}, downBtnProps, {
                        onMouseDown: this.handleMouseDown,
                        disabled: disabled,
                        className: (downBtnProps.className || '') + ' ' + (downDisabled ? 'disabled' : ''),
                        onClick: this.down.bind(this, downDisabled),
                        tabIndex: -1
                    }),
                    _react2.default.createElement(_icon2.default, { type: 'arrow-down', className: prefixCls + '-down-icon' })
                )
            );
        } else {
            addonBefore = _react2.default.createElement(
                _button2.default,
                (0, _extends3.default)({}, downBtnProps, {
                    size: size,
                    disabled: disabled,
                    className: (downBtnProps.className || '') + ' ' + (downDisabled ? 'disabled' : ''),
                    onClick: this.down.bind(this, downDisabled),
                    tabIndex: -1
                }),
                _react2.default.createElement(_icon2.default, { type: 'minus', className: prefixCls + '-minus-icon' })
            );
            addonAfter = _react2.default.createElement(
                _button2.default,
                (0, _extends3.default)({}, upBtnProps, {
                    size: size,
                    disabled: disabled,
                    className: (upBtnProps.className || '') + ' ' + (upDisabled ? 'disabled' : ''),
                    onClick: this.up.bind(this, upDisabled),
                    tabIndex: -1
                }),
                _react2.default.createElement(_icon2.default, { type: 'add', className: prefixCls + '-add-icon' })
            );
        }

        var others = _util.obj.pickOthers(NumberPicker.propTypes, this.props);
        var dataAttrs = _util.obj.pickAttrsWith(this.props, 'data-');

        var previewCls = (0, _classnames2.default)((_classNames2 = {}, _classNames2[prefix + 'form-preview'] = true, _classNames2[className] = !!className, _classNames2));

        if (isPreview) {
            if (typeof renderPreview === 'function') {
                return _react2.default.createElement(
                    'div',
                    (0, _extends3.default)({}, others, { style: style, className: previewCls }),
                    renderPreview(this.getDisplayValue(), this.props)
                );
            }
            return _react2.default.createElement(
                'p',
                (0, _extends3.default)({}, others, { style: { style: style }, className: previewCls }),
                this.getDisplayValue()
            );
        }

        return _react2.default.createElement(
            'span',
            (0, _extends3.default)({ className: cls, style: style, dir: rtl ? 'rtl' : undefined }, dataAttrs),
            _react2.default.createElement(_input2.default, (0, _extends3.default)({}, others, {
                hasClear: false,
                'aria-valuemax': max,
                'aria-valuemin': min,
                state: state === 'error' ? 'error' : null,
                onBlur: this.onBlur.bind(this),
                onFocus: this.onFocus.bind(this),
                onKeyDown: this.onKeyDown.bind(this),
                autoFocus: autoFocus,
                readOnly: !editable,
                value: this.getDisplayValue(),
                disabled: disabled,
                size: size,
                onChange: this.onChange.bind(this),
                ref: this.saveInputRef.bind(this),
                label: label,
                innerAfter: innerAfter,
                extra: hasTrigger ? extra : null,
                addonBefore: addonBefore,
                addonAfter: addonAfter,
                composition: true
            }))
        );
    };

    return NumberPicker;
}(_react2.default.Component), _class.propTypes = {
    /**
     * ????????????
     */
    prefix: _propTypes2.default.string,
    /**
     * ????????????(??? device ??? phone ??????NumberPicker ?????????????????? normal??????????????? type ??????)
     * @enumdesc ??????, ??????
     */
    type: _propTypes2.default.oneOf(['normal', 'inline']),
    /**
     * ??????
     */
    size: _propTypes2.default.oneOf(['large', 'medium', 'small']),
    /**
     * ?????????
     */
    value: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
    /**
     * ?????????
     */
    defaultValue: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
    /**
     * ????????????
     */
    disabled: _propTypes2.default.bool,
    /**
     * ??????
     */
    step: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
    /**
     * ????????????????????????
     */
    precision: _propTypes2.default.number,
    /**
     * ????????????????????????
     */
    editable: _propTypes2.default.bool,
    /**
     * ????????????
     */
    autoFocus: _propTypes2.default.bool,
    /**
     * ????????????????????????
     * @param {Number|String} value ??????
     * @param {Event} e DOM????????????
     */
    onChange: _propTypes2.default.func,
    /**
     * ????????????
     * @param {Event} e DOM????????????
     */
    onKeyDown: _propTypes2.default.func,
    /**
     * ????????????
     * @param {Event} e DOM????????????
     */
    onFocus: _propTypes2.default.func,
    /**
     * ????????????
     * @param {Event} e DOM????????????
     */
    onBlur: _propTypes2.default.func,
    /**
     * ????????????????????????
     * @param {Object} obj {currentValue,oldValue:String}
     */
    onCorrect: _propTypes2.default.func,
    onDisabled: _propTypes2.default.func, // ??????0.x onDisabled
    /**
     * ?????????
     */
    max: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
    /**
     * ?????????
     */
    min: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
    /**
     * ?????????class
     */
    className: _propTypes2.default.string,
    /**
     * ?????????????????????
     */
    style: _propTypes2.default.object,
    state: _propTypes2.default.oneOf(['error']),
    /**
     * ??????????????????
     * @param {Number} value
     * @return {String|Number}
     */
    format: _propTypes2.default.func,
    /**
     * ???????????????props
     */
    upBtnProps: _propTypes2.default.object,
    /**
     * ???????????????props
     */
    downBtnProps: _propTypes2.default.object,
    /**
     * ?????? ??????label
     */
    label: _propTypes2.default.node,
    /**
     * ?????? ??????????????????
     */
    innerAfter: _propTypes2.default.node,
    rtl: _propTypes2.default.bool,
    /**
     * ??????????????????
     */
    isPreview: _propTypes2.default.bool,
    /**
     * ?????????????????????????????????
     * @param {Number|String} value ?????????
     * @param {Object} props ?????????????????????
     * @returns {reactNode} Element ????????????
     */
    renderPreview: _propTypes2.default.func,
    /**
     * ??????????????????
     */
    device: _propTypes2.default.oneOf(['phone', 'tablet', 'desktop']),
    /**
     * ????????????????????????
     */
    hasTrigger: _propTypes2.default.bool,
    /**
     * ??????????????????????????????(??????hover)
     */
    alwaysShowTrigger: _propTypes2.default.bool,
    /**
     * ???????????????????????????????????????string??????
     * @version 1.24
     */
    stringMode: _propTypes2.default.bool
}, _class.defaultProps = {
    prefix: 'next-',
    // max: MAX_SAFE_INTEGER,
    // min: MIN_SAFE_INTEGER,
    type: 'normal',
    size: 'medium',
    step: 1,
    style: {},
    precision: 0,
    editable: true,
    onChange: _util.func.noop,
    onKeyDown: _util.func.noop,
    onBlur: _util.func.noop,
    onCorrect: _util.func.noop,
    onDisabled: _util.func.noop,
    hasTrigger: true,
    alwaysShowTrigger: false,
    stringMode: false
}, _temp);
NumberPicker.displayName = 'NumberPicker';
exports.default = (0, _reactLifecyclesCompat.polyfill)(NumberPicker);
module.exports = exports['default'];
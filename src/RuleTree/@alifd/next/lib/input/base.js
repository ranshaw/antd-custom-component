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

var _class, _temp2;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactLifecyclesCompat = require('react-lifecycles-compat');

var _configProvider = require('../config-provider');

var _configProvider2 = _interopRequireDefault(_configProvider);

var _util = require('../util');

var _zhCn = require('../locale/zh-cn');

var _zhCn2 = _interopRequireDefault(_zhCn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Base = (_temp2 = _class = function (_React$Component) {
    (0, _inherits3.default)(Base, _React$Component);

    function Base() {
        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, Base);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.handleCompositionStart = function (e) {
            _this.setState({
                composition: true
            });
            _this.props.onCompositionStart(e);
        }, _this.handleCompositionEnd = function (e) {
            _this.setState({
                composition: false
            });
            _this.props.onCompositionEnd(e);

            var value = e.target.value;
            _this.props.onChange(value, e);
        }, _this.saveRef = function (input) {
            _this.inputRef = input;
        }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
    }

    Base.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, prevState) {
        if ('value' in nextProps && nextProps.value !== prevState.value && !prevState.composition) {
            var value = nextProps.value;
            return {
                value: value === undefined || value === null ? '' : value
            };
        }

        return null;
    };

    Base.prototype.ieHack = function ieHack(value) {
        return value;
    };

    Base.prototype.onChange = function onChange(e) {
        if ('stopPropagation' in e) {
            e.stopPropagation();
        } else if ('cancelBubble' in e) {
            e.cancelBubble();
        }

        var value = e.target.value;

        if (this.props.trim) {
            value = value.trim();
        }

        value = this.ieHack(value);

        // not controlled
        if (!('value' in this.props) || this.state.composition) {
            this.setState({
                value: value
            });
        }

        if (this.state.composition) {
            return;
        }

        // Number('') = 0
        if (value && this.props.htmlType === 'number') {
            value = Number(value);
        }

        this.props.onChange(value, e);
    };

    Base.prototype.onKeyDown = function onKeyDown(e) {
        var value = e.target.value;
        var maxLength = this.props.maxLength;

        var len = maxLength > 0 && value ? this.getValueLength(value) : 0;
        var opts = {};

        // has enable trim and has input whitespace
        if (this.props.trim && e.keyCode === 32) {
            opts.beTrimed = true;
        }

        // has defined maxLength and has over max length and has not input backspace and delete
        if (maxLength > 0 && (len > maxLength + 1 || (len === maxLength || len === maxLength + 1) && e.keyCode !== 8 && e.keyCode !== 46)) {
            opts.overMaxLength = true;
        }

        this.props.onKeyDown(e, opts);
    };

    Base.prototype.onFocus = function onFocus(e) {
        this.setState({
            focus: true
        });
        this.props.onFocus(e);
    };

    Base.prototype.onBlur = function onBlur(e) {
        this.setState({
            focus: false
        });
        this.props.onBlur(e);
    };

    Base.prototype.renderLength = function renderLength() {
        var _classNames;

        var _props = this.props,
            maxLength = _props.maxLength,
            showLimitHint = _props.showLimitHint,
            prefix = _props.prefix,
            rtl = _props.rtl;

        var len = maxLength > 0 && this.state.value ? this.getValueLength(this.state.value) : 0;

        var classesLenWrap = (0, _classnames2.default)((_classNames = {}, _classNames[prefix + 'input-len'] = true, _classNames[prefix + 'error'] = len > maxLength, _classNames));

        var content = rtl ? maxLength + '/' + len : len + '/' + maxLength;

        return maxLength && showLimitHint ? _react2.default.createElement(
            'span',
            { className: classesLenWrap },
            content
        ) : null;
    };

    Base.prototype.renderControl = function renderControl() {
        var _this2 = this;

        var lenWrap = this.renderLength();

        return lenWrap ? _react2.default.createElement(
            'span',
            { onClick: function onClick() {
                    return _this2.focus();
                }, className: this.props.prefix + 'input-control' },
            lenWrap
        ) : null;
    };

    Base.prototype.getClass = function getClass() {
        var _classNames2;

        var _props2 = this.props,
            disabled = _props2.disabled,
            state = _props2.state,
            prefix = _props2.prefix;


        return (0, _classnames2.default)((_classNames2 = {}, _classNames2[prefix + 'input'] = true, _classNames2[prefix + 'disabled'] = !!disabled, _classNames2[prefix + 'error'] = state === 'error', _classNames2[prefix + 'warning'] = state === 'warning', _classNames2[prefix + 'focus'] = this.state.focus, _classNames2));
    };

    Base.prototype.getProps = function getProps() {
        var _props3 = this.props,
            placeholder = _props3.placeholder,
            inputStyle = _props3.inputStyle,
            disabled = _props3.disabled,
            readOnly = _props3.readOnly,
            cutString = _props3.cutString,
            maxLength = _props3.maxLength,
            name = _props3.name,
            onCompositionStart = _props3.onCompositionStart,
            onCompositionEnd = _props3.onCompositionEnd;

        var props = {
            style: inputStyle,
            placeholder: placeholder,
            disabled: disabled,
            readOnly: readOnly,
            name: name,
            maxLength: cutString ? maxLength : undefined,
            value: this.state.value,
            onChange: this.onChange.bind(this),
            onBlur: this.onBlur.bind(this),
            onFocus: this.onFocus.bind(this),
            onCompositionStart: onCompositionStart,
            onCompositionEnd: onCompositionEnd
        };

        // fix accessibility???auto process status of aria disabled
        if (disabled) {
            props['aria-disabled'] = disabled;
        }

        return props;
    };

    Base.prototype.getInputNode = function getInputNode() {
        return this.inputRef;
    };

    Base.prototype.focus = function focus(start, end) {
        this.inputRef.focus();
        if (typeof start === 'number') {
            this.inputRef.selectionStart = start;
        }
        if (typeof end === 'number') {
            this.inputRef.selectionEnd = end;
        }
    };

    return Base;
}(_react2.default.Component), _class.propTypes = (0, _extends3.default)({}, _configProvider2.default.propTypes, {
    /**
     * ?????????
     */
    value: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
    /**
     * ????????????
     */
    defaultValue: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
    /**
     * ????????????????????????????????????
     * @param {String} value ??????
     * @param {Event} e DOM????????????
     */
    onChange: _propTypes2.default.func,
    /**
     * ????????????????????????????????????
     * @param {Event} e DOM????????????
     * @param {Object} opts ???????????????????????????<br> - opts.overMaxLength: {Boolean} ?????????????????????<br> - opts.beTrimed: {Boolean} ????????????????????????
     */
    onKeyDown: _propTypes2.default.func,
    /**
     * ????????????
     */
    disabled: _propTypes2.default.bool,
    /**
     * ????????????
     */
    maxLength: _propTypes2.default.number,
    /**
     * ????????????????????????????????????????????? hasLimitHint????????????????????????????????????2.x???????????????
     */
    showLimitHint: _propTypes2.default.bool,
    /**
     * ????????????maxLength?????????????????????????????????
     */
    cutString: _propTypes2.default.bool,
    /**
     * ??????
     */
    readOnly: _propTypes2.default.bool,
    /**
     * onChange????????????????????????????????????
     */
    trim: _propTypes2.default.bool,
    /**
     * ????????????
     */
    placeholder: _propTypes2.default.string,
    /**
     * ?????????????????????????????????
     * @param {Event} e DOM????????????
     */
    onFocus: _propTypes2.default.func,
    /**
     * ?????????????????????????????????
     * @param {Event} e DOM????????????
     */
    onBlur: _propTypes2.default.func,
    /**
     * ????????????????????????????????????
     * @param {String} value ??????
     * @returns {Number} ???????????????
     */
    getValueLength: _propTypes2.default.func,
    inputStyle: _propTypes2.default.object,
    /**
     * ?????????class
     */
    className: _propTypes2.default.string,
    /**
     * ?????????????????????
     */
    style: _propTypes2.default.object,
    /**
     * ??????type
     */
    htmlType: _propTypes2.default.string,
    /**
     * name
     */
    name: _propTypes2.default.string,
    rtl: _propTypes2.default.bool,
    state: _propTypes2.default.oneOf(['error', 'loading', 'success', 'warning']),
    locale: _propTypes2.default.object,
    /**
     * ??????????????????
     */
    isPreview: _propTypes2.default.bool,
    /**
     * ?????????????????????????????????
     * @param {number} value ?????????
     */
    renderPreview: _propTypes2.default.func,
    /**
     * ??????
     * @enumdesc ???, ???, ???
     */
    size: _propTypes2.default.oneOf(['small', 'medium', 'large']),
    /**
     * ????????????????????????????????????????????????????????????????????????????????? onChange
     * @version 1.23
     */
    composition: _propTypes2.default.bool,
    onCompositionStart: _propTypes2.default.func,
    onCompositionEnd: _propTypes2.default.func
}), _class.defaultProps = {
    disabled: false,
    prefix: 'next-',
    size: 'medium',
    maxLength: null,
    showLimitHint: false,
    cutString: true,
    readOnly: false,
    isPreview: false,
    trim: false,
    composition: false,
    onFocus: _util.func.noop,
    onBlur: _util.func.noop,
    onChange: _util.func.noop,
    onKeyDown: _util.func.noop,
    getValueLength: _util.func.noop,
    onCompositionStart: _util.func.noop,
    onCompositionEnd: _util.func.noop,
    locale: _zhCn2.default.Input
}, _temp2);
Base.displayName = 'Base';
exports.default = (0, _reactLifecyclesCompat.polyfill)(Base);
module.exports = exports['default'];
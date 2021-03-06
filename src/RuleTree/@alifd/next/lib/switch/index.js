'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _class, _temp;

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactLifecyclesCompat = require('react-lifecycles-compat');

var _util = require('../util');

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _configProvider = require('../config-provider');

var _configProvider2 = _interopRequireDefault(_configProvider);

var _zhCn = require('../locale/zh-cn');

var _zhCn2 = _interopRequireDefault(_zhCn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Switch*/
var Switch = (_temp = _class = function (_React$Component) {
    (0, _inherits3.default)(Switch, _React$Component);

    function Switch(props, context) {
        (0, _classCallCheck3.default)(this, Switch);

        var _this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call(this, props, context));

        var checked = props.checked || props.defaultChecked;
        _this.onChange = _this.onChange.bind(_this);
        _this.onKeyDown = _this.onKeyDown.bind(_this);
        _this.state = {
            checked: checked
        };
        return _this;
    }

    Switch.getDerivedStateFromProps = function getDerivedStateFromProps(props, state) {
        if ('checked' in props && props.checked !== state.checked) {
            return {
                checked: !!props.checked
            };
        }

        return null;
    };

    Switch.prototype.onChange = function onChange(ev) {
        var checked = !this.state.checked;

        if (!('checked' in this.props)) {
            this.setState({
                checked: checked
            });
        }
        this.props.onChange(checked, ev);
        this.props.onClick && this.props.onClick(ev);
    };

    Switch.prototype.onKeyDown = function onKeyDown(e) {
        if (e.keyCode === _util.KEYCODE.ENTER || e.keyCode === _util.KEYCODE.SPACE) {
            this.onChange(e);
        }
        this.props.onKeyDown && this.props.onKeyDown(e);
    };

    Switch.prototype.render = function render() {
        var _classNames;

        var _props = this.props,
            prefix = _props.prefix,
            className = _props.className,
            disabled = _props.disabled,
            readOnly = _props.readOnly,
            size = _props.size,
            loading = _props.loading,
            autoWidth = _props.autoWidth,
            checkedChildren = _props.checkedChildren,
            unCheckedChildren = _props.unCheckedChildren,
            rtl = _props.rtl,
            isPreview = _props.isPreview,
            renderPreview = _props.renderPreview,
            locale = _props.locale,
            others = (0, _objectWithoutProperties3.default)(_props, ['prefix', 'className', 'disabled', 'readOnly', 'size', 'loading', 'autoWidth', 'checkedChildren', 'unCheckedChildren', 'rtl', 'isPreview', 'renderPreview', 'locale']);
        var checked = this.state.checked;

        var status = checked ? 'on' : 'off';
        var children = checked ? checkedChildren : unCheckedChildren;

        var _size = size;
        if (_size !== 'small' && _size !== 'medium') {
            _size = 'medium';
        }

        var classes = (0, _classnames2.default)((_classNames = {}, _classNames[prefix + 'switch'] = true, _classNames[prefix + 'switch-loading'] = loading, _classNames[prefix + 'switch-' + status] = true, _classNames[prefix + 'switch-' + _size] = true, _classNames[prefix + 'switch-auto-width'] = autoWidth, _classNames[className] = className, _classNames));
        var attrs = void 0;
        var isDisabled = disabled || readOnly;

        if (!isDisabled) {
            attrs = {
                onClick: this.onChange,
                tabIndex: 0,
                onKeyDown: this.onKeyDown,
                disabled: false
            };
        } else {
            attrs = {
                disabled: true
            };
        }

        if (isPreview) {
            var _classNames2;

            var previewCls = (0, _classnames2.default)(className, (_classNames2 = {}, _classNames2[prefix + 'form-preview'] = true, _classNames2));

            if ('renderPreview' in this.props) {
                return _react2.default.createElement(
                    'div',
                    (0, _extends3.default)({ className: previewCls }, others),
                    renderPreview(checked, this.props)
                );
            }

            return _react2.default.createElement(
                'p',
                (0, _extends3.default)({ className: previewCls }, others),
                children || locale[status]
            );
        }

        return _react2.default.createElement(
            'div',
            (0, _extends3.default)({
                role: 'switch',
                dir: rtl ? 'rtl' : undefined,
                tabIndex: '0'
            }, others, {
                className: classes
            }, attrs, {
                'aria-checked': checked
            }),
            _react2.default.createElement(
                'div',
                { className: prefix + 'switch-btn' },
                loading && _react2.default.createElement(_icon2.default, { type: 'loading', className: prefix + 'switch-inner-icon' })
            ),
            _react2.default.createElement(
                'div',
                { className: prefix + 'switch-children' },
                children
            )
        );
    };

    return Switch;
}(_react2.default.Component), _class.contextTypes = {
    prefix: _propTypes2.default.string
}, _class.propTypes = {
    prefix: _propTypes2.default.string,
    rtl: _propTypes2.default.bool,
    pure: _propTypes2.default.bool,
    /**
     * ???????????????
     */
    className: _propTypes2.default.string,
    /**
     * ?????????????????????
     */
    style: _propTypes2.default.object,
    /**
     * ??????????????????
     */
    checkedChildren: _propTypes2.default.any,
    /**
     * ??????????????????
     */
    unCheckedChildren: _propTypes2.default.any,
    /**
     * ????????????????????????????????????
     * @param {Boolean} checked ?????????????????????
     * @param {Event} e DOM????????????
     */
    onChange: _propTypes2.default.func,
    /**
     * ??????????????????(??????????????????)
     */
    checked: _propTypes2.default.bool,
    /**
     * ??????????????? (?????????????????????)
     */
    defaultChecked: _propTypes2.default.bool,
    /**
     * ?????????????????????
     */
    disabled: _propTypes2.default.bool,
    /**
     * loading
     */
    loading: _propTypes2.default.bool,
    /**
     * switch?????????
     * @enumdesc ????????????, ???????????????
     */
    size: _propTypes2.default.oneOf(['medium', 'small']),
    /**
     * ??????????????????
     * @param {Event} e DOM????????????
     */
    onClick: _propTypes2.default.func,
    /**
     * ??????????????????
     * @param {Event} e DOM????????????
     */
    onKeyDown: _propTypes2.default.func,
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
     * ????????????????????????????????????
     * @version 1.23
     */
    autoWidth: _propTypes2.default.bool,
    /**
     * ???????????????
     */
    locale: _propTypes2.default.object
}, _class.defaultProps = {
    prefix: 'next-',
    size: 'medium',
    disabled: false,
    defaultChecked: false,
    isPreview: false,
    loading: false,
    readOnly: false,
    autoWidth: false,
    onChange: function onChange() {},
    locale: _zhCn2.default.Switch
}, _temp);
Switch.displayName = 'Switch';
exports.default = _configProvider2.default.config((0, _reactLifecyclesCompat.polyfill)(Switch));
module.exports = exports['default'];
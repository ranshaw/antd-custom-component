import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';
import { KEYCODE } from '../util';
import Icon from '../icon';
import ConfigProvider from '../config-provider';
import zhCN from '../locale/zh-cn';

/** Switch*/
var Switch = (_temp = _class = function (_React$Component) {
    _inherits(Switch, _React$Component);

    function Switch(props, context) {
        _classCallCheck(this, Switch);

        var _this = _possibleConstructorReturn(this, _React$Component.call(this, props, context));

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
        if (e.keyCode === KEYCODE.ENTER || e.keyCode === KEYCODE.SPACE) {
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
            others = _objectWithoutProperties(_props, ['prefix', 'className', 'disabled', 'readOnly', 'size', 'loading', 'autoWidth', 'checkedChildren', 'unCheckedChildren', 'rtl', 'isPreview', 'renderPreview', 'locale']);

        var checked = this.state.checked;

        var status = checked ? 'on' : 'off';
        var children = checked ? checkedChildren : unCheckedChildren;

        var _size = size;
        if (_size !== 'small' && _size !== 'medium') {
            _size = 'medium';
        }

        var classes = classNames((_classNames = {}, _classNames[prefix + 'switch'] = true, _classNames[prefix + 'switch-loading'] = loading, _classNames[prefix + 'switch-' + status] = true, _classNames[prefix + 'switch-' + _size] = true, _classNames[prefix + 'switch-auto-width'] = autoWidth, _classNames[className] = className, _classNames));
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

            var previewCls = classNames(className, (_classNames2 = {}, _classNames2[prefix + 'form-preview'] = true, _classNames2));

            if ('renderPreview' in this.props) {
                return React.createElement(
                    'div',
                    _extends({ className: previewCls }, others),
                    renderPreview(checked, this.props)
                );
            }

            return React.createElement(
                'p',
                _extends({ className: previewCls }, others),
                children || locale[status]
            );
        }

        return React.createElement(
            'div',
            _extends({
                role: 'switch',
                dir: rtl ? 'rtl' : undefined,
                tabIndex: '0'
            }, others, {
                className: classes
            }, attrs, {
                'aria-checked': checked
            }),
            React.createElement(
                'div',
                { className: prefix + 'switch-btn' },
                loading && React.createElement(Icon, { type: 'loading', className: prefix + 'switch-inner-icon' })
            ),
            React.createElement(
                'div',
                { className: prefix + 'switch-children' },
                children
            )
        );
    };

    return Switch;
}(React.Component), _class.contextTypes = {
    prefix: PropTypes.string
}, _class.propTypes = {
    prefix: PropTypes.string,
    rtl: PropTypes.bool,
    pure: PropTypes.bool,
    /**
     * ???????????????
     */
    className: PropTypes.string,
    /**
     * ?????????????????????
     */
    style: PropTypes.object,
    /**
     * ??????????????????
     */
    checkedChildren: PropTypes.any,
    /**
     * ??????????????????
     */
    unCheckedChildren: PropTypes.any,
    /**
     * ????????????????????????????????????
     * @param {Boolean} checked ?????????????????????
     * @param {Event} e DOM????????????
     */
    onChange: PropTypes.func,
    /**
     * ??????????????????(??????????????????)
     */
    checked: PropTypes.bool,
    /**
     * ??????????????? (?????????????????????)
     */
    defaultChecked: PropTypes.bool,
    /**
     * ?????????????????????
     */
    disabled: PropTypes.bool,
    /**
     * loading
     */
    loading: PropTypes.bool,
    /**
     * switch?????????
     * @enumdesc ????????????, ???????????????
     */
    size: PropTypes.oneOf(['medium', 'small']),
    /**
     * ??????????????????
     * @param {Event} e DOM????????????
     */
    onClick: PropTypes.func,
    /**
     * ??????????????????
     * @param {Event} e DOM????????????
     */
    onKeyDown: PropTypes.func,
    /**
     * ??????????????????
     */
    isPreview: PropTypes.bool,
    /**
     * ?????????????????????????????????
     * @param {number} value ?????????
     */
    renderPreview: PropTypes.func,
    /**
     * ????????????????????????????????????
     * @version 1.23
     */
    autoWidth: PropTypes.bool,
    /**
     * ???????????????
     */
    locale: PropTypes.object
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
    locale: zhCN.Switch
}, _temp);
Switch.displayName = 'Switch';


export default ConfigProvider.config(polyfill(Switch));
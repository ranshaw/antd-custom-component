import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';
import classnames from 'classnames';
import Icon from '../icon';
import Button from '../button';
import Overlay from '../overlay';
import Menu from '../menu';
import ConfigProvider from '../config-provider';
import { dom, obj, func } from '../util';

var Popup = Overlay.Popup;

/**
 * SplitButton
 */

var SplitButton = (_temp = _class = function (_React$Component) {
    _inherits(SplitButton, _React$Component);

    function SplitButton(props, context) {
        _classCallCheck(this, SplitButton);

        var _this = _possibleConstructorReturn(this, _React$Component.call(this, props, context));

        _this.selectMenuItem = function (keys) {
            var _this$props;

            for (var _len = arguments.length, others = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                others[_key - 1] = arguments[_key];
            }

            if (!('selectedKeys' in _this.props)) {
                _this.setState({
                    selectedKeys: keys
                });
            }
            (_this$props = _this.props).onSelect.apply(_this$props, [keys].concat(others));
        };

        _this.clickMenuItem = function (key) {
            var _this$props2;

            for (var _len2 = arguments.length, others = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                others[_key2 - 1] = arguments[_key2];
            }

            (_this$props2 = _this.props).onItemClick.apply(_this$props2, [key].concat(others));
            _this.onVisibleChange(false, 'menuSelect');
        };

        _this.onPopupOpen = function () {
            if (_this.props.autoWidth && _this.wrapper && _this.menu) {
                dom.setStyle(_this.menu, {
                    width: _this.wrapper.offsetWidth
                });
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

        _this._menuRefHandler = function (ref) {
            _this.menu = findDOMNode(ref);

            var refFn = _this.props.menuProps.ref;
            if (typeof refFn === 'function') {
                refFn(ref);
            }
        };

        _this._wrapperRefHandler = function (ref) {
            _this.wrapper = findDOMNode(ref);
        };

        _this.state = {
            selectedKeys: props.defaultSelectedKeys,
            visible: props.defaultVisible
        };
        return _this;
    }

    SplitButton.getDerivedStateFromProps = function getDerivedStateFromProps(props) {
        var st = {};

        if ('visible' in props) {
            st.visible = props.visible;
        }

        if ('selectedKeys' in props) {
            st.selectedKeys = props.selectedKeys;
        }

        return st;
    };

    SplitButton.prototype.componentDidMount = function componentDidMount() {
        // ????????????????????? wrapper??????????????????????????????wrapper ???????????????didMount ?????????????????????????????????????????????
        if (this.state.visible) {
            this.forceUpdate();
        }
    };

    SplitButton.prototype.render = function render() {
        var _classnames,
            _classnames2,
            _classnames3,
            _this2 = this;

        var _props = this.props,
            prefix = _props.prefix,
            label = _props.label,
            size = _props.size,
            type = _props.type,
            component = _props.component,
            ghost = _props.ghost,
            className = _props.className,
            style = _props.style,
            children = _props.children,
            triggerProps = _props.triggerProps,
            popupAlign = _props.popupAlign,
            popupTriggerType = _props.popupTriggerType,
            popupStyle = _props.popupStyle,
            popupClassName = _props.popupClassName,
            popupProps = _props.popupProps,
            popupContainer = _props.popupContainer,
            followTrigger = _props.followTrigger,
            selectMode = _props.selectMode,
            menuProps = _props.menuProps,
            leftButtonProps = _props.leftButtonProps,
            disabled = _props.disabled,
            others = _objectWithoutProperties(_props, ['prefix', 'label', 'size', 'type', 'component', 'ghost', 'className', 'style', 'children', 'triggerProps', 'popupAlign', 'popupTriggerType', 'popupStyle', 'popupClassName', 'popupProps', 'popupContainer', 'followTrigger', 'selectMode', 'menuProps', 'leftButtonProps', 'disabled']);

        var state = this.state;

        var classNames = classnames((_classnames = {}, _classnames[prefix + 'split-btn'] = true, _classnames), className);

        var sharedBtnProps = {
            type: type,
            size: size,
            component: component,
            ghost: ghost,
            disabled: disabled
        };

        var triggerClassNames = classnames((_classnames2 = {}, _classnames2[prefix + 'split-btn-trigger'] = true, _classnames2[prefix + 'expand'] = state.visible, _classnames2.opened = state.visible, _classnames2));

        var iconCls = classnames((_classnames3 = {}, _classnames3[prefix + 'split-btn-symbol-fold'] = true, _classnames3));

        var trigger = React.createElement(
            Button,
            _extends({}, sharedBtnProps, triggerProps, { className: triggerClassNames }),
            React.createElement(Icon, { type: 'arrow-down', className: iconCls })
        );

        return React.createElement(
            Button.Group,
            _extends({}, obj.pickOthers(SplitButton.propTypes, others), {
                className: classNames,
                style: style,
                size: size,
                ref: this._wrapperRefHandler
            }),
            React.createElement(
                Button,
                _extends({}, sharedBtnProps, leftButtonProps),
                label
            ),
            React.createElement(
                Popup,
                _extends({}, popupProps, {
                    followTrigger: followTrigger,
                    visible: state.visible,
                    onVisibleChange: this.onVisibleChange,
                    trigger: trigger,
                    triggerType: popupTriggerType,
                    align: popupAlign,
                    container: popupContainer,
                    target: function target() {
                        return _this2.wrapper;
                    },
                    style: popupStyle,
                    shouldUpdatePosition: true,
                    className: popupClassName,
                    onOpen: this.onPopupOpen
                }),
                React.createElement(
                    'div',
                    { className: prefix + 'split-btn-spacing-tb' },
                    React.createElement(
                        Menu,
                        _extends({}, menuProps, {
                            selectMode: selectMode,
                            selectedKeys: state.selectedKeys,
                            onSelect: this.selectMenuItem,
                            onItemClick: this.clickMenuItem,
                            ref: this._menuRefHandler
                        }),
                        children
                    )
                )
            )
        );
    };

    return SplitButton;
}(React.Component), _class.propTypes = {
    prefix: PropTypes.string,
    style: PropTypes.object,
    /**
     * ???????????????
     */
    type: PropTypes.oneOf(['normal', 'primary', 'secondary']),
    /**
     * ??????????????????
     */
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    /**
     * ??????????????????
     */
    label: PropTypes.node,
    /**
     * ??????????????????
     */
    component: PropTypes.oneOf(['button', 'a']),
    /**
     * ?????????????????????
     */
    ghost: PropTypes.oneOf(['light', 'dark', false, true]),
    /**
     * ???????????????????????????????????? Menu ????????????
     */
    defaultSelectedKeys: PropTypes.array,
    /**
     * ?????????????????????????????? Menu ?????????
     */
    selectedKeys: PropTypes.array,
    /**
     * ?????????????????????
     */
    selectMode: PropTypes.oneOf(['single', 'multiple']),
    /**
     * ???????????????????????????????????? Menu
     */
    onSelect: PropTypes.func,
    /**
     * ???????????????????????????????????? Menu
     */
    onItemClick: PropTypes.func,
    /**
     * ?????????????????????????????? Button ????????????????????????
     */
    triggerProps: PropTypes.object,
    /**
     * ?????????????????????????????????????????????
     */
    autoWidth: PropTypes.bool,
    /**
     * ??????????????????
     */
    visible: PropTypes.bool,
    /**
     * ????????????????????????
     */
    defaultVisible: PropTypes.bool,
    /**
     * ??????????????????????????????????????????
     * @param {Boolean} visible ??????????????????
     * @param {String} type ???????????????????????????????????? menuSelect ?????????menu????????? fromTrigger ?????????trigger?????????????????? docClick ?????????document???????????????
     */
    onVisibleChange: PropTypes.func,
    /**
     * ?????????????????????
     */
    popupTriggerType: PropTypes.oneOf(['click', 'hover']),
    /**
     * ??????????????????, ?????????Overlay align
     */
    popupAlign: PropTypes.string,
    /**
     * ?????????????????????
     */
    popupStyle: PropTypes.object,
    /**
     * ????????????????????????
     */
    popupClassName: PropTypes.string,
    /**
     * ????????????????????????
     */
    popupProps: PropTypes.object,
    /**
     * ????????????
     */
    popupContainer: PropTypes.any,
    /**
     * ??????????????????
     */
    followTrigger: PropTypes.bool,
    /**
     * ????????? Menu ?????????
     */
    menuProps: PropTypes.object,
    /**
     * ????????? ???????????? ?????????
     */
    leftButtonProps: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.any
}, _class.defaultProps = {
    prefix: 'next-',
    type: 'normal',
    size: 'medium',
    autoWidth: true,
    popupTriggerType: 'click',
    onVisibleChange: func.noop,
    onItemClick: func.noop,
    onSelect: func.noop,
    defaultSelectedKeys: [],
    menuProps: {},
    leftButtonProps: {}
}, _temp);
SplitButton.displayName = 'SplitButton';


SplitButton.Item = Menu.Item;
SplitButton.Divider = Menu.Divider;
SplitButton.Group = Menu.Group;

export default ConfigProvider.config(polyfill(SplitButton));
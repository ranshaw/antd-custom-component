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
import Button from '../button';
import Icon from '../icon';
import Menu from '../menu';
import Overlay from '../overlay';
import ConfigProvider from '../config-provider';
import { obj, func } from '../util';

var Popup = Overlay.Popup;

/**
 * MenuButton
 */

var MenuButton = (_temp = _class = function (_React$Component) {
    _inherits(MenuButton, _React$Component);

    function MenuButton(props, context) {
        _classCallCheck(this, MenuButton);

        var _this = _possibleConstructorReturn(this, _React$Component.call(this, props, context));

        _this.clickMenuItem = function (key) {
            var _this$props;

            for (var _len = arguments.length, others = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                others[_key - 1] = arguments[_key];
            }

            var selectMode = _this.props.selectMode;


            (_this$props = _this.props).onItemClick.apply(_this$props, [key].concat(others));

            if (selectMode === 'multiple') {
                return;
            }

            _this.onPopupVisibleChange(false, 'menuSelect');
        };

        _this.selectMenu = function (keys) {
            var _this$props2;

            for (var _len2 = arguments.length, others = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                others[_key2 - 1] = arguments[_key2];
            }

            if (!('selectedKeys' in _this.props)) {
                _this.setState({
                    selectedKeys: keys
                });
            }
            (_this$props2 = _this.props).onSelect.apply(_this$props2, [keys].concat(others));
        };

        _this.onPopupOpen = function () {
            var button = findDOMNode(_this);
            if (_this.props.autoWidth && button && _this.menu) {
                _this.menu.style.width = button.offsetWidth + 'px';
            }
        };

        _this.onPopupVisibleChange = function (visible, type) {
            if (!('visible' in _this.props)) {
                _this.setState({
                    visible: visible
                });
            }
            _this.props.onVisibleChange(visible, type);
        };

        _this._menuRefHandler = function (ref) {
            _this.menu = findDOMNode(ref);

            var refFn = _this.props.menuProps.ref;
            if (typeof refFn === 'function') {
                refFn(ref);
            }
        };

        _this.state = {
            selectedKeys: props.defaultSelectedKeys,
            visible: props.defaultVisible
        };
        return _this;
    }

    MenuButton.getDerivedStateFromProps = function getDerivedStateFromProps(props) {
        var st = {};

        if ('visible' in props) {
            st.visible = props.visible;
        }

        if ('selectedKeys' in props) {
            st.selectedKeys = props.selectedKeys;
        }

        return st;
    };

    MenuButton.prototype.render = function render() {
        var _classnames, _classnames2;

        var _props = this.props,
            prefix = _props.prefix,
            style = _props.style,
            className = _props.className,
            label = _props.label,
            popupTriggerType = _props.popupTriggerType,
            popupContainer = _props.popupContainer,
            popupStyle = _props.popupStyle,
            popupClassName = _props.popupClassName,
            popupProps = _props.popupProps,
            followTrigger = _props.followTrigger,
            selectMode = _props.selectMode,
            menuProps = _props.menuProps,
            children = _props.children,
            others = _objectWithoutProperties(_props, ['prefix', 'style', 'className', 'label', 'popupTriggerType', 'popupContainer', 'popupStyle', 'popupClassName', 'popupProps', 'followTrigger', 'selectMode', 'menuProps', 'children']);

        var state = this.state;

        var classNames = classnames((_classnames = {}, _classnames[prefix + 'menu-btn'] = true, _classnames[prefix + 'expand'] = state.visible, _classnames.opened = state.visible, _classnames), className);

        var popupClassNames = classnames((_classnames2 = {}, _classnames2[prefix + 'menu-btn-popup'] = true, _classnames2), popupClassName);

        var trigger = React.createElement(
            Button,
            _extends({ style: style, className: classNames }, obj.pickOthers(MenuButton.propTypes, others)),
            label,
            ' ',
            React.createElement(Icon, { type: 'arrow-down', className: prefix + 'menu-btn-arrow' })
        );

        return React.createElement(
            Popup,
            _extends({}, popupProps, {
                followTrigger: followTrigger,
                visible: state.visible,
                onVisibleChange: this.onPopupVisibleChange,
                trigger: trigger,
                triggerType: popupTriggerType,
                container: popupContainer,
                onOpen: this.onPopupOpen,
                style: popupStyle,
                className: popupClassNames
            }),
            React.createElement(
                'div',
                { className: prefix + 'menu-btn-spacing-tb' },
                React.createElement(
                    Menu,
                    _extends({}, menuProps, {
                        ref: this._menuRefHandler,
                        selectedKeys: state.selectedKeys,
                        selectMode: selectMode,
                        onSelect: this.selectMenu,
                        onItemClick: this.clickMenuItem
                    }),
                    children
                )
            )
        );
    };

    return MenuButton;
}(React.Component), _class.propTypes = {
    prefix: PropTypes.string,
    /**
     * ????????????????????????
     */
    label: PropTypes.node,
    /**
     * ?????????????????????????????????
     */
    autoWidth: PropTypes.bool,
    /**
     * ??????????????????
     */
    popupTriggerType: PropTypes.oneOf(['click', 'hover']),
    /**
     * ????????????
     */
    popupContainer: PropTypes.any,
    /**
     * ??????????????????
     */
    visible: PropTypes.bool,
    /**
     * ????????????????????????
     */
    defaultVisible: PropTypes.bool,
    /**
     * ???????????????????????????????????????
     */
    onVisibleChange: PropTypes.func,
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
     * ???????????????????????????????????? Menu ????????????
     */
    defaultSelectedKeys: PropTypes.array,
    /**
     * ?????????????????????????????? Menu ?????????
     */
    selectedKeys: PropTypes.array,
    /**
     * ??????????????????????????? Menu
     */
    selectMode: PropTypes.oneOf(['single', 'multiple']),
    /**
     * ????????????????????????????????? Menu
     */
    onItemClick: PropTypes.func,
    /**
     * ?????????????????????????????? Menu
     */
    onSelect: PropTypes.func,
    /**
     * ??????????????????
     */
    menuProps: PropTypes.object,
    style: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.any
}, _class.defaultProps = {
    prefix: 'next-',
    autoWidth: true,
    popupTriggerType: 'click',
    onVisibleChange: func.noop,
    onItemClick: func.noop,
    onSelect: func.noop,
    defaultSelectedKeys: [],
    menuProps: {}
}, _temp);
MenuButton.displayName = 'MenuButton';


MenuButton.Item = Menu.Item;
MenuButton.Group = Menu.Group;
MenuButton.Divider = Menu.Divider;

export default ConfigProvider.config(polyfill(MenuButton), {
    componentName: 'MenuButton'
});
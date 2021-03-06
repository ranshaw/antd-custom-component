import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { polyfill } from 'react-lifecycles-compat';
import { KEYCODE, obj } from '../util';
import TabNav from './tabs/nav';
import TabContent from './tabs/content';
import { toArray } from './tabs/utils';
import zhCN from '../locale/zh-cn';

var noop = function noop() {};

/** Tab */
var Tab = (_temp = _class = function (_Component) {
    _inherits(Tab, _Component);

    function Tab(props, context) {
        _classCallCheck(this, Tab);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

        _this.handleTriggerEvent = function (eventType, key) {
            var _this$props = _this.props,
                triggerType = _this$props.triggerType,
                onClick = _this$props.onClick,
                onChange = _this$props.onChange;

            if (triggerType === eventType) {
                onClick(key);
                _this.setActiveKey(key);
                if (_this.state.activeKey !== key) {
                    onChange(key);
                }
            }
        };

        _this.onNavKeyDown = function (e) {
            var keyCode = e.keyCode;
            var disableKeyboard = _this.props.disableKeyboard;


            if (disableKeyboard) {
                return;
            }

            if (keyCode >= KEYCODE.LEFT && keyCode <= KEYCODE.DOWN) {
                e.preventDefault();
            }

            var newKey = void 0;
            if (keyCode === KEYCODE.RIGHT || keyCode === KEYCODE.DOWN) {
                newKey = _this.getNextActiveKey(true);
                _this.handleTriggerEvent(_this.props.triggerType, newKey);
            } else if (keyCode === KEYCODE.LEFT || keyCode === KEYCODE.UP) {
                newKey = _this.getNextActiveKey(false);
                _this.handleTriggerEvent(_this.props.triggerType, newKey);
            }
        };

        _this.state = {
            activeKey: _this.getDefaultActiveKey(props)
        };
        return _this;
    }

    Tab.getDerivedStateFromProps = function getDerivedStateFromProps(props, state) {
        if (props.activeKey !== undefined && state.activeKey !== '' + props.activeKey) {
            return {
                activeKey: '' + props.activeKey
            };
        }

        return {};
    };

    Tab.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
        var preChildLen = prevProps.children && prevProps.children.length || 0;
        var curChildLen = this.props.children && this.props.children.length || 0;
        if (preChildLen !== 0 && curChildLen !== 0 && !('activeKey' in this.props) & !this.isActiveKeyExist(this.state.activeKey)) {
            var activeKey = this.getDefaultActiveKey(this.props);
            if (activeKey) {
                // eslint-disable-next-line react/no-did-update-set-state
                this.setState({
                    activeKey: activeKey
                });
            }
        }
    };

    Tab.prototype.getDefaultActiveKey = function getDefaultActiveKey(props) {
        var activeKey = props.activeKey === undefined ? props.defaultActiveKey : props.activeKey;

        if (activeKey === undefined) {
            React.Children.forEach(props.children, function (child, index) {
                if (activeKey !== undefined) return;
                if (React.isValidElement(child)) {
                    if (!child.props.disabled) {
                        activeKey = child.key || index;
                    }
                }
            });
        }

        return activeKey !== undefined ? '' + activeKey : undefined;
    };

    Tab.prototype.getNextActiveKey = function getNextActiveKey(isNext) {
        var _this2 = this;

        var children = [];
        React.Children.forEach(this.props.children, function (child) {
            if (React.isValidElement(child)) {
                if (!child.props.disabled) {
                    if (isNext) {
                        children.push(child);
                    } else {
                        children.unshift(child);
                    }
                }
            }
        });

        var length = children.length;
        var key = length && children[0].key;
        children.forEach(function (child, i) {
            if (child.key === _this2.state.activeKey) {
                if (i === length - 1) {
                    key = children[0].key;
                } else {
                    key = children[i + 1].key;
                }
            }
        });
        return key;
    };

    Tab.prototype.isActiveKeyExist = function isActiveKeyExist(activeKey) {
        var exist = false;
        React.Children.forEach(this.props.children, function (child, index) {
            if (exist) return;
            if (React.isValidElement(child)) {
                if (!child.props.disabled) {
                    var key = child.key || index;
                    if (activeKey === '' + key) {
                        exist = true;
                    }
                }
            }
        });
        return exist;
    };

    Tab.prototype.setActiveKey = function setActiveKey(key) {
        var activeKey = this.state.activeKey;

        // ?????? key ??????????????????????????????????????????

        if (key === activeKey || 'activeKey' in this.props) {
            return;
        }
        this.setState({
            activeKey: key
        });
    };

    Tab.prototype.render = function render() {
        var _classnames;

        var _props = this.props,
            prefix = _props.prefix,
            animation = _props.animation,
            shape = _props.shape,
            size = _props.size,
            extra = _props.extra,
            excessMode = _props.excessMode,
            tabPosition = _props.tabPosition,
            tabRender = _props.tabRender,
            triggerType = _props.triggerType,
            lazyLoad = _props.lazyLoad,
            unmountInactiveTabs = _props.unmountInactiveTabs,
            popupProps = _props.popupProps,
            navStyle = _props.navStyle,
            navClassName = _props.navClassName,
            contentStyle = _props.contentStyle,
            contentClassName = _props.contentClassName,
            className = _props.className,
            onClose = _props.onClose,
            children = _props.children,
            rtl = _props.rtl,
            device = _props.device,
            locale = _props.locale,
            icons = _props.icons,
            others = _objectWithoutProperties(_props, ['prefix', 'animation', 'shape', 'size', 'extra', 'excessMode', 'tabPosition', 'tabRender', 'triggerType', 'lazyLoad', 'unmountInactiveTabs', 'popupProps', 'navStyle', 'navClassName', 'contentStyle', 'contentClassName', 'className', 'onClose', 'children', 'rtl', 'device', 'locale', 'icons']);

        var activeKey = this.state.activeKey;


        var tabs = toArray(children);
        var newPosition = tabPosition;
        if (rtl && ['left', 'right'].indexOf(tabPosition) >= 0) {
            newPosition = tabPosition === 'left' ? 'right' : 'left';
        }
        var classNames = classnames((_classnames = {}, _classnames[prefix + 'tabs'] = true, _classnames[prefix + 'tabs-' + shape] = shape, _classnames[prefix + 'tabs-vertical'] = shape === 'wrapped' && ['left', 'right'].indexOf(tabPosition) >= 0, _classnames[prefix + 'tabs-scrollable'] = true, _classnames[prefix + 'tabs-' + newPosition] = shape === 'wrapped', _classnames['' + (prefix + size)] = size, _classnames), className);

        var navProps = {
            prefix: prefix,
            rtl: rtl,
            animation: animation,
            activeKey: activeKey,
            excessMode: excessMode,
            extra: extra,
            tabs: tabs,
            tabPosition: tabPosition,
            tabRender: tabRender,
            triggerType: triggerType,
            popupProps: popupProps,
            onClose: onClose,
            onTriggerEvent: this.handleTriggerEvent,
            onKeyDown: this.onNavKeyDown,
            style: navStyle,
            className: navClassName,
            locale: locale,
            icons: icons
        };

        var contentProps = {
            prefix: prefix,
            activeKey: activeKey,
            lazyLoad: lazyLoad,
            unmountInactiveTabs: unmountInactiveTabs,
            style: contentStyle,
            className: contentClassName
        };

        var tabChildren = [React.createElement(TabNav, _extends({ key: 'tab-nav' }, navProps)), React.createElement(
            TabContent,
            _extends({ key: 'tab-content' }, contentProps),
            tabs
        )];

        if (tabPosition === 'bottom') {
            tabChildren.reverse();
        }

        return React.createElement(
            'div',
            _extends({ dir: rtl ? 'rtl' : undefined, className: classNames }, obj.pickOthers(Tab.propTypes, others)),
            tabChildren
        );
    };

    return Tab;
}(Component), _class.propTypes = {
    prefix: PropTypes.string,
    rtl: PropTypes.bool,
    device: PropTypes.oneOf(['tablet', 'desktop', 'phone']),
    /**
     * ???????????????????????? key, ?????????tab???????????????, ??????????????????
     */
    activeKey: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     * ???????????????????????????????????? key
     */
    defaultActiveKey: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     * ????????????
     */
    shape: PropTypes.oneOf(['pure', 'wrapped', 'text', 'capsule']),
    /**
     * ??????????????????
     */
    animation: PropTypes.bool,
    /**
     * ?????????????????????????????????
     */
    excessMode: PropTypes.oneOf(['slide', 'dropdown']),
    /**
     * ???????????????????????????????????????????????????wrapped????????????
     */
    tabPosition: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
    /**
     * ??????
     */
    size: PropTypes.oneOf(['small', 'medium']),
    /**
     * ??????????????????????????????
     */
    triggerType: PropTypes.oneOf(['hover', 'click']),
    /**
     * ?????????????????? TabItem ?????????, ????????????, ??????????????????
     */
    lazyLoad: PropTypes.bool,
    /**
     * ???????????????????????????????????????????????????
     */
    unmountInactiveTabs: PropTypes.bool,
    /**
     * ???????????????????????????
     */
    navStyle: PropTypes.object,
    /**
     * ??????????????????????????????
     */
    navClassName: PropTypes.string,
    /**
     * ?????????????????????????????????
     */
    contentStyle: PropTypes.object,
    /**
     * ????????????????????????????????????
     */
    contentClassName: PropTypes.string,
    /**
     * ?????????????????????
     */
    extra: PropTypes.node,
    /**
     * ?????????????????????????????????????????????????????????????????????????????????????????????tab
     */
    disableKeyboard: PropTypes.bool,
    /**
     * ???????????????????????????????????????
     */
    onClick: PropTypes.func,
    /**
     * ???????????????????????????????????????
     * @param {String|Number} key ???????????? key
     */
    onChange: PropTypes.func,
    /**
     * ????????????????????????????????????
     * @param {String|Number} key   ????????????????????? key
     */
    onClose: PropTypes.func,
    /**
     * ????????????????????????????????????
     * @param {String} key ?????? Tab.Item ??? key ???
     * @param {Object} props ?????? Tab.Item ????????????????????????
     * @return {ReactNode} ?????????????????????
     */
    tabRender: PropTypes.func,
    /**
     * ??????????????????, ????????? excessMode ??? dropdown ?????????
     */
    popupProps: PropTypes.object,
    children: PropTypes.any,
    className: PropTypes.string,
    locale: PropTypes.object,
    /**
     * ?????????????????? icon
     */
    icons: PropTypes.shape({
        prev: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
        next: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
        dropdown: PropTypes.oneOfType([PropTypes.node, PropTypes.string])
    })
}, _class.defaultProps = {
    prefix: 'next-',
    shape: 'pure',
    size: 'medium',
    animation: true,
    tabPosition: 'top',
    excessMode: 'slide',
    triggerType: 'click',
    lazyLoad: true,
    unmountInactiveTabs: false,
    disableKeyboard: false,
    onClick: noop,
    onChange: noop,
    onClose: noop,
    locale: zhCN.Tab,
    icons: {}
}, _temp);
Tab.displayName = 'Tab';


export default polyfill(Tab);
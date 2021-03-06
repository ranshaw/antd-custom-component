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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames2 = require('classnames');

var _classnames3 = _interopRequireDefault(_classnames2);

var _reactLifecyclesCompat = require('react-lifecycles-compat');

var _util = require('../util');

var _nav = require('./tabs/nav');

var _nav2 = _interopRequireDefault(_nav);

var _content = require('./tabs/content');

var _content2 = _interopRequireDefault(_content);

var _utils = require('./tabs/utils');

var _zhCn = require('../locale/zh-cn');

var _zhCn2 = _interopRequireDefault(_zhCn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var noop = function noop() {};

/** Tab */
var Tab = (_temp = _class = function (_Component) {
    (0, _inherits3.default)(Tab, _Component);

    function Tab(props, context) {
        (0, _classCallCheck3.default)(this, Tab);

        var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call(this, props, context));

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

            if (keyCode >= _util.KEYCODE.LEFT && keyCode <= _util.KEYCODE.DOWN) {
                e.preventDefault();
            }

            var newKey = void 0;
            if (keyCode === _util.KEYCODE.RIGHT || keyCode === _util.KEYCODE.DOWN) {
                newKey = _this.getNextActiveKey(true);
                _this.handleTriggerEvent(_this.props.triggerType, newKey);
            } else if (keyCode === _util.KEYCODE.LEFT || keyCode === _util.KEYCODE.UP) {
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
            _react2.default.Children.forEach(props.children, function (child, index) {
                if (activeKey !== undefined) return;
                if (_react2.default.isValidElement(child)) {
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
        _react2.default.Children.forEach(this.props.children, function (child) {
            if (_react2.default.isValidElement(child)) {
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
        _react2.default.Children.forEach(this.props.children, function (child, index) {
            if (exist) return;
            if (_react2.default.isValidElement(child)) {
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
            others = (0, _objectWithoutProperties3.default)(_props, ['prefix', 'animation', 'shape', 'size', 'extra', 'excessMode', 'tabPosition', 'tabRender', 'triggerType', 'lazyLoad', 'unmountInactiveTabs', 'popupProps', 'navStyle', 'navClassName', 'contentStyle', 'contentClassName', 'className', 'onClose', 'children', 'rtl', 'device', 'locale', 'icons']);
        var activeKey = this.state.activeKey;


        var tabs = (0, _utils.toArray)(children);
        var newPosition = tabPosition;
        if (rtl && ['left', 'right'].indexOf(tabPosition) >= 0) {
            newPosition = tabPosition === 'left' ? 'right' : 'left';
        }
        var classNames = (0, _classnames3.default)((_classnames = {}, _classnames[prefix + 'tabs'] = true, _classnames[prefix + 'tabs-' + shape] = shape, _classnames[prefix + 'tabs-vertical'] = shape === 'wrapped' && ['left', 'right'].indexOf(tabPosition) >= 0, _classnames[prefix + 'tabs-scrollable'] = true, _classnames[prefix + 'tabs-' + newPosition] = shape === 'wrapped', _classnames['' + (prefix + size)] = size, _classnames), className);

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

        var tabChildren = [_react2.default.createElement(_nav2.default, (0, _extends3.default)({ key: 'tab-nav' }, navProps)), _react2.default.createElement(
            _content2.default,
            (0, _extends3.default)({ key: 'tab-content' }, contentProps),
            tabs
        )];

        if (tabPosition === 'bottom') {
            tabChildren.reverse();
        }

        return _react2.default.createElement(
            'div',
            (0, _extends3.default)({ dir: rtl ? 'rtl' : undefined, className: classNames }, _util.obj.pickOthers(Tab.propTypes, others)),
            tabChildren
        );
    };

    return Tab;
}(_react.Component), _class.propTypes = {
    prefix: _propTypes2.default.string,
    rtl: _propTypes2.default.bool,
    device: _propTypes2.default.oneOf(['tablet', 'desktop', 'phone']),
    /**
     * ???????????????????????? key, ?????????tab???????????????, ??????????????????
     */
    activeKey: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
    /**
     * ???????????????????????????????????? key
     */
    defaultActiveKey: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
    /**
     * ????????????
     */
    shape: _propTypes2.default.oneOf(['pure', 'wrapped', 'text', 'capsule']),
    /**
     * ??????????????????
     */
    animation: _propTypes2.default.bool,
    /**
     * ?????????????????????????????????
     */
    excessMode: _propTypes2.default.oneOf(['slide', 'dropdown']),
    /**
     * ???????????????????????????????????????????????????wrapped????????????
     */
    tabPosition: _propTypes2.default.oneOf(['top', 'bottom', 'left', 'right']),
    /**
     * ??????
     */
    size: _propTypes2.default.oneOf(['small', 'medium']),
    /**
     * ??????????????????????????????
     */
    triggerType: _propTypes2.default.oneOf(['hover', 'click']),
    /**
     * ?????????????????? TabItem ?????????, ????????????, ??????????????????
     */
    lazyLoad: _propTypes2.default.bool,
    /**
     * ???????????????????????????????????????????????????
     */
    unmountInactiveTabs: _propTypes2.default.bool,
    /**
     * ???????????????????????????
     */
    navStyle: _propTypes2.default.object,
    /**
     * ??????????????????????????????
     */
    navClassName: _propTypes2.default.string,
    /**
     * ?????????????????????????????????
     */
    contentStyle: _propTypes2.default.object,
    /**
     * ????????????????????????????????????
     */
    contentClassName: _propTypes2.default.string,
    /**
     * ?????????????????????
     */
    extra: _propTypes2.default.node,
    /**
     * ?????????????????????????????????????????????????????????????????????????????????????????????tab
     */
    disableKeyboard: _propTypes2.default.bool,
    /**
     * ???????????????????????????????????????
     */
    onClick: _propTypes2.default.func,
    /**
     * ???????????????????????????????????????
     * @param {String|Number} key ???????????? key
     */
    onChange: _propTypes2.default.func,
    /**
     * ????????????????????????????????????
     * @param {String|Number} key   ????????????????????? key
     */
    onClose: _propTypes2.default.func,
    /**
     * ????????????????????????????????????
     * @param {String} key ?????? Tab.Item ??? key ???
     * @param {Object} props ?????? Tab.Item ????????????????????????
     * @return {ReactNode} ?????????????????????
     */
    tabRender: _propTypes2.default.func,
    /**
     * ??????????????????, ????????? excessMode ??? dropdown ?????????
     */
    popupProps: _propTypes2.default.object,
    children: _propTypes2.default.any,
    className: _propTypes2.default.string,
    locale: _propTypes2.default.object,
    /**
     * ?????????????????? icon
     */
    icons: _propTypes2.default.shape({
        prev: _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.string]),
        next: _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.string]),
        dropdown: _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.string])
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
    locale: _zhCn2.default.Tab,
    icons: {}
}, _temp);
Tab.displayName = 'Tab';
exports.default = (0, _reactLifecyclesCompat.polyfill)(Tab);
module.exports = exports['default'];
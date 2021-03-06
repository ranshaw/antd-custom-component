import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';
import getContextProps from './get-context-props';
import { config, initLocales, setLanguage, setLocale, setDirection, getLocale, getLanguage, getDirection } from './config';
import Consumer from './consumer';
import ErrorBoundary from './error-boundary';
import Cache from './cache';
import datejs from '../util/date';

var childContextCache = new Cache();

var setMomentLocale = function setMomentLocale(locale) {
    var moment = void 0;
    try {
        moment = require('moment');
        if (moment && moment.default && moment.default.isMoment) moment = moment.default;
    } catch (e) {
        // ignore
    }

    if (moment && locale) {
        moment.locale(locale.momentLocale);
    }
};

var setDateLocale = function setDateLocale(locale) {
    if (locale) {
        datejs.locale(locale.dateLocale || locale.momentLocale);
    }
};

/**
 * ConfigProvider
 * @propsExtends false
 */
var ConfigProvider = (_temp = _class = function (_Component) {
    _inherits(ConfigProvider, _Component);

    /**
     * 传入组件的 props 和 displayName，得到和 childContext 计算过的包含有 preifx/locale/pure 的对象，一般用于通过静态方法生成脱离组件树的组件
     * @param {Object} props 组件的 props
     * @param {String} displayName 组件的 displayName
     * @returns {Object} 新的 context props
     */
    function ConfigProvider() {
        _classCallCheck(this, ConfigProvider);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args)));

        childContextCache.add(_this, _extends({}, childContextCache.get(_this, {}), _this.getChildContext()));

        setMomentLocale(_this.props.locale);
        setDateLocale(_this.props.locale);

        _this.state = {
            locale: _this.props.locale
        };
        return _this;
    }

    /**
     * 传入组件，生成受 ConfigProvider 控制的 HOC 组件
     * @param {Component} Component 组件类
     * @param {Object} options 可选项
     * @returns {Component} HOC
     */


    ConfigProvider.prototype.getChildContext = function getChildContext() {
        var _props = this.props,
            prefix = _props.prefix,
            locale = _props.locale,
            defaultPropsConfig = _props.defaultPropsConfig,
            pure = _props.pure,
            warning = _props.warning,
            rtl = _props.rtl,
            device = _props.device,
            popupContainer = _props.popupContainer,
            errorBoundary = _props.errorBoundary;
        var _context = this.context,
            nextPrefix = _context.nextPrefix,
            nextDefaultPropsConfig = _context.nextDefaultPropsConfig,
            nextLocale = _context.nextLocale,
            nextPure = _context.nextPure,
            nextRtl = _context.nextRtl,
            nextWarning = _context.nextWarning,
            nextDevice = _context.nextDevice,
            nextPopupContainer = _context.nextPopupContainer,
            nextErrorBoundary = _context.nextErrorBoundary;


        return {
            nextPrefix: prefix || nextPrefix,
            nextDefaultPropsConfig: defaultPropsConfig || nextDefaultPropsConfig,
            nextLocale: locale || nextLocale,
            nextPure: typeof pure === 'boolean' ? pure : nextPure,
            nextRtl: typeof rtl === 'boolean' ? rtl : nextRtl,
            nextWarning: typeof warning === 'boolean' ? warning : nextWarning,
            nextDevice: device || nextDevice,
            nextPopupContainer: popupContainer || nextPopupContainer,
            nextErrorBoundary: errorBoundary || nextErrorBoundary
        };
    };

    ConfigProvider.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.locale !== prevState.locale) {
            setMomentLocale(nextProps.locale);
            setDateLocale(nextProps.locale);

            return {
                locale: nextProps.locale
            };
        }

        return null;
    };

    ConfigProvider.prototype.componentDidUpdate = function componentDidUpdate() {
        childContextCache.add(this, _extends({}, childContextCache.get(this, {}), this.getChildContext()));
    };

    ConfigProvider.prototype.componentWillUnmount = function componentWillUnmount() {
        childContextCache.remove(this);
    };

    ConfigProvider.prototype.render = function render() {
        return Children.only(this.props.children);
    };

    return ConfigProvider;
}(Component), _class.propTypes = {
    /**
     * 样式类名的品牌前缀
     */
    prefix: PropTypes.string,
    /**
     * 国际化文案对象，属性为组件的 displayName
     */
    locale: PropTypes.object,
    /**
     * 组件 API 的默认配置
     */
    defaultPropsConfig: PropTypes.object,
    /**
     * 是否开启错误捕捉 errorBoundary
     * 如需自定义参数，请传入对象 对象接受参数列表如下：
     *
     * fallbackUI `Function(error?: {}, errorInfo?: {}) => Element` 捕获错误后的展示
     * afterCatch `Function(error?: {}, errorInfo?: {})` 捕获错误后的行为, 比如埋点上传
     */
    errorBoundary: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    /**
     * 是否开启 Pure Render 模式，会提高性能，但是也会带来副作用
     */
    pure: PropTypes.bool,
    /**
     * 是否在开发模式下显示组件属性被废弃的 warning 提示
     */
    warning: PropTypes.bool,
    /**
     * 是否开启 rtl 模式
     */
    rtl: PropTypes.bool,
    /**
     * 设备类型，针对不同的设备类型组件做出对应的响应式变化
     */
    device: PropTypes.oneOf(['tablet', 'desktop', 'phone']),
    /**
     * 组件树
     */
    children: PropTypes.any,
    /**
     * 指定浮层渲染的父节点, 可以为节点id的字符串，也可以返回节点的函数
     */
    popupContainer: PropTypes.any
}, _class.defaultProps = {
    warning: true,
    errorBoundary: false
}, _class.contextTypes = {
    nextPrefix: PropTypes.string,
    nextLocale: PropTypes.object,
    nextDefaultPropsConfig: PropTypes.object,
    nextPure: PropTypes.bool,
    nextRtl: PropTypes.bool,
    nextWarning: PropTypes.bool,
    nextDevice: PropTypes.oneOf(['tablet', 'desktop', 'phone']),
    nextPopupContainer: PropTypes.any,
    nextErrorBoundary: PropTypes.oneOfType([PropTypes.bool, PropTypes.object])
}, _class.childContextTypes = {
    nextPrefix: PropTypes.string,
    nextLocale: PropTypes.object,
    nextDefaultPropsConfig: PropTypes.object,
    nextPure: PropTypes.bool,
    nextRtl: PropTypes.bool,
    nextWarning: PropTypes.bool,
    nextDevice: PropTypes.oneOf(['tablet', 'desktop', 'phone']),
    nextPopupContainer: PropTypes.any,
    nextErrorBoundary: PropTypes.oneOfType([PropTypes.bool, PropTypes.object])
}, _class.config = function (Component, options) {
    return config(Component, options);
}, _class.getContextProps = function (props, displayName) {
    return getContextProps(props, childContextCache.root() || {}, displayName);
}, _class.clearCache = function () {
    childContextCache.clear();
}, _class.initLocales = initLocales, _class.setLanguage = setLanguage, _class.setLocale = setLocale, _class.setDirection = setDirection, _class.getLanguage = getLanguage, _class.getLocale = getLocale, _class.getDirection = getDirection, _class.Consumer = Consumer, _class.ErrorBoundary = ErrorBoundary, _class.getContext = function () {
    var _ref = childContextCache.root() || {},
        nextPrefix = _ref.nextPrefix,
        nextLocale = _ref.nextLocale,
        nextDefaultPropsConfig = _ref.nextDefaultPropsConfig,
        nextPure = _ref.nextPure,
        nextRtl = _ref.nextRtl,
        nextWarning = _ref.nextWarning,
        nextDevice = _ref.nextDevice,
        nextPopupContainer = _ref.nextPopupContainer,
        nextErrorBoundary = _ref.nextErrorBoundary;

    return {
        prefix: nextPrefix,
        locale: nextLocale,
        defaultPropsConfig: nextDefaultPropsConfig,
        pure: nextPure,
        rtl: nextRtl,
        warning: nextWarning,
        device: nextDevice,
        popupContainer: nextPopupContainer,
        errorBoundary: nextErrorBoundary
    };
}, _temp);
ConfigProvider.displayName = 'ConfigProvider';


export default polyfill(ConfigProvider);
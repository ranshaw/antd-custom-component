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

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactLifecyclesCompat = require('react-lifecycles-compat');

var _getContextProps = require('./get-context-props');

var _getContextProps2 = _interopRequireDefault(_getContextProps);

var _config = require('./config');

var _consumer = require('./consumer');

var _consumer2 = _interopRequireDefault(_consumer);

var _errorBoundary = require('./error-boundary');

var _errorBoundary2 = _interopRequireDefault(_errorBoundary);

var _cache = require('./cache');

var _cache2 = _interopRequireDefault(_cache);

var _date = require('../util/date');

var _date2 = _interopRequireDefault(_date);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var childContextCache = new _cache2.default();

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
        _date2.default.locale(locale.dateLocale || locale.momentLocale);
    }
};

/**
 * ConfigProvider
 * @propsExtends false
 */
var ConfigProvider = (_temp = _class = function (_Component) {
    (0, _inherits3.default)(ConfigProvider, _Component);

    /**
     * ??????????????? props ??? displayName???????????? childContext ????????????????????? preifx/locale/pure ????????????????????????????????????????????????????????????????????????
     * @param {Object} props ????????? props
     * @param {String} displayName ????????? displayName
     * @returns {Object} ?????? context props
     */
    function ConfigProvider() {
        (0, _classCallCheck3.default)(this, ConfigProvider);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args)));

        childContextCache.add(_this, (0, _extends3.default)({}, childContextCache.get(_this, {}), _this.getChildContext()));

        setMomentLocale(_this.props.locale);
        setDateLocale(_this.props.locale);

        _this.state = {
            locale: _this.props.locale
        };
        return _this;
    }

    /**
     * ???????????????????????? ConfigProvider ????????? HOC ??????
     * @param {Component} Component ?????????
     * @param {Object} options ?????????
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
        childContextCache.add(this, (0, _extends3.default)({}, childContextCache.get(this, {}), this.getChildContext()));
    };

    ConfigProvider.prototype.componentWillUnmount = function componentWillUnmount() {
        childContextCache.remove(this);
    };

    ConfigProvider.prototype.render = function render() {
        return _react.Children.only(this.props.children);
    };

    return ConfigProvider;
}(_react.Component), _class.propTypes = {
    /**
     * ???????????????????????????
     */
    prefix: _propTypes2.default.string,
    /**
     * ?????????????????????????????????????????? displayName
     */
    locale: _propTypes2.default.object,
    /**
     * ?????? API ???????????????
     */
    defaultPropsConfig: _propTypes2.default.object,
    /**
     * ???????????????????????? errorBoundary
     * ??????????????????????????????????????? ?????????????????????????????????
     *
     * fallbackUI `Function(error?: {}, errorInfo?: {}) => Element` ????????????????????????
     * afterCatch `Function(error?: {}, errorInfo?: {})` ????????????????????????, ??????????????????
     */
    errorBoundary: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.object]),
    /**
     * ???????????? Pure Render ??????????????????????????????????????????????????????
     */
    pure: _propTypes2.default.bool,
    /**
     * ?????????????????????????????????????????????????????? warning ??????
     */
    warning: _propTypes2.default.bool,
    /**
     * ???????????? rtl ??????
     */
    rtl: _propTypes2.default.bool,
    /**
     * ??????????????????????????????????????????????????????????????????????????????
     */
    device: _propTypes2.default.oneOf(['tablet', 'desktop', 'phone']),
    /**
     * ?????????
     */
    children: _propTypes2.default.any,
    /**
     * ??????????????????????????????, ???????????????id?????????????????????????????????????????????
     */
    popupContainer: _propTypes2.default.any
}, _class.defaultProps = {
    warning: true,
    errorBoundary: false
}, _class.contextTypes = {
    nextPrefix: _propTypes2.default.string,
    nextLocale: _propTypes2.default.object,
    nextDefaultPropsConfig: _propTypes2.default.object,
    nextPure: _propTypes2.default.bool,
    nextRtl: _propTypes2.default.bool,
    nextWarning: _propTypes2.default.bool,
    nextDevice: _propTypes2.default.oneOf(['tablet', 'desktop', 'phone']),
    nextPopupContainer: _propTypes2.default.any,
    nextErrorBoundary: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.object])
}, _class.childContextTypes = {
    nextPrefix: _propTypes2.default.string,
    nextLocale: _propTypes2.default.object,
    nextDefaultPropsConfig: _propTypes2.default.object,
    nextPure: _propTypes2.default.bool,
    nextRtl: _propTypes2.default.bool,
    nextWarning: _propTypes2.default.bool,
    nextDevice: _propTypes2.default.oneOf(['tablet', 'desktop', 'phone']),
    nextPopupContainer: _propTypes2.default.any,
    nextErrorBoundary: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.object])
}, _class.config = function (Component, options) {
    return (0, _config.config)(Component, options);
}, _class.getContextProps = function (props, displayName) {
    return (0, _getContextProps2.default)(props, childContextCache.root() || {}, displayName);
}, _class.clearCache = function () {
    childContextCache.clear();
}, _class.initLocales = _config.initLocales, _class.setLanguage = _config.setLanguage, _class.setLocale = _config.setLocale, _class.setDirection = _config.setDirection, _class.getLanguage = _config.getLanguage, _class.getLocale = _config.getLocale, _class.getDirection = _config.getDirection, _class.Consumer = _consumer2.default, _class.ErrorBoundary = _errorBoundary2.default, _class.getContext = function () {
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
exports.default = (0, _reactLifecyclesCompat.polyfill)(ConfigProvider);
module.exports = exports['default'];
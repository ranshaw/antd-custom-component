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

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactLifecyclesCompat = require('react-lifecycles-compat');

var _loading = require('../loading');

var _loading2 = _interopRequireDefault(_loading);

var _zhCn = require('../locale/zh-cn');

var _zhCn2 = _interopRequireDefault(_zhCn);

var _configProvider = require('../config-provider');

var _configProvider2 = _interopRequireDefault(_configProvider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * List
 */
var List = (_temp = _class = function (_Component) {
    (0, _inherits3.default)(List, _Component);

    function List() {
        (0, _classCallCheck3.default)(this, List);
        return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
    }

    List.prototype.render = function render() {
        var _classNames;

        var _props = this.props,
            prefix = _props.prefix,
            header = _props.header,
            footer = _props.footer,
            size = _props.size,
            divider = _props.divider,
            className = _props.className,
            children = _props.children,
            rtl = _props.rtl,
            dataSource = _props.dataSource,
            renderItem = _props.renderItem,
            locale = _props.locale,
            loading = _props.loading,
            _props$loadingCompone = _props.loadingComponent,
            LoadingComponent = _props$loadingCompone === undefined ? _loading2.default : _props$loadingCompone,
            emptyContent = _props.emptyContent,
            others = (0, _objectWithoutProperties3.default)(_props, ['prefix', 'header', 'footer', 'size', 'divider', 'className', 'children', 'rtl', 'dataSource', 'renderItem', 'locale', 'loading', 'loadingComponent', 'emptyContent']);


        if (rtl) {
            others.dir = 'rtl';
        }

        var dSValid = Array.isArray(dataSource);

        var classes = (0, _classnames2.default)(prefix + 'list', (_classNames = {}, _classNames[prefix + 'list-' + size] = size, _classNames[prefix + 'list-divider'] = divider, _classNames), className);

        var customContent = dSValid && dataSource.map(function (one, index) {
            return renderItem(one, index);
        });

        var content = _react2.default.createElement(
            'div',
            (0, _extends3.default)({}, others, { className: classes }),
            header ? _react2.default.createElement(
                'div',
                { className: prefix + 'list-header' },
                header
            ) : null,
            !(dSValid && dataSource.length > 0) && !children ? _react2.default.createElement(
                'div',
                { className: prefix + 'list-empty' },
                emptyContent || locale.empty
            ) : _react2.default.createElement(
                'ul',
                { key: 'list-body', className: prefix + 'list-items' },
                customContent,
                children
            ),
            footer ? _react2.default.createElement(
                'div',
                { className: prefix + 'list-footer' },
                footer
            ) : null
        );

        if (loading) {
            var loadingClassName = prefix + 'list-loading';
            return _react2.default.createElement(
                LoadingComponent,
                { className: loadingClassName },
                content
            );
        }

        return content;
    };

    return List;
}(_react.Component), _class.propTypes = {
    prefix: _propTypes2.default.string,
    rtl: _propTypes2.default.bool,
    /**
     * ????????????
     */
    header: _propTypes2.default.node,
    /**
     * ????????????
     */
    footer: _propTypes2.default.node,
    /**
     * ????????????
     */
    size: _propTypes2.default.oneOf(['medium', 'small']),
    /**
     * ?????????????????????
     */
    divider: _propTypes2.default.bool,
    /**
     * ???????????????
     */
    dataSource: _propTypes2.default.array,
    /**
     * ????????? dataSource ??????????????? renderItem ????????????????????????
     * @param {Any} current ??????????????????
     * @param {Number} index ???????????????????????????
     */
    renderItem: _propTypes2.default.func,
    /**
     * ??????????????????
     */
    loading: _propTypes2.default.bool,
    /**
     * ????????? Loading ??????
     * ??????????????? props, ??????????????? loadingComponent={props => <Loading {...props}/>}
     * @param {LoadingProps} props ??????????????????????????????
     * @return {React.ReactNode} ???????????????
     */
    loadingComponent: _propTypes2.default.func,
    /**
     * ????????????????????????????????????????????????
     */
    emptyContent: _propTypes2.default.node,
    className: _propTypes2.default.string,
    children: _propTypes2.default.any,
    locale: _propTypes2.default.object
}, _class.defaultProps = {
    rtl: false,
    size: 'medium',
    divider: true,
    prefix: 'next-',
    locale: _zhCn2.default.List,
    renderItem: function renderItem(item) {
        return item;
    },
    loading: false
}, _temp);
List.displayName = 'List';
exports.default = _configProvider2.default.config((0, _reactLifecyclesCompat.polyfill)(List));
module.exports = exports['default'];
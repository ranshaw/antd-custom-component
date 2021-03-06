'use strict';

exports.__esModule = true;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _configProvider = require('../config-provider');

var _configProvider2 = _interopRequireDefault(_configProvider);

var _box = require('../box');

var _box2 = _interopRequireDefault(_box);

var _util = require('../util');

var _createStyle = require('./create-style');

var _createStyle2 = _interopRequireDefault(_createStyle);

var _cell = require('./cell');

var _cell2 = _interopRequireDefault(_cell);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ieVersion = _util.env.ieVersion;
var pickOthers = _util.obj.pickOthers,
    isReactFragment = _util.obj.isReactFragment;


var createChildren = function createChildren(children, device, gap) {
    var array = _react2.default.Children.toArray(children);
    if (!children) {
        return null;
    }

    return array.map(function (child) {
        if (isReactFragment(child)) {
            return createChildren(child.props.children, device, gap);
        }

        if (_react2.default.isValidElement(child) && ['function', 'object'].indexOf((0, _typeof3.default)(child.type)) > -1 && ['form_item', 'responsive_grid_cell'].indexOf(child.type._typeMark) > -1) {
            return _react2.default.cloneElement(child, {
                style: (0, _extends3.default)({}, (0, _createStyle.getGridChildProps)(child.props, device, gap), child.props.style || {})
            });
        }

        return child;
    });
};

var getStyle = function getStyle() {
    var style = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var props = arguments[1];

    return (0, _extends3.default)({}, (0, _createStyle2.default)((0, _extends3.default)({ display: 'grid' }, props)), style);
};

/**
 * ResponsiveGrid
 */
var ResponsiveGrid = (_temp = _class = function (_Component) {
    (0, _inherits3.default)(ResponsiveGrid, _Component);

    function ResponsiveGrid() {
        (0, _classCallCheck3.default)(this, ResponsiveGrid);
        return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
    }

    ResponsiveGrid.prototype.render = function render() {
        var _classNames;

        var _props = this.props,
            prefix = _props.prefix,
            View = _props.component,
            style = _props.style,
            className = _props.className,
            children = _props.children,
            device = _props.device,
            rows = _props.rows,
            columns = _props.columns,
            gap = _props.gap,
            rowSpan = _props.rowSpan,
            colSpan = _props.colSpan,
            component = _props.component,
            dense = _props.dense;

        var styleProps = {
            rows: rows,
            columns: columns,
            gap: gap,
            device: device,
            rowSpan: rowSpan,
            colSpan: colSpan,
            component: component,
            dense: dense
        };

        var others = pickOthers(Object.keys(ResponsiveGrid.propTypes), this.props);

        var styleSheet = getStyle(style, styleProps);

        var cls = (0, _classnames2.default)((_classNames = {}, _classNames[prefix + 'responsive-grid'] = true, _classNames[prefix + 'responsive-grid-ie'] = ieVersion, _classNames), className);

        return ieVersion ? _react2.default.createElement(_box2.default, (0, _extends3.default)({}, this.props, { direction: 'row', wrap: true, spacing: gap, children: createChildren(children, device, gap) })) : _react2.default.createElement(
            View,
            (0, _extends3.default)({ style: styleSheet, className: cls }, others),
            createChildren(children, device, gap)
        );
    };

    return ResponsiveGrid;
}(_react.Component), _class._typeMark = 'responsive_grid', _class.propTypes = {
    prefix: _propTypes2.default.string,
    className: _propTypes2.default.any,
    /**
     * ??????????????????????????????????????? PC
     * @enumdesc ??????, ??????, PC
     */
    device: _propTypes2.default.oneOf(['phone', 'tablet', 'desktop']),
    rows: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
    /**
     * ??????????????? ????????? 12 ???
     */
    columns: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
    /**
     * ?????? cell ?????????????????? [bottom&top, right&left]
     */
    gap: _propTypes2.default.oneOfType([_propTypes2.default.arrayOf(_propTypes2.default.number), _propTypes2.default.number]),
    /**
     * ??????????????????
     */
    component: _propTypes2.default.elementType,
    /**
     * ????????????????????????????????????????????????????????????????????????????????????
     */
    dense: _propTypes2.default.bool,
    style: _propTypes2.default.object
}, _class.defaultProps = {
    prefix: 'next-',
    component: 'div',
    device: 'desktop',
    dense: false
}, _temp);
ResponsiveGrid.displayName = 'ResponsiveGrid';


ResponsiveGrid.Cell = _cell2.default;

exports.default = _configProvider2.default.config(ResponsiveGrid);
module.exports = exports['default'];
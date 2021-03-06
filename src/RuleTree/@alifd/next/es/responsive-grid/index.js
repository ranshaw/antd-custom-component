import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import _extends from 'babel-runtime/helpers/extends';
import _typeof from 'babel-runtime/helpers/typeof';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ConfigProvider from '../config-provider';
import Box from '../box';
import { obj, env } from '../util';
import createStyle, { getGridChildProps } from './create-style';
import Cell from './cell';

var ieVersion = env.ieVersion;
var pickOthers = obj.pickOthers,
    isReactFragment = obj.isReactFragment;


var createChildren = function createChildren(children, device, gap) {
    var array = React.Children.toArray(children);
    if (!children) {
        return null;
    }

    return array.map(function (child) {
        if (isReactFragment(child)) {
            return createChildren(child.props.children, device, gap);
        }

        if (React.isValidElement(child) && ['function', 'object'].indexOf(_typeof(child.type)) > -1 && ['form_item', 'responsive_grid_cell'].indexOf(child.type._typeMark) > -1) {
            return React.cloneElement(child, {
                style: _extends({}, getGridChildProps(child.props, device, gap), child.props.style || {})
            });
        }

        return child;
    });
};

var getStyle = function getStyle() {
    var style = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var props = arguments[1];

    return _extends({}, createStyle(_extends({ display: 'grid' }, props)), style);
};

/**
 * ResponsiveGrid
 */
var ResponsiveGrid = (_temp = _class = function (_Component) {
    _inherits(ResponsiveGrid, _Component);

    function ResponsiveGrid() {
        _classCallCheck(this, ResponsiveGrid);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
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

        var cls = classNames((_classNames = {}, _classNames[prefix + 'responsive-grid'] = true, _classNames[prefix + 'responsive-grid-ie'] = ieVersion, _classNames), className);

        return ieVersion ? React.createElement(Box, _extends({}, this.props, { direction: 'row', wrap: true, spacing: gap, children: createChildren(children, device, gap) })) : React.createElement(
            View,
            _extends({ style: styleSheet, className: cls }, others),
            createChildren(children, device, gap)
        );
    };

    return ResponsiveGrid;
}(Component), _class._typeMark = 'responsive_grid', _class.propTypes = {
    prefix: PropTypes.string,
    className: PropTypes.any,
    /**
     * ??????????????????????????????????????? PC
     * @enumdesc ??????, ??????, PC
     */
    device: PropTypes.oneOf(['phone', 'tablet', 'desktop']),
    rows: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     * ??????????????? ????????? 12 ???
     */
    columns: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     * ?????? cell ?????????????????? [bottom&top, right&left]
     */
    gap: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.number]),
    /**
     * ??????????????????
     */
    component: PropTypes.elementType,
    /**
     * ????????????????????????????????????????????????????????????????????????????????????
     */
    dense: PropTypes.bool,
    style: PropTypes.object
}, _class.defaultProps = {
    prefix: 'next-',
    component: 'div',
    device: 'desktop',
    dense: false
}, _temp);
ResponsiveGrid.displayName = 'ResponsiveGrid';


ResponsiveGrid.Cell = Cell;

export default ConfigProvider.config(ResponsiveGrid);
import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import HeaderComponent from '../base/header';

/* eslint-disable react/prefer-stateless-function */
var FixedHeader = (_temp = _class = function (_React$Component) {
    _inherits(FixedHeader, _React$Component);

    function FixedHeader() {
        _classCallCheck(this, FixedHeader);

        return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
    }

    FixedHeader.prototype.componentDidMount = function componentDidMount() {
        this.context.getNode('header', findDOMNode(this));
    };

    // 这里的 style={{overflow: 'unset'}} 可以删掉，只是为了解决用户js升级但是样式没升级的情况
    // 这里的 style={{position: 'absolute', right: 0}} 也可以删掉，是为了兼容用户js升级但是样式没升级的情况


    FixedHeader.prototype.render = function render() {
        var _props = this.props,
            prefix = _props.prefix,
            className = _props.className,
            colGroup = _props.colGroup,
            tableWidth = _props.tableWidth,
            others = _objectWithoutProperties(_props, ['prefix', 'className', 'colGroup', 'tableWidth']);

        var _context = this.context,
            onFixedScrollSync = _context.onFixedScrollSync,
            lockType = _context.lockType;


        return React.createElement(
            'div',
            { className: className, onScroll: onFixedScrollSync },
            React.createElement(
                'div',
                { className: prefix + 'table-header-inner', style: { overflow: 'unset' } },
                React.createElement(
                    'table',
                    { style: { width: tableWidth } },
                    colGroup,
                    React.createElement(HeaderComponent, _extends({}, others, { prefix: prefix }))
                )
            ),
            !lockType && React.createElement('div', { className: prefix + 'table-header-fixer', style: { position: 'absolute', right: 0 } })
        );
    };

    return FixedHeader;
}(React.Component), _class.propTypes = {
    children: PropTypes.any,
    prefix: PropTypes.string,
    className: PropTypes.string,
    colGroup: PropTypes.any,
    tableWidth: PropTypes.number
}, _class.contextTypes = {
    getNode: PropTypes.func,
    onFixedScrollSync: PropTypes.func,
    lockType: PropTypes.oneOf(['left', 'right'])
}, _temp);
FixedHeader.displayName = 'FixedHeader';
export { FixedHeader as default };
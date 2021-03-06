import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';

/* eslint-disable react/prefer-stateless-function */
var Wrapper = (_temp = _class = function (_Component) {
    _inherits(Wrapper, _Component);

    function Wrapper() {
        _classCallCheck(this, Wrapper);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    Wrapper.prototype.render = function render() {
        var _props = this.props,
            colGroup = _props.colGroup,
            children = _props.children,
            tableWidth = _props.tableWidth,
            Tag = _props.component;

        return React.createElement(
            Tag,
            { role: 'table', style: { width: tableWidth } },
            colGroup,
            children
        );
    };

    return Wrapper;
}(Component), _class.propTypes = {
    tableWidth: PropTypes.number
}, _temp);
Wrapper.displayName = 'Wrapper';
export { Wrapper as default };


Wrapper.defaultProps = {
    component: 'table'
};

Wrapper.propTypes = {
    children: PropTypes.any,
    prefix: PropTypes.string,
    colGroup: PropTypes.any,
    component: PropTypes.string
};
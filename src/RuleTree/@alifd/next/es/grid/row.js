import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

/**
 * Grid.Row
 * @order 1
 */
var Row = (_temp = _class = function (_Component) {
    _inherits(Row, _Component);

    function Row() {
        _classCallCheck(this, Row);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    Row.prototype.render = function render() {
        var _extends2, _extends3;

        /* eslint-disable no-unused-vars */
        var _props = this.props,
            prefix = _props.prefix,
            pure = _props.pure,
            wrap = _props.wrap,
            fixed = _props.fixed,
            gutter = _props.gutter,
            fixedWidth = _props.fixedWidth,
            align = _props.align,
            justify = _props.justify,
            hidden = _props.hidden,
            className = _props.className,
            Tag = _props.component,
            children = _props.children,
            rtl = _props.rtl,
            others = _objectWithoutProperties(_props, ['prefix', 'pure', 'wrap', 'fixed', 'gutter', 'fixedWidth', 'align', 'justify', 'hidden', 'className', 'component', 'children', 'rtl']);
        /* eslint-enable no-unused-vars */

        var hiddenClassObj = void 0;
        if (hidden === true) {
            var _hiddenClassObj;

            hiddenClassObj = (_hiddenClassObj = {}, _hiddenClassObj[prefix + 'row-hidden'] = true, _hiddenClassObj);
        } else if (typeof hidden === 'string') {
            var _hiddenClassObj2;

            hiddenClassObj = (_hiddenClassObj2 = {}, _hiddenClassObj2[prefix + 'row-' + hidden + '-hidden'] = !!hidden, _hiddenClassObj2);
        } else if (Array.isArray(hidden)) {
            hiddenClassObj = hidden.reduce(function (ret, point) {
                ret[prefix + 'row-' + point + '-hidden'] = !!point;
                return ret;
            }, {});
        }

        var newClassName = cx(_extends((_extends2 = {}, _extends2[prefix + 'row'] = true, _extends2[prefix + 'row-wrap'] = wrap, _extends2[prefix + 'row-fixed'] = fixed, _extends2[prefix + 'row-fixed-' + fixedWidth] = !!fixedWidth, _extends2[prefix + 'row-justify-' + justify] = !!justify, _extends2[prefix + 'row-align-' + align] = !!align, _extends2), hiddenClassObj, (_extends3 = {}, _extends3[className] = !!className, _extends3)));

        var newChildren = children;
        var gutterNumber = parseInt(gutter, 10);
        if (gutterNumber !== 0) {
            var halfGutterString = gutterNumber / 2 + 'px';
            others.style = _extends({
                marginLeft: '-' + halfGutterString,
                marginRight: '-' + halfGutterString
            }, others.style || {});
            newChildren = Children.map(children, function (child) {
                if (child && child.type && typeof child.type === 'function' && child.type.isNextCol) {
                    var newChild = cloneElement(child, {
                        style: _extends({
                            paddingLeft: halfGutterString,
                            paddingRight: halfGutterString
                        }, child.style || {})
                    });
                    return newChild;
                }

                return child;
            });
        }

        return React.createElement(
            Tag,
            _extends({
                dir: rtl ? 'rtl' : 'ltr',
                role: 'row',
                className: newClassName
            }, others),
            newChildren
        );
    };

    return Row;
}(Component), _class.propTypes = {
    prefix: PropTypes.string,
    pure: PropTypes.bool,
    rtl: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
    /**
     * ?????????
     */
    children: PropTypes.node,
    /**
     * ?????????
     */
    gutter: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * ???????????????????????????????????????
     */
    wrap: PropTypes.bool,
    /**
     * ??????????????????????????????????????????????????????????????????????????????????????????
     */
    fixed: PropTypes.bool,
    /**
     * ????????????????????????????????????????????????????????????????????????
     * @enumdesc 320px, 480px, 720px, 990px, 1200px, 1500px
     */
    fixedWidth: PropTypes.oneOf(['xxs', 'xs', 's', 'm', 'l', 'xl']),
    /**
     * ????????????IE9??????????????????????????????????????????
     * @enumdesc ????????????, ????????????, ????????????, ??????????????????????????????, ???????????????????????? auto?????????????????????????????????
     */
    align: PropTypes.oneOf(['top', 'center', 'bottom', 'baseline', 'stretch']),
    /**
     * ????????????IE9??????????????????????????????????????????????????????
     * @enumdesc ?????????, ????????????, ?????????, ????????????????????????????????????, ??????????????????????????????????????????????????????????????????????????????
     */
    justify: PropTypes.oneOf(['start', 'center', 'end', 'space-between', 'space-around']),
    /**
     * ???????????????????????????????????????<br><br>**?????????**:<br>true(????????????????????????)<br>false(????????????????????????)<br>'xs'(??? xs ??????????????????<br>['xxs', 'xs', 's', 'm', 'l', 'xl'](??? xxs, xs, s, m, l, xl ??????????????????
     */
    hidden: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.array]),
    /**
     * ????????????????????????????????????
     * - ????????? 'div'
     */
    component: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
}, _class.defaultProps = {
    prefix: 'next-',
    pure: false,
    fixed: false,
    gutter: 0,
    wrap: false,
    component: 'div'
}, _temp);
Row.displayName = 'Row';
export { Row as default };
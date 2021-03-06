import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Menu from '../menu';
import Icon from '../icon';

/**
 * Nav.SubNav
 * @description 继承自 `Menu.SubMenu` 的能力请查看 `Menu.SubMenu` 文档
 */
var SubNav = (_temp = _class = function (_Component) {
    _inherits(SubNav, _Component);

    function SubNav() {
        _classCallCheck(this, SubNav);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    SubNav.prototype.render = function render() {
        var _classNames;

        var _context = this.context,
            prefix = _context.prefix,
            iconOnly = _context.iconOnly,
            iconOnlyWidth = _context.iconOnlyWidth,
            hasArrow = _context.hasArrow,
            noIcon = _context.noIcon,
            mode = _context.mode;

        var _props = this.props,
            className = _props.className,
            icon = _props.icon,
            label = _props.label,
            children = _props.children,
            level = _props.level,
            others = _objectWithoutProperties(_props, ['className', 'icon', 'label', 'children', 'level']);

        var cls = classNames((_classNames = {}, _classNames[prefix + 'nav-sub-nav-item'] = true, _classNames[prefix + 'nav-popup'] = mode === 'popup', _classNames[className] = !!className, _classNames));
        var iconEl = typeof icon === 'string' ? React.createElement(Icon, { className: prefix + 'nav-icon', type: icon }) : icon;
        // 这里是为 iconOnly 模式下，添加默认的展开按钮
        // 只有在 inline 模式下 或 popup模式的第一层级，才需要添加默认的按钮
        if (iconOnly && hasArrow && (mode === 'inline' || level === 1 && mode === 'popup')) {
            iconEl = React.createElement(Icon, {
                className: prefix + 'nav-icon-only-arrow',
                type: mode === 'popup' ? 'arrow-right' : 'arrow-down'
            });
        }

        var newLabel = [iconEl ? cloneElement(iconEl, { key: 'icon' }) : null];

        var showLabel = !iconOnly || iconOnly && !iconOnlyWidth;

        if (showLabel) {
            newLabel.push(React.createElement(
                'span',
                { key: 'label' },
                label
            ));
        }

        var title = void 0;

        if (typeof label === 'string') {
            title = label;
        }

        return React.createElement(
            Menu.SubMenu,
            _extends({ className: cls, label: newLabel, level: level, title: title, noIcon: noIcon }, others),
            children
        );
    };

    return SubNav;
}(Component), _class.menuChildType = 'submenu', _class.propTypes = {
    /**
     * 自定义类名
     */
    className: PropTypes.string,
    /**
     * 自定义图标，可以使用 Icon 的 type，也可以使用组件 `<Icon type="your type" />`
     */
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    /**
     * 标签内容
     */
    label: PropTypes.node,
    /**
     * 是否可选
     */
    selectable: PropTypes.bool,
    /**
     * 导航项和子导航
     */
    children: PropTypes.node,
    /**
     * 是否需要提示当前项可展开的 icon，默认是有的
     */
    noIcon: PropTypes.bool
}, _class.defaultProps = {
    selectable: false
}, _class.contextTypes = {
    prefix: PropTypes.string,
    mode: PropTypes.string,
    iconOnly: PropTypes.bool,
    iconOnlyWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    hasArrow: PropTypes.bool
}, _temp);
SubNav.displayName = 'SubNav';


export default SubNav;
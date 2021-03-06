import _extends from 'babel-runtime/helpers/extends';
import _typeof from 'babel-runtime/helpers/typeof';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp2;

import React, { Component, Children, isValidElement } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ConfigProvider from '../../config-provider';
import { obj, log } from '../../util';

function mapIconSize(size) {
    return {
        large: 'small',
        medium: 'xs',
        small: 'xs'
    }[size];
}

/** Button */
var Button = (_temp2 = _class = function (_Component) {
    _inherits(Button, _Component);

    function Button() {
        var _temp, _this, _ret;

        _classCallCheck(this, Button);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.onMouseUp = function (e) {
            _this.button.blur();

            if (_this.props.onMouseUp) {
                _this.props.onMouseUp(e);
            }
        }, _this.buttonRefHandler = function (button) {
            _this.button = button;
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    Button.prototype.render = function render() {
        var _btnClsObj;

        var _props = this.props,
            prefix = _props.prefix,
            className = _props.className,
            type = _props.type,
            size = _props.size,
            htmlType = _props.htmlType,
            loading = _props.loading,
            text = _props.text,
            warning = _props.warning,
            ghost = _props.ghost,
            component = _props.component,
            iconSize = _props.iconSize,
            icons = _props.icons,
            disabled = _props.disabled,
            onClick = _props.onClick,
            children = _props.children,
            rtl = _props.rtl,
            others = _objectWithoutProperties(_props, ['prefix', 'className', 'type', 'size', 'htmlType', 'loading', 'text', 'warning', 'ghost', 'component', 'iconSize', 'icons', 'disabled', 'onClick', 'children', 'rtl']);

        var ghostType = ['light', 'dark'].indexOf(ghost) >= 0 ? ghost : 'dark';

        var btnClsObj = (_btnClsObj = {}, _btnClsObj[prefix + 'btn'] = true, _btnClsObj['' + prefix + size] = size, _btnClsObj[prefix + 'btn-' + type] = type && !ghost, _btnClsObj[prefix + 'btn-text'] = text, _btnClsObj[prefix + 'btn-warning'] = warning, _btnClsObj[prefix + 'btn-loading'] = loading, _btnClsObj[prefix + 'btn-ghost'] = ghost, _btnClsObj[prefix + 'btn-' + ghostType] = ghost, _btnClsObj[className] = className, _btnClsObj);

        var loadingIcon = null;

        // ??????????????? loading ??? icons???????????????????????????
        if (icons && icons.loading && isValidElement(icons.loading)) {
            var _classNames;

            if (loading) {
                delete btnClsObj[prefix + 'btn-loading'];
                btnClsObj[prefix + 'btn-custom-loading'] = true;
            }

            var loadingSize = iconSize || mapIconSize(size);
            loadingIcon = React.cloneElement(icons.loading, {
                className: classNames((_classNames = {}, _classNames[prefix + 'btn-custom-loading-icon'] = true, _classNames.show = loading, _classNames)),
                size: loadingSize
            });
        }

        var count = Children.count(children);
        var clonedChildren = Children.map(children, function (child, index) {
            if (child && ['function', 'object'].indexOf(_typeof(child.type)) > -1 && child.type._typeMark === 'icon') {
                var _classNames2;

                var iconCls = classNames((_classNames2 = {}, _classNames2[prefix + 'btn-icon'] = !iconSize, _classNames2[prefix + 'icon-first'] = count > 1 && index === 0, _classNames2[prefix + 'icon-last'] = count > 1 && index === count - 1, _classNames2[prefix + 'icon-alone'] = count === 1, _classNames2[child.props.className] = !!child.props.className, _classNames2));

                if ('size' in child.props) {
                    log.warning('The size of Icon will not take effect, when Icon is the [direct child element] of Button(<Button><Icon size="' + child.props.size + '" /></Button>), use <Button iconSize="' + child.props.size + '"> or <Button><div><Icon size="' + child.props.size + '" /></div></Button> instead of.');
                }
                return React.cloneElement(child, {
                    className: iconCls,
                    size: iconSize || mapIconSize(size)
                });
            }

            if (!isValidElement(child)) {
                return React.createElement(
                    'span',
                    { className: prefix + 'btn-helper' },
                    child
                );
            }

            return child;
        });

        var TagName = component;
        var tagAttrs = _extends({}, obj.pickOthers(Object.keys(Button.propTypes), others), {
            type: htmlType,
            disabled: disabled,
            onClick: onClick,
            className: classNames(btnClsObj)
        });

        if (TagName !== 'button') {
            delete tagAttrs.type;

            if (tagAttrs.disabled) {
                delete tagAttrs.onClick; // a ????????? onClick ???????????????????????????
                tagAttrs.href && delete tagAttrs.href; // a ?????????????????????????????????
            }
        }

        return React.createElement(
            TagName,
            _extends({}, tagAttrs, { dir: rtl ? 'rtl' : undefined, onMouseUp: this.onMouseUp, ref: this.buttonRefHandler }),
            loadingIcon,
            clonedChildren
        );
    };

    return Button;
}(Component), _class.propTypes = _extends({}, ConfigProvider.propTypes, {
    prefix: PropTypes.string,
    rtl: PropTypes.bool,
    /**
     * ???????????????
     */
    type: PropTypes.oneOf(['primary', 'secondary', 'normal']),
    /**
     * ???????????????
     */
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    /**
     * ????????????????????? Icon???????????? { loading: <Icon type="loading" /> }
     */
    icons: PropTypes.shape({
        loading: PropTypes.node
    }),
    /**
     * ????????? Icon ???????????????????????? Icon ???????????????
     */
    iconSize: PropTypes.oneOfType([PropTypes.oneOf(['xxs', 'xs', 'small', 'medium', 'large', 'xl', 'xxl', 'xxxl', 'inherit']), PropTypes.number]),
    /**
     * ??? component = 'button' ???????????? button ????????? type ???
     */
    htmlType: PropTypes.oneOf(['submit', 'reset', 'button']),
    /**
     * ??????????????????
     */
    component: PropTypes.oneOf(['button', 'a', 'div', 'span']),
    /**
     * ???????????????????????????
     */
    loading: PropTypes.bool,
    /**
     * ?????????????????????
     */
    ghost: PropTypes.oneOf([true, false, 'light', 'dark']),
    /**
     * ?????????????????????
     */
    text: PropTypes.bool,
    /**
     * ?????????????????????
     */
    warning: PropTypes.bool,
    /**
     * ????????????
     */
    disabled: PropTypes.bool,
    /**
     * ?????????????????????
     * @param {Object} e Event Object
     */
    onClick: PropTypes.func,
    className: PropTypes.string,
    onMouseUp: PropTypes.func,
    children: PropTypes.node
}), _class.defaultProps = {
    prefix: 'next-',
    type: 'normal',
    size: 'medium',
    icons: {},
    htmlType: 'button',
    component: 'button',
    loading: false,
    ghost: false,
    text: false,
    warning: false,
    disabled: false,
    onClick: function onClick() {}
}, _temp2);
Button.displayName = 'Button';
export { Button as default };
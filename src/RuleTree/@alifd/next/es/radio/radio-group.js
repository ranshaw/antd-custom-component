import _extends from 'babel-runtime/helpers/extends';
import _typeof from 'babel-runtime/helpers/typeof';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { polyfill } from 'react-lifecycles-compat';
import ConfigProvider from '../config-provider';
import { obj } from '../util';
import Radio from './radio';

var pickOthers = obj.pickOthers;

/**
 * Radio.Group
 * @order 2
 */

var RadioGroup = (_temp = _class = function (_Component) {
    _inherits(RadioGroup, _Component);

    function RadioGroup(props) {
        _classCallCheck(this, RadioGroup);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        var value = '';
        if ('value' in props) {
            value = props.value;
        } else if ('defaultValue' in props) {
            value = props.defaultValue;
        }

        _this.state = { value: value };
        _this.onChange = _this.onChange.bind(_this);
        return _this;
    }

    RadioGroup.getDerivedStateFromProps = function getDerivedStateFromProps(props, state) {
        if ('value' in props && props.value !== state.value) {
            return {
                value: props.value
            };
        }

        return null;
    };

    RadioGroup.prototype.getChildContext = function getChildContext() {
        var disabled = this.props.disabled;


        return {
            __group__: true,
            isButton: this.props.shape === 'button',
            onChange: this.onChange,
            selectedValue: this.state.value,
            disabled: disabled
        };
    };

    RadioGroup.prototype.onChange = function onChange(currentValue, e) {
        if (!('value' in this.props)) {
            this.setState({ value: currentValue });
        }
        if (currentValue !== this.state.value) {
            this.props.onChange(currentValue, e);
        }
    };

    RadioGroup.prototype.render = function render() {
        var _this2 = this,
            _classnames;

        var _props = this.props,
            rtl = _props.rtl,
            className = _props.className,
            disabled = _props.disabled,
            shape = _props.shape,
            size = _props.size,
            style = _props.style,
            prefix = _props.prefix,
            direction = _props.direction,
            component = _props.component,
            isPreview = _props.isPreview,
            renderPreview = _props.renderPreview;

        var others = pickOthers(Object.keys(RadioGroup.propTypes), this.props);

        if (rtl) {
            others.dir = 'rtl';
        }

        var children = void 0;
        var previewed = {};
        if (this.props.children) {
            children = React.Children.map(this.props.children, function (child, index) {
                if (!React.isValidElement(child)) {
                    return child;
                }
                var checked = _this2.state.value === child.props.value;
                if (checked) {
                    previewed.label = child.props.children;
                    previewed.value = child.props.value;
                }
                var tabIndex = index === 0 && !_this2.state.value || checked ? 0 : -1;
                var childrtl = child.props.rtl === undefined ? rtl : child.props.rtl;
                if (child.type && child.type.displayName === 'Config(Radio)') {
                    return React.cloneElement(child, {
                        checked: checked,
                        tabIndex: tabIndex,
                        rtl: childrtl
                    });
                }
                return React.cloneElement(child, {
                    checked: checked,
                    rtl: childrtl
                });
            });
        } else {
            children = this.props.dataSource.map(function (item, index) {
                var option = item;
                if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) !== 'object') {
                    option = {
                        label: item,
                        value: item,
                        disabled: disabled
                    };
                }
                var checked = _this2.state.value === option.value;
                if (checked) {
                    previewed.label = option.label;
                    previewed.value = option.value;
                }
                return React.createElement(Radio, {
                    key: index,
                    tabIndex: index === 0 && !_this2.state.value || checked ? 0 : -1,
                    value: option.value,
                    checked: checked,
                    label: option.label,
                    disabled: disabled || option.disabled
                });
            });
        }
        if (isPreview) {
            var previewCls = classnames(className, prefix + 'form-preview');

            if ('renderPreview' in this.props) {
                return React.createElement(
                    'div',
                    _extends({}, others, { className: previewCls }),
                    renderPreview(previewed, this.props)
                );
            }

            return React.createElement(
                'p',
                _extends({}, others, { className: previewCls }),
                previewed.label
            );
        }

        var isButtonShape = shape === 'button';

        var cls = classnames((_classnames = {}, _classnames[prefix + 'radio-group'] = true, _classnames[prefix + 'radio-group-' + direction] = !isButtonShape, _classnames[prefix + 'radio-button'] = isButtonShape, _classnames[prefix + 'radio-button-' + size] = isButtonShape, _classnames[className] = !!className, _classnames.disabled = disabled, _classnames));

        var TagName = component;
        return React.createElement(
            TagName,
            _extends({}, others, { 'aria-disabled': disabled, role: 'radiogroup', className: cls, style: style }),
            children
        );
    };

    return RadioGroup;
}(Component), _class.propTypes = _extends({}, ConfigProvider.propTypes, {
    /**
     * ???????????????????????????
     */
    prefix: PropTypes.string,
    /**
     * ???????????????
     */
    className: PropTypes.string,
    /**
     * ?????????????????????
     */
    style: PropTypes.object,
    /**
     * name
     */
    name: PropTypes.string,
    /**
     * radio group??????????????????
     */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    /**
     * radio group????????????
     */
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    /**
     * ??????????????????
     */
    component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    /**
     * ???????????????????????????
     * @param {String/Number} value ???????????????
     * @param {Event} e Dom ????????????
     */
    onChange: PropTypes.func,
    /**
     * ??????radio?????????
     */
    disabled: PropTypes.bool,
    /**
     * ??????????????? button ????????????
     * @enumdesc ?????????
     */
    shape: PropTypes.oneOf(['normal', 'button']),
    /**
     * ??? `shape` ?????????????????????shape??????button?????????
     * @enumdesc ???, ???, ???
     */
    size: PropTypes.oneOf(['large', 'medium', 'small']),
    /**
     * ???????????????, ??????????????? String ?????? Object, ??? `['apple', 'pear', 'orange']` `[{label: 'apply', value: 'apple'}]`
     */
    dataSource: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.arrayOf(PropTypes.object)]),
    /**
     * ?????????????????????????????????radio
     */
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]),

    /**
     * ????????????????????????
     * - hoz: ???????????? (default)
     * - ver: ????????????
     */
    direction: PropTypes.oneOf(['hoz', 'ver']),
    /**
     * ??????????????????
     */
    isPreview: PropTypes.bool,
    /**
     * ?????????????????????????????????
     * @param {Object} previewed ????????????{label: "", value: ""}
     * @param {Object} props ?????????????????????
     * @returns {reactNode} Element ????????????
     */
    renderPreview: PropTypes.func
}), _class.defaultProps = {
    dataSource: [],
    size: 'medium',
    onChange: function onChange() {},
    prefix: 'next-',
    component: 'div',
    direction: 'hoz',
    isPreview: false
}, _class.childContextTypes = {
    onChange: PropTypes.func,
    __group__: PropTypes.bool,
    isButton: PropTypes.bool,
    selectedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    disabled: PropTypes.bool
}, _temp);
RadioGroup.displayName = 'RadioGroup';


export default polyfill(RadioGroup);
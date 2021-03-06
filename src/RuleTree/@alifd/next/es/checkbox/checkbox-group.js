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
import { obj } from '../util';
import Checkbox from './checkbox';

var pickOthers = obj.pickOthers;

/** Checkbox.Group */

var CheckboxGroup = (_temp = _class = function (_Component) {
    _inherits(CheckboxGroup, _Component);

    function CheckboxGroup(props) {
        _classCallCheck(this, CheckboxGroup);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        var value = [];
        if ('value' in props) {
            value = props.value;
        } else if ('defaultValue' in props) {
            value = props.defaultValue;
        }
        if (!Array.isArray(value)) {
            if (value === null || value === undefined) {
                value = [];
            } else {
                value = [value];
            }
        }
        _this.state = {
            value: [].concat(value)
        };

        _this.onChange = _this.onChange.bind(_this);
        return _this;
    }

    CheckboxGroup.prototype.getChildContext = function getChildContext() {
        return {
            __group__: true,
            onChange: this.onChange,
            selectedValue: this.state.value,
            disabled: this.props.disabled
        };
    };

    CheckboxGroup.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps) {
        if ('value' in nextProps) {
            var value = nextProps.value;

            if (!Array.isArray(value)) {
                if (value === null || value === undefined) {
                    value = [];
                } else {
                    value = [value];
                }
            }

            return { value: value };
        }

        return null;
    };

    CheckboxGroup.prototype.onChange = function onChange(currentValue, e) {
        var value = this.state.value;

        var index = value.indexOf(currentValue);
        var valTemp = [].concat(value);

        if (index === -1) {
            valTemp.push(currentValue);
        } else {
            valTemp.splice(index, 1);
        }

        if (!('value' in this.props)) {
            this.setState({ value: valTemp });
        }
        this.props.onChange(valTemp, e);
    };

    CheckboxGroup.prototype.render = function render() {
        var _this2 = this,
            _classnames;

        var _props = this.props,
            className = _props.className,
            style = _props.style,
            prefix = _props.prefix,
            disabled = _props.disabled,
            direction = _props.direction,
            rtl = _props.rtl,
            isPreview = _props.isPreview,
            renderPreview = _props.renderPreview;

        var others = pickOthers(CheckboxGroup.propTypes, this.props);

        // ?????????????????????dataSource????????????????????????????????????
        var children = void 0;
        var previewed = [];
        if (this.props.children) {
            children = React.Children.map(this.props.children, function (child) {
                if (!React.isValidElement(child)) {
                    return child;
                }
                var checked = _this2.state.value && _this2.state.value.indexOf(child.props.value) > -1;

                if (checked) {
                    previewed.push({
                        label: child.props.children,
                        value: child.props.value
                    });
                }

                return React.cloneElement(child, child.props.rtl === undefined ? { rtl: rtl } : null);
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
                var checked = _this2.state.value && _this2.state.value.indexOf(option.value) > -1;

                if (checked) {
                    previewed.push({
                        label: option.label,
                        value: option.value
                    });
                }

                return React.createElement(Checkbox, {
                    key: index,
                    value: option.value,
                    checked: checked,
                    rtl: rtl,
                    disabled: disabled || option.disabled,
                    label: option.label
                });
            });
        }

        if (isPreview) {
            var previewCls = classnames(className, prefix + 'form-preview');

            if ('renderPreview' in this.props) {
                return React.createElement(
                    'div',
                    _extends({}, others, { dir: rtl ? 'rtl' : undefined, className: previewCls }),
                    renderPreview(previewed, this.props)
                );
            }

            return React.createElement(
                'p',
                _extends({}, others, { dir: rtl ? 'rtl' : undefined, className: previewCls }),
                previewed.map(function (item) {
                    return item.label;
                }).join(', ')
            );
        }

        var cls = classnames((_classnames = {}, _classnames[prefix + 'checkbox-group'] = true, _classnames[prefix + 'checkbox-group-' + direction] = true, _classnames[className] = !!className, _classnames.disabled = disabled, _classnames));

        return React.createElement(
            'span',
            _extends({ dir: rtl ? 'rtl' : undefined }, others, { className: cls, style: style }),
            children
        );
    };

    return CheckboxGroup;
}(Component), _class.propTypes = {
    prefix: PropTypes.string,
    rtl: PropTypes.bool,
    /**
     * ???????????????
     */
    className: PropTypes.string,
    /**
     * ?????????????????????
     */
    style: PropTypes.object,
    /**
     * ????????????
     */
    disabled: PropTypes.bool,
    /**
     * ???????????????, ??????????????? String ?????? Object, ??? `['apple', 'pear', 'orange']` ?????? `[{value: 'apple', label: '??????',}, {value: 'pear', label: '???'}, {value: 'orange', label: '??????'}]`
     */
    dataSource: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.arrayOf(PropTypes.object)]),
    /**
     * ?????????????????????
     */
    value: PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.number]),
    /**
     * ???????????????????????????
     */
    defaultValue: PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.number]),
    /**
     * ????????????????????????????????? checkbox
     */
    children: PropTypes.arrayOf(PropTypes.element),
    /**
     * ???????????????????????????
     * @param {Array} value ???????????????
     * @param {Event} e Dom ????????????
     */
    onChange: PropTypes.func,

    /**
     * ????????????????????????
     * - hoz: ???????????? (default)
     * - ver: ????????????
     */
    direction: PropTypes.oneOf(['hoz', 'ver']),
    /**
     * ??????????????????
     * @version 1.19
     */
    isPreview: PropTypes.bool,
    /**
     * ?????????????????????????????????
     * @param {Array} previewed ????????? [{label: '', value:''},...]
     * @param {Object} props ?????????????????????
     * @returns {reactNode} Element ????????????
     * @version 1.19
     */
    renderPreview: PropTypes.func
}, _class.defaultProps = {
    dataSource: [],
    onChange: function onChange() {},
    prefix: 'next-',
    direction: 'hoz',
    isPreview: false
}, _class.childContextTypes = {
    onChange: PropTypes.func,
    __group__: PropTypes.bool,
    selectedValue: PropTypes.array,
    disabled: PropTypes.bool
}, _temp);
CheckboxGroup.displayName = 'CheckboxGroup';


export default polyfill(CheckboxGroup);
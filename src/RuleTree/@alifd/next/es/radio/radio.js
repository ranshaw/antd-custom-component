import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { polyfill } from 'react-lifecycles-compat';
import UIState from '../mixin-ui-state';
import ConfigProvider from '../config-provider';
import withContext from './with-context';
import { obj, func } from '../util';

var makeChain = func.makeChain,
    noop = func.noop;
/**
 * Radio
 * @order 1
 */

var Radio = (_temp = _class = function (_UIState) {
    _inherits(Radio, _UIState);

    function Radio(props) {
        _classCallCheck(this, Radio);

        var _this = _possibleConstructorReturn(this, _UIState.call(this, props));

        var context = props.context;

        var checked = void 0;
        if (context.__group__) {
            checked = context.selectedValue === props.value;
        } else if ('checked' in props) {
            checked = props.checked;
        } else {
            checked = props.defaultChecked;
        }

        _this.state = { checked: checked };

        _this.onChange = _this.onChange.bind(_this);
        return _this;
    }

    Radio.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps) {
        var nextContext = nextProps.context;


        if (nextContext.__group__ && 'selectedValue' in nextContext) {
            return {
                checked: nextContext.selectedValue === nextProps.value
            };
        } else if ('checked' in nextProps) {
            return {
                checked: nextProps.checked
            };
        }

        return null;
    };

    Radio.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState, nextContext) {
        var shallowEqual = obj.shallowEqual;

        return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState) || !shallowEqual(this.context, nextContext);
    };

    Radio.prototype.componentDidUpdate = function componentDidUpdate() {
        // when disabled, reset UIState
        if (this.disabled) {
            // only class has an impact, no effect on visual
            this.resetUIState();
        }
    };

    Radio.prototype.onChange = function onChange(e) {
        var checked = e.target.checked;
        var _props = this.props,
            context = _props.context,
            value = _props.value;


        if (context.__group__) {
            context.onChange(value, e);
        } else if (this.state.checked !== checked) {
            if (!('checked' in this.props)) {
                this.setState({
                    checked: checked
                });
            }
            this.props.onChange(checked, e);
        }
    };

    Radio.prototype.render = function render() {
        var _classnames, _classnames2, _classnames3;

        /* eslint-disable no-unused-vars */
        var _props2 = this.props,
            id = _props2.id,
            className = _props2.className,
            children = _props2.children,
            style = _props2.style,
            label = _props2.label,
            onMouseEnter = _props2.onMouseEnter,
            onMouseLeave = _props2.onMouseLeave,
            tabIndex = _props2.tabIndex,
            rtl = _props2.rtl,
            name = _props2.name,
            isPreview = _props2.isPreview,
            renderPreview = _props2.renderPreview,
            value = _props2.value,
            context = _props2.context,
            otherProps = _objectWithoutProperties(_props2, ['id', 'className', 'children', 'style', 'label', 'onMouseEnter', 'onMouseLeave', 'tabIndex', 'rtl', 'name', 'isPreview', 'renderPreview', 'value', 'context']);

        var checked = !!this.state.checked;
        var disabled = this.disabled;
        var isButton = context.isButton;
        var prefix = context.prefix || this.props.prefix;

        var others = obj.pickOthers(Radio.propTypes, otherProps);
        var othersData = obj.pickAttrsWith(others, 'data-');

        if (isPreview) {
            var previewCls = classnames(className, prefix + 'form-preview');

            if ('renderPreview' in this.props) {
                return React.createElement(
                    'div',
                    _extends({ id: id, dir: rtl ? 'rtl' : 'ltr' }, others, { className: previewCls }),
                    renderPreview(checked, this.props)
                );
            }

            return React.createElement(
                'p',
                _extends({ id: id, dir: rtl ? 'rtl' : 'ltr' }, others, { className: previewCls }),
                checked && (children || label || value)
            );
        }

        var input = React.createElement('input', _extends({}, obj.pickOthers(othersData, others), {
            name: name,
            id: id,
            tabIndex: tabIndex,
            disabled: disabled,
            checked: checked,
            type: 'radio',
            onChange: this.onChange,
            'aria-checked': checked,
            className: prefix + 'radio-input'
        }));

        // disabled do not hove focus state
        if (!disabled) {
            input = this.getStateElement(input);
        }

        var cls = classnames((_classnames = {}, _classnames[prefix + 'radio'] = true, _classnames.checked = checked, _classnames.disabled = disabled, _classnames[this.getStateClassName()] = true, _classnames));
        var clsInner = classnames((_classnames2 = {}, _classnames2[prefix + 'radio-inner'] = true, _classnames2.press = checked, _classnames2.unpress = !checked, _classnames2));
        var clsWrapper = classnames((_classnames3 = {}, _classnames3[prefix + 'radio-wrapper'] = true, _classnames3[className] = !!className, _classnames3.checked = checked, _classnames3.disabled = disabled, _classnames3[this.getStateClassName()] = true, _classnames3));
        var childrenCls = prefix + 'radio-label';

        var radioComp = !isButton ? React.createElement(
            'span',
            { className: cls },
            React.createElement('span', { className: clsInner }),
            input
        ) : React.createElement(
            'span',
            { className: prefix + 'radio-single-input' },
            input
        );

        return React.createElement(
            'label',
            _extends({}, othersData, {
                dir: rtl ? 'rtl' : 'ltr',
                style: style,
                'aria-checked': checked,
                'aria-disabled': disabled,
                className: clsWrapper,
                onMouseEnter: disabled ? onMouseEnter : makeChain(this._onUIMouseEnter, onMouseEnter),
                onMouseLeave: disabled ? onMouseLeave : makeChain(this._onUIMouseLeave, onMouseLeave)
            }),
            radioComp,
            [children, label].map(function (d, i) {
                return d !== undefined ? React.createElement(
                    'span',
                    { key: i, className: childrenCls },
                    d
                ) : null;
            })
        );
    };

    _createClass(Radio, [{
        key: 'disabled',
        get: function get() {
            var props = this.props;
            var context = props.context;


            var disabled = props.disabled || context.__group__ && 'disabled' in context && context.disabled;

            return disabled;
        }
    }]);

    return Radio;
}(UIState), _class.displayName = 'Radio', _class.propTypes = _extends({}, ConfigProvider.propTypes, {
    /**
     * ???????????????
     */
    className: PropTypes.string,
    /**
     * ??????input???id
     */
    id: PropTypes.string,
    /**
     * ?????????????????????
     */
    style: PropTypes.object,
    /**
     * ??????radio????????????
     */
    checked: PropTypes.bool,
    /**
     * ??????radio??????????????????
     */
    defaultChecked: PropTypes.bool,
    /**
     * ??????????????????label
     */
    label: PropTypes.node,
    /**
     * ??????????????????????????????
     * @param {Boolean} checked ????????????
     * @param {Event} e Dom ????????????
     */
    onChange: PropTypes.func,
    /**
     * ????????????enter??????
     * @param {Event} e Dom ????????????
     */
    onMouseEnter: PropTypes.func,
    /**
     * ??????????????????
     * @param {Event} e Dom ????????????
     */
    onMouseLeave: PropTypes.func,
    /**
     * radio???????????????
     */
    disabled: PropTypes.bool,
    /**
     * radio ???value
     */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    /**
     * name
     */
    name: PropTypes.string,
    /**
     * ??????????????????
     */
    isPreview: PropTypes.bool,
    /**
     * ?????????????????????????????????
     * @param {Boolean} checked ????????????
     * @param {Object} props ?????????????????????
     * @returns {reactNode} Element ????????????
     */
    renderPreview: PropTypes.func
}), _class.defaultProps = {
    onChange: noop,
    onMouseLeave: noop,
    onMouseEnter: noop,
    tabIndex: 0,
    prefix: 'next-',
    isPreview: false
}, _class.contextTypes = {
    onChange: PropTypes.func,
    __group__: PropTypes.bool,
    isButton: PropTypes.bool,
    selectedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    disabled: PropTypes.bool
}, _temp);


export default ConfigProvider.config(withContext(polyfill(Radio)));
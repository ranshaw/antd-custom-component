import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import _typeof from 'babel-runtime/helpers/typeof';

var _class, _temp;

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { obj, func } from '../util';
import Field from '../field';
import RGrid from '../responsive-grid';

function pickerDefined(obj) {
    var newObj = {};
    Object.keys(obj).forEach(function (i) {
        if (typeof obj[i] !== 'undefined') {
            newObj[i] = obj[i];
        }
    });
    return newObj;
}

function preventDefault(e) {
    e.preventDefault();
}
var getNewChildren = function getNewChildren(children, props) {
    var size = props.size,
        device = props.device,
        labelAlign = props.labelAlign,
        labelTextAlign = props.labelTextAlign,
        labelCol = props.labelCol,
        wrapperCol = props.wrapperCol,
        responsive = props.responsive,
        colon = props.colon;


    return React.Children.map(children, function (child) {
        if (obj.isReactFragment(child)) {
            return getNewChildren(child.props.children, props);
        }

        if (child && ['function', 'object'].indexOf(_typeof(child.type)) > -1 && child.type._typeMark === 'form_item') {
            var childrenProps = {
                labelCol: child.props.labelCol ? child.props.labelCol : labelCol,
                wrapperCol: child.props.wrapperCol ? child.props.wrapperCol : wrapperCol,
                labelAlign: child.props.labelAlign ? child.props.labelAlign : device === 'phone' ? 'top' : labelAlign,
                labelTextAlign: child.props.labelTextAlign ? child.props.labelTextAlign : labelTextAlign,
                colon: 'colon' in child.props ? child.props.colon : colon,
                size: child.props.size ? child.props.size : size,
                responsive: responsive
            };
            return React.cloneElement(child, pickerDefined(childrenProps));
        }
        return child;
    });
};

/** Form */
var Form = (_temp = _class = function (_React$Component) {
    _inherits(Form, _React$Component);

    function Form(props) {
        _classCallCheck(this, Form);

        var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

        _this.onChange = function (name, value) {
            _this.props.onChange(_this._formField.getValues(), {
                name: name,
                value: value,
                field: _this._formField
            });
        };

        _this._formField = null;
        if (props.field !== false) {
            var options = _extends({}, props.fieldOptions, {
                onChange: _this.onChange
            });

            if (props.field) {
                _this._formField = props.field;
                var onChange = _this._formField.options.onChange;
                options.onChange = func.makeChain(onChange, _this.onChange);
                _this._formField.setOptions && _this._formField.setOptions(options);
            } else {
                if ('value' in props) {
                    options.values = props.value;
                }

                _this._formField = new Field(_this, options);
            }

            if (props.locale && props.locale.Validate) {
                _this._formField.setOptions({ messages: props.locale.Validate });
            }

            props.saveField(_this._formField);
        }
        return _this;
    }

    Form.prototype.getChildContext = function getChildContext() {
        return {
            _formField: this.props.field ? this.props.field : this._formField,
            _formSize: this.props.size,
            _formDisabled: this.props.disabled,
            _formPreview: this.props.isPreview,
            _formFullWidth: this.props.fullWidth,
            _formLabelForErrorMessage: this.props.useLabelForErrorMessage
        };
    };

    Form.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
        var props = this.props;

        if (this._formField) {
            if ('value' in props && props.value !== prevProps.value) {
                this._formField.setValues(props.value);
            }
            if ('error' in props && props.error !== prevProps.error) {
                this._formField.setValues(props.error);
            }
        }
    };

    Form.prototype.render = function render() {
        var _classNames;

        var _props = this.props,
            className = _props.className,
            inline = _props.inline,
            size = _props.size,
            device = _props.device,
            labelAlign = _props.labelAlign,
            labelTextAlign = _props.labelTextAlign,
            onSubmit = _props.onSubmit,
            children = _props.children,
            labelCol = _props.labelCol,
            wrapperCol = _props.wrapperCol,
            style = _props.style,
            prefix = _props.prefix,
            rtl = _props.rtl,
            isPreview = _props.isPreview,
            Tag = _props.component,
            responsive = _props.responsive,
            gap = _props.gap,
            colon = _props.colon;


        var formClassName = classNames((_classNames = {}, _classNames[prefix + 'form'] = true, _classNames[prefix + 'inline'] = inline, _classNames['' + prefix + size] = size, _classNames[prefix + 'form-responsive-grid'] = responsive, _classNames[prefix + 'form-preview'] = isPreview, _classNames[className] = !!className, _classNames));

        var newChildren = getNewChildren(children, this.props);

        return React.createElement(
            Tag,
            _extends({
                role: 'grid'
            }, obj.pickOthers(Form.propTypes, this.props), {
                className: formClassName,
                style: style,
                dir: rtl ? 'rtl' : undefined,
                onSubmit: onSubmit
            }),
            responsive ? React.createElement(
                RGrid,
                { gap: gap },
                newChildren
            ) : newChildren
        );
    };

    return Form;
}(React.Component), _class.propTypes = {
    /**
     * ????????????
     */
    prefix: PropTypes.string,
    /**
     * ????????????
     */
    inline: PropTypes.bool,
    /**
     * ?????? Item ??? size ??????????????????????????? Form ??? size, ?????????????????? Item ???????????????????????????????????? size ???????????????
     * @enumdesc ???, ???, ???
     */
    size: PropTypes.oneOf(['large', 'medium', 'small']),
    /**
     * ?????? Item ?????????????????????????????????100%
     */
    fullWidth: PropTypes.bool,
    /**
     * ???????????????, ??????????????? labelCol ??? wrapperCol ???????????????????????????
     * @enumdesc ???, ???, ???
     */
    labelAlign: PropTypes.oneOf(['top', 'left', 'inset']),
    /**
     * ???????????????????????????
     * @enumdesc ???, ???
     */
    labelTextAlign: PropTypes.oneOf(['left', 'right']),
    /**
     * field ??????, ??? false ????????? field
     */
    field: PropTypes.any,
    /**
     * ?????? Form ??????????????? field ??????
     */
    saveField: PropTypes.func,
    /**
     * ??????????????? Item ??? labelCol
     */
    labelCol: PropTypes.object,
    /**
     * ??????????????? Item ??? wrapperCol
     */
    wrapperCol: PropTypes.object,
    /**
     * form?????? `htmlType="submit"` ???????????????????????????
     */
    onSubmit: PropTypes.func,
    /**
     * ?????????
     */
    children: PropTypes.any,
    /**
     * ??????class
     */
    className: PropTypes.string,
    /**
     * ?????????????????????
     */
    style: PropTypes.object,
    /**
     * ????????????
     */
    value: PropTypes.object,
    /**
     * ??????????????????
     * @param {Object} values ????????????
     * @param {Object} item ??????
     * @param {String} item.name ??????????????????
     * @param {String} item.value ???????????????
     * @param {Object} item.field field ??????
     */
    onChange: PropTypes.func,
    /**
     * ??????????????????
     */
    component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    fieldOptions: PropTypes.object,
    rtl: PropTypes.bool,
    /**
     * ??????????????????
     */
    device: PropTypes.oneOf(['phone', 'tablet', 'desktop']),
    /**
     * ???????????????????????????????????? ?????????ResponsiveGrid???
     * @version 1.19
     */
    responsive: PropTypes.bool,
    /**
     * ?????????????????????
     * @version 1.19
     */
    isPreview: PropTypes.bool,
    /**
     * ???????????? label ????????????????????? name ??????
     * @version 1.20
     */
    useLabelForErrorMessage: PropTypes.bool,
    /**
     * ?????????????????? label ???????????????
     * @version 1.22
     */
    colon: PropTypes.bool,
    /**
     * ??????????????????
     */
    disabled: PropTypes.bool,
    // ??? responsive????????????????????? ResponsiveGrid?????? ?????? ?????? cell ?????????????????? [bottom&top, right&left]
    gap: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.number])
}, _class.defaultProps = {
    prefix: 'next-',
    onSubmit: preventDefault,
    size: 'medium',
    labelAlign: 'left',
    onChange: func.noop,
    component: 'form',
    saveField: func.noop,
    device: 'desktop',
    colon: false,
    disabled: false
}, _class.childContextTypes = {
    _formField: PropTypes.object,
    _formSize: PropTypes.string,
    _formDisabled: PropTypes.bool,
    _formPreview: PropTypes.bool,
    _formFullWidth: PropTypes.bool,
    _formLabelForErrorMessage: PropTypes.bool
}, _temp);
Form.displayName = 'Form';
export { Form as default };
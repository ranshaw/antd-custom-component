'use strict';

exports.__esModule = true;
exports.default = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _util = require('../util');

var _field = require('../field');

var _field2 = _interopRequireDefault(_field);

var _responsiveGrid = require('../responsive-grid');

var _responsiveGrid2 = _interopRequireDefault(_responsiveGrid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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


    return _react2.default.Children.map(children, function (child) {
        if (_util.obj.isReactFragment(child)) {
            return getNewChildren(child.props.children, props);
        }

        if (child && ['function', 'object'].indexOf((0, _typeof3.default)(child.type)) > -1 && child.type._typeMark === 'form_item') {
            var childrenProps = {
                labelCol: child.props.labelCol ? child.props.labelCol : labelCol,
                wrapperCol: child.props.wrapperCol ? child.props.wrapperCol : wrapperCol,
                labelAlign: child.props.labelAlign ? child.props.labelAlign : device === 'phone' ? 'top' : labelAlign,
                labelTextAlign: child.props.labelTextAlign ? child.props.labelTextAlign : labelTextAlign,
                colon: 'colon' in child.props ? child.props.colon : colon,
                size: child.props.size ? child.props.size : size,
                responsive: responsive
            };
            return _react2.default.cloneElement(child, pickerDefined(childrenProps));
        }
        return child;
    });
};

/** Form */
var Form = (_temp = _class = function (_React$Component) {
    (0, _inherits3.default)(Form, _React$Component);

    function Form(props) {
        (0, _classCallCheck3.default)(this, Form);

        var _this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call(this, props));

        _this.onChange = function (name, value) {
            _this.props.onChange(_this._formField.getValues(), {
                name: name,
                value: value,
                field: _this._formField
            });
        };

        _this._formField = null;
        if (props.field !== false) {
            var options = (0, _extends3.default)({}, props.fieldOptions, {
                onChange: _this.onChange
            });

            if (props.field) {
                _this._formField = props.field;
                var onChange = _this._formField.options.onChange;
                options.onChange = _util.func.makeChain(onChange, _this.onChange);
                _this._formField.setOptions && _this._formField.setOptions(options);
            } else {
                if ('value' in props) {
                    options.values = props.value;
                }

                _this._formField = new _field2.default(_this, options);
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


        var formClassName = (0, _classnames2.default)((_classNames = {}, _classNames[prefix + 'form'] = true, _classNames[prefix + 'inline'] = inline, _classNames['' + prefix + size] = size, _classNames[prefix + 'form-responsive-grid'] = responsive, _classNames[prefix + 'form-preview'] = isPreview, _classNames[className] = !!className, _classNames));

        var newChildren = getNewChildren(children, this.props);

        return _react2.default.createElement(
            Tag,
            (0, _extends3.default)({
                role: 'grid'
            }, _util.obj.pickOthers(Form.propTypes, this.props), {
                className: formClassName,
                style: style,
                dir: rtl ? 'rtl' : undefined,
                onSubmit: onSubmit
            }),
            responsive ? _react2.default.createElement(
                _responsiveGrid2.default,
                { gap: gap },
                newChildren
            ) : newChildren
        );
    };

    return Form;
}(_react2.default.Component), _class.propTypes = {
    /**
     * ????????????
     */
    prefix: _propTypes2.default.string,
    /**
     * ????????????
     */
    inline: _propTypes2.default.bool,
    /**
     * ?????? Item ??? size ??????????????????????????? Form ??? size, ?????????????????? Item ???????????????????????????????????? size ???????????????
     * @enumdesc ???, ???, ???
     */
    size: _propTypes2.default.oneOf(['large', 'medium', 'small']),
    /**
     * ?????? Item ?????????????????????????????????100%
     */
    fullWidth: _propTypes2.default.bool,
    /**
     * ???????????????, ??????????????? labelCol ??? wrapperCol ???????????????????????????
     * @enumdesc ???, ???, ???
     */
    labelAlign: _propTypes2.default.oneOf(['top', 'left', 'inset']),
    /**
     * ???????????????????????????
     * @enumdesc ???, ???
     */
    labelTextAlign: _propTypes2.default.oneOf(['left', 'right']),
    /**
     * field ??????, ??? false ????????? field
     */
    field: _propTypes2.default.any,
    /**
     * ?????? Form ??????????????? field ??????
     */
    saveField: _propTypes2.default.func,
    /**
     * ??????????????? Item ??? labelCol
     */
    labelCol: _propTypes2.default.object,
    /**
     * ??????????????? Item ??? wrapperCol
     */
    wrapperCol: _propTypes2.default.object,
    /**
     * form?????? `htmlType="submit"` ???????????????????????????
     */
    onSubmit: _propTypes2.default.func,
    /**
     * ?????????
     */
    children: _propTypes2.default.any,
    /**
     * ??????class
     */
    className: _propTypes2.default.string,
    /**
     * ?????????????????????
     */
    style: _propTypes2.default.object,
    /**
     * ????????????
     */
    value: _propTypes2.default.object,
    /**
     * ??????????????????
     * @param {Object} values ????????????
     * @param {Object} item ??????
     * @param {String} item.name ??????????????????
     * @param {String} item.value ???????????????
     * @param {Object} item.field field ??????
     */
    onChange: _propTypes2.default.func,
    /**
     * ??????????????????
     */
    component: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]),
    fieldOptions: _propTypes2.default.object,
    rtl: _propTypes2.default.bool,
    /**
     * ??????????????????
     */
    device: _propTypes2.default.oneOf(['phone', 'tablet', 'desktop']),
    /**
     * ???????????????????????????????????? ?????????ResponsiveGrid???
     * @version 1.19
     */
    responsive: _propTypes2.default.bool,
    /**
     * ?????????????????????
     * @version 1.19
     */
    isPreview: _propTypes2.default.bool,
    /**
     * ???????????? label ????????????????????? name ??????
     * @version 1.20
     */
    useLabelForErrorMessage: _propTypes2.default.bool,
    /**
     * ?????????????????? label ???????????????
     * @version 1.22
     */
    colon: _propTypes2.default.bool,
    /**
     * ??????????????????
     */
    disabled: _propTypes2.default.bool,
    // ??? responsive????????????????????? ResponsiveGrid?????? ?????? ?????? cell ?????????????????? [bottom&top, right&left]
    gap: _propTypes2.default.oneOfType([_propTypes2.default.arrayOf(_propTypes2.default.number), _propTypes2.default.number])
}, _class.defaultProps = {
    prefix: 'next-',
    onSubmit: preventDefault,
    size: 'medium',
    labelAlign: 'left',
    onChange: _util.func.noop,
    component: 'form',
    saveField: _util.func.noop,
    device: 'desktop',
    colon: false,
    disabled: false
}, _class.childContextTypes = {
    _formField: _propTypes2.default.object,
    _formSize: _propTypes2.default.string,
    _formDisabled: _propTypes2.default.bool,
    _formPreview: _propTypes2.default.bool,
    _formFullWidth: _propTypes2.default.bool,
    _formLabelForErrorMessage: _propTypes2.default.bool
}, _temp);
Form.displayName = 'Form';
exports.default = Form;
module.exports = exports['default'];
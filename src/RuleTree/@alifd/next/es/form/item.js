import _typeof from 'babel-runtime/helpers/typeof';
import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Grid from '../grid';
import RGrid from '../responsive-grid';
import { obj } from '../util';
import Error from './error';
import { getFieldInitCfg } from './enhance';

var Row = Grid.Row,
    Col = Grid.Col;
var Cell = RGrid.Cell;
var isNil = obj.isNil;

/** Form.Item
 *  @description 手动传递了 wrapCol labelCol 会使用 Grid 辅助布局; labelAlign='top' 会强制禁用 Grid
 *  @order 1
 */

var Item = (_temp = _class = function (_React$Component) {
    _inherits(Item, _React$Component);

    function Item() {
        _classCallCheck(this, Item);

        return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
    }

    /**
     * 从子元素里面提取表单组件. TODO: 2.x 中改为只获取一个元素
     */
    Item.prototype.getNames = function getNames(children) {
        var name = this.props.name;

        var childrenList = React.Children.toArray(children);
        var nameList = childrenList.filter(function (c) {
            return c.props && ('name' in c.props || 'data-meta' in c.props);
        }).map(function (c) {
            return c.props.name || c.props.id;
        });

        if (nameList.length) {
            return nameList;
        } else if (name) {
            return [name];
        }

        return [];
    };

    Item.prototype.getHelper = function getHelper(children) {
        var help = this.props.help;
        var _formField = this.context._formField;

        return React.createElement(
            Error,
            { name: help === undefined ? this.getNames(children) : undefined, field: _formField },
            help
        );
    };

    Item.prototype.getState = function getState(children) {
        var validateState = this.props.validateState;

        if (validateState) {
            return validateState;
        }

        if (this.context._formField) {
            var getState = this.context._formField.getState;

            var names = this.getNames(children);
            if (!names.length) {
                return '';
            }

            // get first name
            return getState(names[0]);
        }

        return undefined;
    };

    Item.prototype.getSize = function getSize() {
        return this.props.size || this.context._formSize;
    };

    Item.prototype.getDisabled = function getDisabled() {
        return 'disabled' in this.props ? this.props.disabled : this.context._formDisabled;
    };

    Item.prototype.getIsPreview = function getIsPreview() {
        return 'isPreview' in this.props ? this.props.isPreview : this.context._formPreview;
    };

    Item.prototype.getFullWidth = function getFullWidth() {
        return isNil(this.props.fullWidth) ? !!this.context._formFullWidth : this.props.fullWidth;
    };

    Item.prototype.getLabelForErrorMessage = function getLabelForErrorMessage() {
        var label = this.props.label;

        if (!label || typeof label !== 'string') {
            return null;
        }

        label = label.replace(':', '').replace('：', '');

        var labelForErrorMessage = 'useLabelForErrorMessage' in this.props ? this.props.useLabelForErrorMessage : this.context._formLabelForErrorMessage;
        if (labelForErrorMessage && label) {
            return label;
        }

        return null;
    };

    Item.prototype.getItemLabel = function getItemLabel(children) {
        var _classNames;

        var _props = this.props,
            id = _props.id,
            required = _props.required,
            _props$asterisk = _props.asterisk,
            asterisk = _props$asterisk === undefined ? required : _props$asterisk,
            label = _props.label,
            labelCol = _props.labelCol,
            wrapperCol = _props.wrapperCol,
            prefix = _props.prefix,
            responsive = _props.responsive,
            labelWidth = _props.labelWidth,
            labelTextAlign = _props.labelTextAlign,
            colon = _props.colon;


        var labelAlign = this.getLabelAlign(this.props.labelAlign, this.props.device);

        if (!label) {
            return null;
        }

        var ele = React.createElement(
            'label',
            { htmlFor: id || this.getNames(children)[0], required: asterisk, key: 'label' },
            label
        );

        var cls = classNames((_classNames = {}, _classNames[prefix + 'form-item-label'] = true, _classNames['has-colon'] = colon, _classNames[prefix + 'left'] = labelTextAlign === 'left', _classNames));

        if (responsive && labelWidth && labelAlign !== 'top') {
            return React.createElement(
                'div',
                { className: cls, style: { width: labelWidth } },
                ele
            );
        }

        if ((wrapperCol || labelCol) && labelAlign !== 'top') {
            return React.createElement(
                Col,
                _extends({}, labelCol, { className: cls }),
                ele
            );
        }

        return React.createElement(
            'div',
            { className: cls },
            ele
        );
    };

    Item.prototype.getItemWrapper = function getItemWrapper(children) {
        var _this2 = this;

        var _props2 = this.props,
            hasFeedback = _props2.hasFeedback,
            labelCol = _props2.labelCol,
            wrapperCol = _props2.wrapperCol,
            extra = _props2.extra,
            prefix = _props2.prefix,
            renderPreview = _props2.renderPreview,
            name = _props2.name;


        var labelAlign = this.getLabelAlign(this.props.labelAlign, this.props.device);

        var state = this.getState(children);

        var isPreview = this.getIsPreview();
        var childrenProps = {
            size: this.getSize()
        };

        if (isPreview) {
            childrenProps.isPreview = true;
        }

        if ('renderPreview' in this.props && typeof renderPreview === 'function') {
            childrenProps.renderPreview = renderPreview;
        }

        if (state && (state === 'error' || hasFeedback)) {
            childrenProps.state = state;
        }

        if (labelAlign === 'inset') {
            childrenProps.label = this.getItemLabel(children);
        }

        if (this.getDisabled()) {
            childrenProps.disabled = true;
        }

        var labelForErrorMessage = this.getLabelForErrorMessage();

        var ele = React.Children.map(children, function (child, idx) {
            if (child && ['function', 'object'].indexOf(_typeof(child.type)) > -1 && child.type._typeMark !== 'form_item' && child.type._typeMark !== 'form_error') {
                var extraProps = childrenProps;
                // 自己直接使用 field.init 会在 props 上面留下 data-meta
                // name 挪到 FormItem 上面，默认把第一个元素当做 Form 组件
                if (_this2.context._formField && !('data-meta' in child.props) && ('name' in child.props || name && idx === 0) //TODO：1.x 为了不BR, 2.x 中把优先级调换下，优先取 FormItem 的 name
                ) {
                        var initName = 'name' in child.props && child.props.name ? child.props.name : name;
                        extraProps = _this2.context._formField.init(initName, _extends({}, getFieldInitCfg(_this2.props, child.type.displayName, labelForErrorMessage), {
                            props: _extends({}, child.props, { ref: child.ref })
                        }), childrenProps);
                    } else {
                    extraProps = _extends({}, child.props, extraProps);
                }

                return React.cloneElement(child, extraProps);
            }

            return child;
        });

        var help = this.getHelper(children);

        if ((wrapperCol || labelCol) && labelAlign !== 'top') {
            return React.createElement(
                Col,
                _extends({}, wrapperCol, { className: prefix + 'form-item-control', key: 'item' }),
                ele,
                ' ',
                help,
                ' ',
                extra
            );
        }

        return React.createElement(
            'div',
            { className: prefix + 'form-item-control' },
            ele,
            ' ',
            help,
            ' ',
            extra
        );
    };

    Item.prototype.getLabelAlign = function getLabelAlign(labelAlign, device) {
        if (device === 'phone') {
            return 'top';
        }

        return labelAlign;
    };

    Item.prototype.render = function render() {
        var _classNames2;

        var _props3 = this.props,
            className = _props3.className,
            style = _props3.style,
            prefix = _props3.prefix,
            wrapperCol = _props3.wrapperCol,
            labelCol = _props3.labelCol,
            responsive = _props3.responsive,
            children = _props3.children;


        var labelAlign = this.getLabelAlign(this.props.labelAlign, this.props.device);

        var childrenNode = children;
        if (typeof children === 'function' && this.context._formField) {
            childrenNode = children(this.context._formField.getValues());
        }

        var state = this.getState(childrenNode);
        var size = this.getSize();
        var fullWidth = this.getFullWidth();
        var isPreview = this.getIsPreview();

        var itemClassName = classNames((_classNames2 = {}, _classNames2[prefix + 'form-item'] = true, _classNames2['' + prefix + labelAlign] = labelAlign, _classNames2['has-' + state] = !!state, _classNames2['' + prefix + size] = !!size, _classNames2[prefix + 'form-item-fullwidth'] = fullWidth, _classNames2['' + className] = !!className, _classNames2[prefix + 'form-preview'] = isPreview, _classNames2));

        // 垂直模式并且左对齐才用到
        var Tag = responsive ? Cell : (wrapperCol || labelCol) && labelAlign !== 'top' ? Row : 'div';
        var label = labelAlign === 'inset' ? null : this.getItemLabel(childrenNode);

        return React.createElement(
            Tag,
            _extends({}, obj.pickOthers(Item.propTypes, this.props), { className: itemClassName, style: style }),
            label,
            this.getItemWrapper(childrenNode)
        );
    };

    return Item;
}(React.Component), _class.propTypes = {
    /**
     * 样式前缀
     */
    prefix: PropTypes.string,
    rtl: PropTypes.bool,
    /**
     * label 标签的文本
     */
    label: PropTypes.node,
    /**
     * label 标签布局，通 `<Col>` 组件，设置 span offset 值，如 {span: 8, offset: 16}，该项仅在垂直表单有效
     */
    labelCol: PropTypes.object,
    /**
     * 需要为输入控件设置布局样式时，使用该属性，用法同 labelCol
     */
    wrapperCol: PropTypes.object,
    /**
     * 自定义提示信息，如不设置，则会根据校验规则自动生成.
     */
    help: PropTypes.node,
    /**
     * 字段名，默认赋值给第一个子元素
     */
    name: PropTypes.string,
    /**
     * 额外的提示信息，和 help 类似，当需要错误信息和提示文案同时出现时，可以使用这个。 位于错误信息后面
     */
    extra: PropTypes.node,
    /**
     * 校验状态，如不设置，则会根据校验规则自动生成
     * @enumdesc 失败, 成功, 校验中, 警告
     */
    validateState: PropTypes.oneOf(['error', 'success', 'loading', 'warning']),
    /**
     * 配合 validateState 属性使用，是否展示 success/loading 的校验状态图标, 目前只有Input支持
     */
    hasFeedback: PropTypes.bool, //TODO: hasFeedback => validateStatus=[error,success,loading]
    /**
     * 自定义内联样式
     */
    style: PropTypes.object,
    id: PropTypes.string,
    /**
     * node 或者 function(values)
     */
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    /**
     * 单个 Item 的 size 自定义，优先级高于 Form 的 size, 并且当组件与 Item 一起使用时，组件自身设置 size 属性无效。
     */
    size: PropTypes.oneOf(['large', 'small', 'medium']),
    /**
     * 单个 Item 中表单类组件宽度是否是100%
     */
    fullWidth: PropTypes.bool,
    /**
     * 标签的位置, 如果不设置 labelCol 和 wrapperCol 那么默认是标签在上
     * @enumdesc 上, 左, 内
     */
    labelAlign: PropTypes.oneOf(['top', 'left', 'inset']),
    /**
     * 标签的左右对齐方式
     * @enumdesc 左, 右
     */
    labelTextAlign: PropTypes.oneOf(['left', 'right']),
    /**
     * 扩展class
     */
    className: PropTypes.string,
    /**
     * [表单校验] 不能为空
     */
    required: PropTypes.bool,
    /**
     * required 的星号是否显示
     */
    asterisk: PropTypes.bool,
    /**
     * required 自定义错误信息
     */
    requiredMessage: PropTypes.string,
    /**
     * required 校验何时触发，默认值 onChange, 原生事件均可使用 onChange/onBlur/onFocus/...
     */
    requiredTrigger: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    /**
     * [表单校验] 最小值
     */
    min: PropTypes.number,
    /**
     * [表单校验] 最大值
     */
    max: PropTypes.number,
    /**
     * min/max 自定义错误信息
     */
    minmaxMessage: PropTypes.string,
    /**
     * min/max 校验何时触发，默认值 onChange, 原生事件均可使用 onChange/onBlur/onFocus/...
     */
    minmaxTrigger: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    /**
     * [表单校验] 字符串最小长度 / 数组最小个数
     */
    minLength: PropTypes.number,
    /**
     * [表单校验] 字符串最大长度 / 数组最大个数
     */
    maxLength: PropTypes.number,
    /**
     * minLength/maxLength 自定义错误信息
     */
    minmaxLengthMessage: PropTypes.string,
    /**
     * minLength/maxLength 校验何时触发，默认值 onChange, 原生事件均可使用 onChange/onBlur/onFocus/...
     */
    minmaxLengthTrigger: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    /**
     * [表单校验] 字符串精确长度 / 数组精确个数
     */
    length: PropTypes.number,
    /**
     * length 自定义错误信息
     */
    lengthMessage: PropTypes.string,
    /**
     * length 校验何时触发，默认值 onChange, 原生事件均可使用 onChange/onBlur/onFocus/...
     */
    lengthTrigger: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    /**
     * 正则校验
     */
    pattern: PropTypes.any,
    /**
     * pattern 自定义错误信息
     */
    patternMessage: PropTypes.string,
    /**
     * pattern 校验何时触发，默认值 onChange, 原生事件均可使用 onChange/onBlur/onFocus/...
     */
    patternTrigger: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    /**
     * [表单校验] 四种常用的 pattern
     */
    format: PropTypes.oneOf(['number', 'email', 'url', 'tel']),
    /**
     * format 自定义错误信息
     */
    formatMessage: PropTypes.string,
    /**
     * format 校验何时触发，默认值 onChange, 原生事件均可使用 onChange/onBlur/onFocus/...
     */
    formatTrigger: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    /**
     * [表单校验] 自定义校验函数
     */
    validator: PropTypes.func,
    /**
     * validator 校验何时触发，默认值 onChange, 原生事件均可使用 onChange/onBlur/onFocus/...
     */
    validatorTrigger: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    /**
     * 是否修改数据时自动触发校验
     */
    autoValidate: PropTypes.bool,
    /**
     * 预设屏幕宽度
     */
    device: PropTypes.oneOf(['phone', 'tablet', 'desktop']),
    responsive: PropTypes.bool,
    /**
     * 在响应式布局模式下，表单项占多少列
     */
    colSpan: PropTypes.number,
    /**
     * 在响应式布局下，且label在左边时，label的宽度是多少
     */
    labelWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * 是否开启预览态
     */
    isPreview: PropTypes.bool,
    /**
     * 预览态模式下渲染的内容
     * @param {any} value 根据包裹的组件的 value 类型而决定
     */
    renderPreview: PropTypes.func,
    /**
     * 是否使用 label 替换校验信息的 name 字段
     */
    useLabelForErrorMessage: PropTypes.bool,
    /**
     * 表示是否显示 label 后面的冒号
     */
    colon: PropTypes.bool,
    /**
     * 是否禁用表单
     */
    disabled: PropTypes.bool,
    /**
     * 子元素的 value 名称
     */
    valueName: PropTypes.string
}, _class.defaultProps = {
    prefix: 'next-',
    hasFeedback: false,
    labelWidth: 100
}, _class.contextTypes = {
    _formField: PropTypes.object,
    _formSize: PropTypes.oneOf(['large', 'small', 'medium']),
    _formDisabled: PropTypes.bool,
    _formPreview: PropTypes.bool,
    _formFullWidth: PropTypes.bool,
    _formLabelForErrorMessage: PropTypes.bool
}, _class._typeMark = 'form_item', _temp);
Item.displayName = 'Item';
export { Item as default };
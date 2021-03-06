import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { isValidElement, cloneElement } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../icon';
import { obj, func } from '../util';
import Base from './base';
import Group from './group';

// preventDefault here can stop onBlur to keep focus state
function preventDefault(e) {
    e.preventDefault();
}

/** Input */
var Input = (_temp = _class = function (_Base) {
    _inherits(Input, _Base);

    function Input(props) {
        _classCallCheck(this, Input);

        var _this = _possibleConstructorReturn(this, _Base.call(this, props));

        _this.handleKeyDown = function (e) {
            if (e.keyCode === 13) {
                _this.props.onPressEnter(e);
            }

            _this.onKeyDown(e);
        };

        _this.handleKeyDownFromClear = function (e) {
            if (e.keyCode === 13) {
                _this.onClear(e);
            }
        };

        var value = void 0;
        if ('value' in props) {
            value = props.value;
        } else {
            value = props.defaultValue;
        }

        _this.state = {
            value: typeof value === 'undefined' ? '' : value
        };
        return _this;
    }

    // `Enter` was considered to be two chars in chrome , but one char in ie.
    // so we make all `Enter` to be two chars


    Input.prototype.getValueLength = function getValueLength(value) {
        var nv = '' + value;
        var strLen = this.props.getValueLength(nv);
        if (typeof strLen !== 'number') {
            strLen = nv.length;
        }

        return strLen;
    };

    Input.prototype.renderControl = function renderControl() {
        var _this2 = this;

        var _props = this.props,
            hasClear = _props.hasClear,
            readOnly = _props.readOnly,
            state = _props.state,
            prefix = _props.prefix,
            hint = _props.hint,
            extra = _props.extra,
            locale = _props.locale,
            disabled = _props.disabled,
            hoverShowClear = _props.hoverShowClear;


        var lenWrap = this.renderLength();

        var stateWrap = null;
        if (state === 'success') {
            stateWrap = React.createElement(Icon, { type: 'success-filling', className: prefix + 'input-success-icon' });
        } else if (state === 'loading') {
            stateWrap = React.createElement(Icon, { type: 'loading', className: prefix + 'input-loading-icon' });
        } else if (state === 'warning') {
            stateWrap = React.createElement(Icon, { type: 'warning', className: prefix + 'input-warning-icon' });
        }

        var clearWrap = null;
        // showClear???????????????disable?????????????????????
        var showClear = hasClear && !readOnly && !!('' + this.state.value) && !disabled;

        if (hint || showClear) {
            var hintIcon = null;
            if (hint) {
                if (typeof hint === 'string') {
                    hintIcon = React.createElement(Icon, { type: hint, className: prefix + 'input-hint' });
                } else if (isValidElement(hint)) {
                    hintIcon = cloneElement(hint, {
                        className: classNames(hint.props.className, prefix + 'input-hint')
                    });
                } else {
                    hintIcon = hint;
                }
            } else {
                var _classNames;

                var cls = classNames((_classNames = {}, _classNames[prefix + 'input-hint'] = true, _classNames[prefix + 'input-clear-icon'] = true, _classNames[prefix + 'input-hover-show'] = hoverShowClear, _classNames));
                hintIcon = React.createElement(Icon, {
                    type: 'delete-filling',
                    role: 'button',
                    tabIndex: '0',
                    className: cls,
                    'aria-label': locale.clear,
                    onClick: this.onClear.bind(this),
                    onMouseDown: preventDefault,
                    onKeyDown: this.handleKeyDownFromClear
                });
            }

            clearWrap = React.createElement(
                'span',
                { className: prefix + 'input-hint-wrap' },
                hasClear && hint ? React.createElement(Icon, {
                    type: 'delete-filling',
                    role: 'button',
                    tabIndex: '0',
                    className: prefix + 'input-clear ' + prefix + 'input-clear-icon',
                    'aria-label': locale.clear,
                    onClick: this.onClear.bind(this),
                    onMouseDown: preventDefault,
                    onKeyDown: this.handleKeyDownFromClear
                }) : null,
                hintIcon
            );
        }

        if (state === 'loading') {
            clearWrap = null;
        }

        return clearWrap || lenWrap || stateWrap || extra ? React.createElement(
            'span',
            { onClick: function onClick() {
                    return _this2.focus();
                }, className: prefix + 'input-control' },
            clearWrap,
            lenWrap,
            stateWrap,
            extra
        ) : null;
    };

    Input.prototype.renderLabel = function renderLabel() {
        var _props2 = this.props,
            label = _props2.label,
            prefix = _props2.prefix,
            id = _props2.id;

        return label ? React.createElement(
            'label',
            { className: prefix + 'input-label', htmlFor: id },
            label
        ) : null;
    };

    Input.prototype.renderInner = function renderInner(inner, cls) {
        return inner ? React.createElement(
            'span',
            { className: cls },
            inner
        ) : null;
    };

    Input.prototype.onClear = function onClear(e) {
        if (this.props.disabled) {
            return;
        }

        // ?????????????????????????????????
        if (!('value' in this.props)) {
            this.setState({
                value: ''
            });
        }
        this.props.onChange('', e, 'clear');
        this.focus();
    };

    Input.prototype.render = function render() {
        var _classNames2, _classNames3, _classNames4, _classNames5, _classNames6, _classNames7, _classNames8;

        var _props3 = this.props,
            size = _props3.size,
            htmlType = _props3.htmlType,
            htmlSize = _props3.htmlSize,
            autoComplete = _props3.autoComplete,
            autoFocus = _props3.autoFocus,
            disabled = _props3.disabled,
            style = _props3.style,
            innerBefore = _props3.innerBefore,
            innerAfter = _props3.innerAfter,
            innerBeforeClassName = _props3.innerBeforeClassName,
            innerAfterClassName = _props3.innerAfterClassName,
            className = _props3.className,
            hasBorder = _props3.hasBorder,
            prefix = _props3.prefix,
            isPreview = _props3.isPreview,
            renderPreview = _props3.renderPreview,
            addonBefore = _props3.addonBefore,
            addonAfter = _props3.addonAfter,
            addonTextBefore = _props3.addonTextBefore,
            addonTextAfter = _props3.addonTextAfter,
            inputRender = _props3.inputRender,
            rtl = _props3.rtl,
            composition = _props3.composition;


        var hasAddon = addonBefore || addonAfter || addonTextBefore || addonTextAfter;
        var cls = classNames(this.getClass(), (_classNames2 = {}, _classNames2['' + prefix + size] = true, _classNames2[prefix + 'hidden'] = this.props.htmlType === 'hidden', _classNames2[prefix + 'noborder'] = !hasBorder || this.props.htmlType === 'file', _classNames2[prefix + 'input-group-auto-width'] = hasAddon, _classNames2[prefix + 'disabled'] = disabled, _classNames2[className] = !!className && !hasAddon, _classNames2));

        var innerCls = prefix + 'input-inner';
        var innerBeforeCls = classNames((_classNames3 = {}, _classNames3[innerCls] = true, _classNames3[prefix + 'before'] = true, _classNames3[innerBeforeClassName] = innerBeforeClassName, _classNames3));
        var innerAfterCls = classNames((_classNames4 = {}, _classNames4[innerCls] = true, _classNames4[prefix + 'after'] = true, _classNames4[prefix + 'input-inner-text'] = typeof innerAfter === 'string', _classNames4[innerAfterClassName] = innerAfterClassName, _classNames4));
        var previewCls = classNames((_classNames5 = {}, _classNames5[prefix + 'form-preview'] = true, _classNames5[className] = !!className, _classNames5));

        var props = this.getProps();
        // custom data attributes are assigned to the top parent node
        // data-???????????????????????????????????????node??????
        var dataProps = obj.pickAttrsWith(this.props, 'data-');
        // Custom props are transparently transmitted to the core input node by default
        // ????????????????????????????????????node?????????input
        var others = obj.pickOthers(_extends({}, dataProps, Input.propTypes), this.props);

        if (isPreview) {
            var value = props.value;
            var label = this.props.label;

            if (typeof renderPreview === 'function') {
                return React.createElement(
                    'div',
                    _extends({}, others, { className: previewCls }),
                    renderPreview(value, this.props)
                );
            }
            return React.createElement(
                'div',
                _extends({}, others, { className: previewCls }),
                addonBefore || addonTextBefore,
                label,
                innerBefore,
                value,
                innerAfter,
                addonAfter || addonTextAfter
            );
        }

        var compositionProps = {};
        if (composition) {
            compositionProps.onCompositionStart = this.handleCompositionStart;
            compositionProps.onCompositionEnd = this.handleCompositionEnd;
        }

        var inputEl = React.createElement('input', _extends({}, others, props, compositionProps, {
            height: '100%',
            type: htmlType,
            size: htmlSize,
            autoFocus: autoFocus,
            autoComplete: autoComplete,
            onKeyDown: this.handleKeyDown,
            ref: this.saveRef
        }));

        var inputWrap = React.createElement(
            'span',
            _extends({}, dataProps, { dir: rtl ? 'rtl' : undefined, className: cls, style: hasAddon ? undefined : style }),
            this.renderLabel(),
            this.renderInner(innerBefore, innerBeforeCls),
            inputRender(inputEl),
            this.renderInner(innerAfter, innerAfterCls),
            this.renderControl()
        );

        var groupCls = classNames((_classNames6 = {}, _classNames6[prefix + 'input-group-text'] = true, _classNames6['' + prefix + size] = !!size, _classNames6[prefix + 'disabled'] = disabled, _classNames6));

        var addonBeforeCls = classNames((_classNames7 = {}, _classNames7[groupCls] = addonTextBefore, _classNames7));
        var addonAfterCls = classNames((_classNames8 = {}, _classNames8[groupCls] = addonTextAfter, _classNames8));

        if (hasAddon) {
            return React.createElement(
                Group,
                _extends({}, dataProps, {
                    prefix: prefix,
                    className: className,
                    style: style,
                    disabled: disabled,
                    addonBefore: addonBefore || addonTextBefore,
                    addonBeforeClassName: addonBeforeCls,
                    addonAfter: addonAfter || addonTextAfter,
                    addonAfterClassName: addonAfterCls
                }),
                inputWrap
            );
        }

        return inputWrap;
    };

    return Input;
}(Base), _class.getDerivedStateFromProps = Base.getDerivedStateFromProps, _class.propTypes = _extends({}, Base.propTypes, {
    /**
     * label
     */
    label: PropTypes.node,
    /**
     * ????????????clear??????
     */
    hasClear: PropTypes.bool,
    /**
     * ???????????????
     */
    hasBorder: PropTypes.bool,
    /**
     * ??????
     * @enumdesc ??????, ?????????, ??????, ??????
     */
    state: PropTypes.oneOf(['error', 'loading', 'success', 'warning']),
    /**
     * ?????????????????????
     */
    onPressEnter: PropTypes.func,

    onClear: PropTypes.func,
    /**
     * ??????type
     */
    htmlType: PropTypes.string,
    htmlSize: PropTypes.string,
    /**
     * ?????? (Icon???type????????????hasClear??????????????????)
     */
    hint: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    /**
     * ?????????????????????
     */
    innerBefore: PropTypes.node,
    /**
     * ?????????????????????
     */
    innerAfter: PropTypes.node,
    /**
     * ????????????????????????
     */
    addonBefore: PropTypes.node,
    /**
     * ????????????????????????
     */
    addonAfter: PropTypes.node,
    /**
     * ????????????????????????
     */
    addonTextBefore: PropTypes.node,
    /**
     * ????????????????????????
     */
    addonTextAfter: PropTypes.node,
    /**
     * (??????input??????)
     */
    autoComplete: PropTypes.string,
    /**
     * ????????????(??????input??????)
     */
    autoFocus: PropTypes.bool,
    inputRender: PropTypes.func,
    extra: PropTypes.node,
    innerBeforeClassName: PropTypes.string,
    innerAfterClassName: PropTypes.string,
    /**
     * ??????????????????
     */
    isPreview: PropTypes.bool,
    /**
     * ?????????????????????????????????
     * @param {number} value ?????????
     */
    renderPreview: PropTypes.func,
    /**
     * hover??????clear (?????? hasClear=true??????)
     * @version 1.24
     */
    hoverShowClear: PropTypes.bool
}), _class.defaultProps = _extends({}, Base.defaultProps, {
    autoComplete: 'off',
    hasBorder: true,
    isPreview: false,
    hoverShowClear: false,
    onPressEnter: func.noop,
    inputRender: function inputRender(el) {
        return el;
    }
}), _temp);
export { Input as default };
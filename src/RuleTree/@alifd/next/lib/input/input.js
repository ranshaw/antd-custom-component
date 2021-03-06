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

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _util = require('../util');

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _group = require('./group');

var _group2 = _interopRequireDefault(_group);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// preventDefault here can stop onBlur to keep focus state
function preventDefault(e) {
    e.preventDefault();
}

/** Input */
var Input = (_temp = _class = function (_Base) {
    (0, _inherits3.default)(Input, _Base);

    function Input(props) {
        (0, _classCallCheck3.default)(this, Input);

        var _this = (0, _possibleConstructorReturn3.default)(this, _Base.call(this, props));

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
            stateWrap = _react2.default.createElement(_icon2.default, { type: 'success-filling', className: prefix + 'input-success-icon' });
        } else if (state === 'loading') {
            stateWrap = _react2.default.createElement(_icon2.default, { type: 'loading', className: prefix + 'input-loading-icon' });
        } else if (state === 'warning') {
            stateWrap = _react2.default.createElement(_icon2.default, { type: 'warning', className: prefix + 'input-warning-icon' });
        }

        var clearWrap = null;
        // showClear???????????????disable?????????????????????
        var showClear = hasClear && !readOnly && !!('' + this.state.value) && !disabled;

        if (hint || showClear) {
            var hintIcon = null;
            if (hint) {
                if (typeof hint === 'string') {
                    hintIcon = _react2.default.createElement(_icon2.default, { type: hint, className: prefix + 'input-hint' });
                } else if ((0, _react.isValidElement)(hint)) {
                    hintIcon = (0, _react.cloneElement)(hint, {
                        className: (0, _classnames2.default)(hint.props.className, prefix + 'input-hint')
                    });
                } else {
                    hintIcon = hint;
                }
            } else {
                var _classNames;

                var cls = (0, _classnames2.default)((_classNames = {}, _classNames[prefix + 'input-hint'] = true, _classNames[prefix + 'input-clear-icon'] = true, _classNames[prefix + 'input-hover-show'] = hoverShowClear, _classNames));
                hintIcon = _react2.default.createElement(_icon2.default, {
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

            clearWrap = _react2.default.createElement(
                'span',
                { className: prefix + 'input-hint-wrap' },
                hasClear && hint ? _react2.default.createElement(_icon2.default, {
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

        return clearWrap || lenWrap || stateWrap || extra ? _react2.default.createElement(
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

        return label ? _react2.default.createElement(
            'label',
            { className: prefix + 'input-label', htmlFor: id },
            label
        ) : null;
    };

    Input.prototype.renderInner = function renderInner(inner, cls) {
        return inner ? _react2.default.createElement(
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
        var cls = (0, _classnames2.default)(this.getClass(), (_classNames2 = {}, _classNames2['' + prefix + size] = true, _classNames2[prefix + 'hidden'] = this.props.htmlType === 'hidden', _classNames2[prefix + 'noborder'] = !hasBorder || this.props.htmlType === 'file', _classNames2[prefix + 'input-group-auto-width'] = hasAddon, _classNames2[prefix + 'disabled'] = disabled, _classNames2[className] = !!className && !hasAddon, _classNames2));

        var innerCls = prefix + 'input-inner';
        var innerBeforeCls = (0, _classnames2.default)((_classNames3 = {}, _classNames3[innerCls] = true, _classNames3[prefix + 'before'] = true, _classNames3[innerBeforeClassName] = innerBeforeClassName, _classNames3));
        var innerAfterCls = (0, _classnames2.default)((_classNames4 = {}, _classNames4[innerCls] = true, _classNames4[prefix + 'after'] = true, _classNames4[prefix + 'input-inner-text'] = typeof innerAfter === 'string', _classNames4[innerAfterClassName] = innerAfterClassName, _classNames4));
        var previewCls = (0, _classnames2.default)((_classNames5 = {}, _classNames5[prefix + 'form-preview'] = true, _classNames5[className] = !!className, _classNames5));

        var props = this.getProps();
        // custom data attributes are assigned to the top parent node
        // data-???????????????????????????????????????node??????
        var dataProps = _util.obj.pickAttrsWith(this.props, 'data-');
        // Custom props are transparently transmitted to the core input node by default
        // ????????????????????????????????????node?????????input
        var others = _util.obj.pickOthers((0, _extends3.default)({}, dataProps, Input.propTypes), this.props);

        if (isPreview) {
            var value = props.value;
            var label = this.props.label;

            if (typeof renderPreview === 'function') {
                return _react2.default.createElement(
                    'div',
                    (0, _extends3.default)({}, others, { className: previewCls }),
                    renderPreview(value, this.props)
                );
            }
            return _react2.default.createElement(
                'div',
                (0, _extends3.default)({}, others, { className: previewCls }),
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

        var inputEl = _react2.default.createElement('input', (0, _extends3.default)({}, others, props, compositionProps, {
            height: '100%',
            type: htmlType,
            size: htmlSize,
            autoFocus: autoFocus,
            autoComplete: autoComplete,
            onKeyDown: this.handleKeyDown,
            ref: this.saveRef
        }));

        var inputWrap = _react2.default.createElement(
            'span',
            (0, _extends3.default)({}, dataProps, { dir: rtl ? 'rtl' : undefined, className: cls, style: hasAddon ? undefined : style }),
            this.renderLabel(),
            this.renderInner(innerBefore, innerBeforeCls),
            inputRender(inputEl),
            this.renderInner(innerAfter, innerAfterCls),
            this.renderControl()
        );

        var groupCls = (0, _classnames2.default)((_classNames6 = {}, _classNames6[prefix + 'input-group-text'] = true, _classNames6['' + prefix + size] = !!size, _classNames6[prefix + 'disabled'] = disabled, _classNames6));

        var addonBeforeCls = (0, _classnames2.default)((_classNames7 = {}, _classNames7[groupCls] = addonTextBefore, _classNames7));
        var addonAfterCls = (0, _classnames2.default)((_classNames8 = {}, _classNames8[groupCls] = addonTextAfter, _classNames8));

        if (hasAddon) {
            return _react2.default.createElement(
                _group2.default,
                (0, _extends3.default)({}, dataProps, {
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
}(_base2.default), _class.getDerivedStateFromProps = _base2.default.getDerivedStateFromProps, _class.propTypes = (0, _extends3.default)({}, _base2.default.propTypes, {
    /**
     * label
     */
    label: _propTypes2.default.node,
    /**
     * ????????????clear??????
     */
    hasClear: _propTypes2.default.bool,
    /**
     * ???????????????
     */
    hasBorder: _propTypes2.default.bool,
    /**
     * ??????
     * @enumdesc ??????, ?????????, ??????, ??????
     */
    state: _propTypes2.default.oneOf(['error', 'loading', 'success', 'warning']),
    /**
     * ?????????????????????
     */
    onPressEnter: _propTypes2.default.func,

    onClear: _propTypes2.default.func,
    /**
     * ??????type
     */
    htmlType: _propTypes2.default.string,
    htmlSize: _propTypes2.default.string,
    /**
     * ?????? (Icon???type????????????hasClear??????????????????)
     */
    hint: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.node]),
    /**
     * ?????????????????????
     */
    innerBefore: _propTypes2.default.node,
    /**
     * ?????????????????????
     */
    innerAfter: _propTypes2.default.node,
    /**
     * ????????????????????????
     */
    addonBefore: _propTypes2.default.node,
    /**
     * ????????????????????????
     */
    addonAfter: _propTypes2.default.node,
    /**
     * ????????????????????????
     */
    addonTextBefore: _propTypes2.default.node,
    /**
     * ????????????????????????
     */
    addonTextAfter: _propTypes2.default.node,
    /**
     * (??????input??????)
     */
    autoComplete: _propTypes2.default.string,
    /**
     * ????????????(??????input??????)
     */
    autoFocus: _propTypes2.default.bool,
    inputRender: _propTypes2.default.func,
    extra: _propTypes2.default.node,
    innerBeforeClassName: _propTypes2.default.string,
    innerAfterClassName: _propTypes2.default.string,
    /**
     * ??????????????????
     */
    isPreview: _propTypes2.default.bool,
    /**
     * ?????????????????????????????????
     * @param {number} value ?????????
     */
    renderPreview: _propTypes2.default.func,
    /**
     * hover??????clear (?????? hasClear=true??????)
     * @version 1.24
     */
    hoverShowClear: _propTypes2.default.bool
}), _class.defaultProps = (0, _extends3.default)({}, _base2.default.defaultProps, {
    autoComplete: 'off',
    hasBorder: true,
    isPreview: false,
    hoverShowClear: false,
    onPressEnter: _util.func.noop,
    inputRender: function inputRender(el) {
        return el;
    }
}), _temp);
exports.default = Input;
module.exports = exports['default'];
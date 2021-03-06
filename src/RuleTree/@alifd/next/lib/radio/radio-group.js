'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

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

var _classnames2 = require('classnames');

var _classnames3 = _interopRequireDefault(_classnames2);

var _reactLifecyclesCompat = require('react-lifecycles-compat');

var _configProvider = require('../config-provider');

var _configProvider2 = _interopRequireDefault(_configProvider);

var _util = require('../util');

var _radio = require('./radio');

var _radio2 = _interopRequireDefault(_radio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pickOthers = _util.obj.pickOthers;

/**
 * Radio.Group
 * @order 2
 */

var RadioGroup = (_temp = _class = function (_Component) {
    (0, _inherits3.default)(RadioGroup, _Component);

    function RadioGroup(props) {
        (0, _classCallCheck3.default)(this, RadioGroup);

        var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call(this, props));

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
            children = _react2.default.Children.map(this.props.children, function (child, index) {
                if (!_react2.default.isValidElement(child)) {
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
                    return _react2.default.cloneElement(child, {
                        checked: checked,
                        tabIndex: tabIndex,
                        rtl: childrtl
                    });
                }
                return _react2.default.cloneElement(child, {
                    checked: checked,
                    rtl: childrtl
                });
            });
        } else {
            children = this.props.dataSource.map(function (item, index) {
                var option = item;
                if ((typeof item === 'undefined' ? 'undefined' : (0, _typeof3.default)(item)) !== 'object') {
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
                return _react2.default.createElement(_radio2.default, {
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
            var previewCls = (0, _classnames3.default)(className, prefix + 'form-preview');

            if ('renderPreview' in this.props) {
                return _react2.default.createElement(
                    'div',
                    (0, _extends3.default)({}, others, { className: previewCls }),
                    renderPreview(previewed, this.props)
                );
            }

            return _react2.default.createElement(
                'p',
                (0, _extends3.default)({}, others, { className: previewCls }),
                previewed.label
            );
        }

        var isButtonShape = shape === 'button';

        var cls = (0, _classnames3.default)((_classnames = {}, _classnames[prefix + 'radio-group'] = true, _classnames[prefix + 'radio-group-' + direction] = !isButtonShape, _classnames[prefix + 'radio-button'] = isButtonShape, _classnames[prefix + 'radio-button-' + size] = isButtonShape, _classnames[className] = !!className, _classnames.disabled = disabled, _classnames));

        var TagName = component;
        return _react2.default.createElement(
            TagName,
            (0, _extends3.default)({}, others, { 'aria-disabled': disabled, role: 'radiogroup', className: cls, style: style }),
            children
        );
    };

    return RadioGroup;
}(_react.Component), _class.propTypes = (0, _extends3.default)({}, _configProvider2.default.propTypes, {
    /**
     * ???????????????????????????
     */
    prefix: _propTypes2.default.string,
    /**
     * ???????????????
     */
    className: _propTypes2.default.string,
    /**
     * ?????????????????????
     */
    style: _propTypes2.default.object,
    /**
     * name
     */
    name: _propTypes2.default.string,
    /**
     * radio group??????????????????
     */
    value: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number, _propTypes2.default.bool]),
    /**
     * radio group????????????
     */
    defaultValue: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number, _propTypes2.default.bool]),
    /**
     * ??????????????????
     */
    component: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]),
    /**
     * ???????????????????????????
     * @param {String/Number} value ???????????????
     * @param {Event} e Dom ????????????
     */
    onChange: _propTypes2.default.func,
    /**
     * ??????radio?????????
     */
    disabled: _propTypes2.default.bool,
    /**
     * ??????????????? button ????????????
     * @enumdesc ?????????
     */
    shape: _propTypes2.default.oneOf(['normal', 'button']),
    /**
     * ??? `shape` ?????????????????????shape??????button?????????
     * @enumdesc ???, ???, ???
     */
    size: _propTypes2.default.oneOf(['large', 'medium', 'small']),
    /**
     * ???????????????, ??????????????? String ?????? Object, ??? `['apple', 'pear', 'orange']` `[{label: 'apply', value: 'apple'}]`
     */
    dataSource: _propTypes2.default.oneOfType([_propTypes2.default.arrayOf(_propTypes2.default.string), _propTypes2.default.arrayOf(_propTypes2.default.object)]),
    /**
     * ?????????????????????????????????radio
     */
    children: _propTypes2.default.oneOfType([_propTypes2.default.arrayOf(_propTypes2.default.element), _propTypes2.default.element]),

    /**
     * ????????????????????????
     * - hoz: ???????????? (default)
     * - ver: ????????????
     */
    direction: _propTypes2.default.oneOf(['hoz', 'ver']),
    /**
     * ??????????????????
     */
    isPreview: _propTypes2.default.bool,
    /**
     * ?????????????????????????????????
     * @param {Object} previewed ????????????{label: "", value: ""}
     * @param {Object} props ?????????????????????
     * @returns {reactNode} Element ????????????
     */
    renderPreview: _propTypes2.default.func
}), _class.defaultProps = {
    dataSource: [],
    size: 'medium',
    onChange: function onChange() {},
    prefix: 'next-',
    component: 'div',
    direction: 'hoz',
    isPreview: false
}, _class.childContextTypes = {
    onChange: _propTypes2.default.func,
    __group__: _propTypes2.default.bool,
    isButton: _propTypes2.default.bool,
    selectedValue: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number, _propTypes2.default.bool]),
    disabled: _propTypes2.default.bool
}, _temp);
RadioGroup.displayName = 'RadioGroup';
exports.default = (0, _reactLifecyclesCompat.polyfill)(RadioGroup);
module.exports = exports['default'];
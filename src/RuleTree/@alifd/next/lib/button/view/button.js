'use strict';

exports.__esModule = true;
exports.default = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _class, _temp2;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _configProvider = require('../../config-provider');

var _configProvider2 = _interopRequireDefault(_configProvider);

var _util = require('../../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function mapIconSize(size) {
    return {
        large: 'small',
        medium: 'xs',
        small: 'xs'
    }[size];
}

/** Button */
var Button = (_temp2 = _class = function (_Component) {
    (0, _inherits3.default)(Button, _Component);

    function Button() {
        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, Button);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.onMouseUp = function (e) {
            _this.button.blur();

            if (_this.props.onMouseUp) {
                _this.props.onMouseUp(e);
            }
        }, _this.buttonRefHandler = function (button) {
            _this.button = button;
        }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
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
            others = (0, _objectWithoutProperties3.default)(_props, ['prefix', 'className', 'type', 'size', 'htmlType', 'loading', 'text', 'warning', 'ghost', 'component', 'iconSize', 'icons', 'disabled', 'onClick', 'children', 'rtl']);

        var ghostType = ['light', 'dark'].indexOf(ghost) >= 0 ? ghost : 'dark';

        var btnClsObj = (_btnClsObj = {}, _btnClsObj[prefix + 'btn'] = true, _btnClsObj['' + prefix + size] = size, _btnClsObj[prefix + 'btn-' + type] = type && !ghost, _btnClsObj[prefix + 'btn-text'] = text, _btnClsObj[prefix + 'btn-warning'] = warning, _btnClsObj[prefix + 'btn-loading'] = loading, _btnClsObj[prefix + 'btn-ghost'] = ghost, _btnClsObj[prefix + 'btn-' + ghostType] = ghost, _btnClsObj[className] = className, _btnClsObj);

        var loadingIcon = null;

        // ??????????????? loading ??? icons???????????????????????????
        if (icons && icons.loading && (0, _react.isValidElement)(icons.loading)) {
            var _classNames;

            if (loading) {
                delete btnClsObj[prefix + 'btn-loading'];
                btnClsObj[prefix + 'btn-custom-loading'] = true;
            }

            var loadingSize = iconSize || mapIconSize(size);
            loadingIcon = _react2.default.cloneElement(icons.loading, {
                className: (0, _classnames2.default)((_classNames = {}, _classNames[prefix + 'btn-custom-loading-icon'] = true, _classNames.show = loading, _classNames)),
                size: loadingSize
            });
        }

        var count = _react.Children.count(children);
        var clonedChildren = _react.Children.map(children, function (child, index) {
            if (child && ['function', 'object'].indexOf((0, _typeof3.default)(child.type)) > -1 && child.type._typeMark === 'icon') {
                var _classNames2;

                var iconCls = (0, _classnames2.default)((_classNames2 = {}, _classNames2[prefix + 'btn-icon'] = !iconSize, _classNames2[prefix + 'icon-first'] = count > 1 && index === 0, _classNames2[prefix + 'icon-last'] = count > 1 && index === count - 1, _classNames2[prefix + 'icon-alone'] = count === 1, _classNames2[child.props.className] = !!child.props.className, _classNames2));

                if ('size' in child.props) {
                    _util.log.warning('The size of Icon will not take effect, when Icon is the [direct child element] of Button(<Button><Icon size="' + child.props.size + '" /></Button>), use <Button iconSize="' + child.props.size + '"> or <Button><div><Icon size="' + child.props.size + '" /></div></Button> instead of.');
                }
                return _react2.default.cloneElement(child, {
                    className: iconCls,
                    size: iconSize || mapIconSize(size)
                });
            }

            if (!(0, _react.isValidElement)(child)) {
                return _react2.default.createElement(
                    'span',
                    { className: prefix + 'btn-helper' },
                    child
                );
            }

            return child;
        });

        var TagName = component;
        var tagAttrs = (0, _extends3.default)({}, _util.obj.pickOthers(Object.keys(Button.propTypes), others), {
            type: htmlType,
            disabled: disabled,
            onClick: onClick,
            className: (0, _classnames2.default)(btnClsObj)
        });

        if (TagName !== 'button') {
            delete tagAttrs.type;

            if (tagAttrs.disabled) {
                delete tagAttrs.onClick; // a ????????? onClick ???????????????????????????
                tagAttrs.href && delete tagAttrs.href; // a ?????????????????????????????????
            }
        }

        return _react2.default.createElement(
            TagName,
            (0, _extends3.default)({}, tagAttrs, { dir: rtl ? 'rtl' : undefined, onMouseUp: this.onMouseUp, ref: this.buttonRefHandler }),
            loadingIcon,
            clonedChildren
        );
    };

    return Button;
}(_react.Component), _class.propTypes = (0, _extends3.default)({}, _configProvider2.default.propTypes, {
    prefix: _propTypes2.default.string,
    rtl: _propTypes2.default.bool,
    /**
     * ???????????????
     */
    type: _propTypes2.default.oneOf(['primary', 'secondary', 'normal']),
    /**
     * ???????????????
     */
    size: _propTypes2.default.oneOf(['small', 'medium', 'large']),
    /**
     * ????????????????????? Icon???????????? { loading: <Icon type="loading" /> }
     */
    icons: _propTypes2.default.shape({
        loading: _propTypes2.default.node
    }),
    /**
     * ????????? Icon ???????????????????????? Icon ???????????????
     */
    iconSize: _propTypes2.default.oneOfType([_propTypes2.default.oneOf(['xxs', 'xs', 'small', 'medium', 'large', 'xl', 'xxl', 'xxxl', 'inherit']), _propTypes2.default.number]),
    /**
     * ??? component = 'button' ???????????? button ????????? type ???
     */
    htmlType: _propTypes2.default.oneOf(['submit', 'reset', 'button']),
    /**
     * ??????????????????
     */
    component: _propTypes2.default.oneOf(['button', 'a', 'div', 'span']),
    /**
     * ???????????????????????????
     */
    loading: _propTypes2.default.bool,
    /**
     * ?????????????????????
     */
    ghost: _propTypes2.default.oneOf([true, false, 'light', 'dark']),
    /**
     * ?????????????????????
     */
    text: _propTypes2.default.bool,
    /**
     * ?????????????????????
     */
    warning: _propTypes2.default.bool,
    /**
     * ????????????
     */
    disabled: _propTypes2.default.bool,
    /**
     * ?????????????????????
     * @param {Object} e Event Object
     */
    onClick: _propTypes2.default.func,
    className: _propTypes2.default.string,
    onMouseUp: _propTypes2.default.func,
    children: _propTypes2.default.node
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
exports.default = Button;
module.exports = exports['default'];
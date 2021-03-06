'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

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

var _tag = require('./tag');

var _tag2 = _interopRequireDefault(_tag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Tag.Closeable
 */
var Closeable = (_temp = _class = function (_Component) {
    (0, _inherits3.default)(Closeable, _Component);

    function Closeable() {
        (0, _classCallCheck3.default)(this, Closeable);
        return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
    }

    Closeable.prototype.render = function render() {
        var _props = this.props,
            disabled = _props.disabled,
            className = _props.className,
            closeArea = _props.closeArea,
            onClose = _props.onClose,
            afterClose = _props.afterClose,
            onClick = _props.onClick,
            type = _props.type,
            size = _props.size,
            children = _props.children,
            rtl = _props.rtl,
            others = (0, _objectWithoutProperties3.default)(_props, ['disabled', 'className', 'closeArea', 'onClose', 'afterClose', 'onClick', 'type', 'size', 'children', 'rtl']);


        return _react2.default.createElement(
            _tag2.default,
            (0, _extends3.default)({}, others, {
                rtl: rtl,
                disabled: disabled,
                className: className,
                closeArea: closeArea,
                onClose: onClose,
                afterClose: afterClose,
                onClick: onClick,
                type: type,
                size: size,
                closable: true
            }),
            children
        );
    };

    return Closeable;
}(_react.Component), _class.propTypes = {
    disabled: _propTypes2.default.bool,
    className: _propTypes2.default.any,
    /**
     * closeable ????????? onClose ????????????, tag: ?????????, tail(??????): ????????????
     * @enumdesc ??????, ??????icon
     */
    closeArea: _propTypes2.default.oneOf(['tag', 'tail']),
    /**
     * ??????????????????????????????
     * @param {String} from ????????????, tag: ???????????????, tail: ??????????????????
     * @returns {Boolean} true?????????, false????????????
     */
    onClose: _propTypes2.default.func,
    /**
     * ??????????????????????????????
     */
    afterClose: _propTypes2.default.func,
    /**
     * ????????????
     */
    onClick: _propTypes2.default.func,
    type: _propTypes2.default.oneOf(['normal', 'primary']),
    /**
     * ??????????????????large ??????????????????????????? large = medium???
     */
    size: _propTypes2.default.oneOf(['small', 'medium', 'large']),
    children: _propTypes2.default.any,
    rtl: _propTypes2.default.bool
}, _class.defaultProps = {
    disabled: false,
    type: 'normal'
}, _temp);
Closeable.displayName = 'Closeable';
exports.default = Closeable;
module.exports = exports['default'];
'use strict';

exports.__esModule = true;
exports.default = undefined;

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

var _overlay = require('../overlay');

var _overlay2 = _interopRequireDefault(_overlay);

var _inner = require('./inner');

var _inner2 = _interopRequireDefault(_inner);

var _alignMap = require('./alignMap');

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Popup = _overlay2.default.Popup;


var alignMap = _alignMap.normalMap;
/** Balloon.Tooltip */
var Tooltip = (_temp = _class = function (_React$Component) {
    (0, _inherits3.default)(Tooltip, _React$Component);

    function Tooltip() {
        (0, _classCallCheck3.default)(this, Tooltip);
        return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));
    }

    Tooltip.prototype.render = function render() {
        var _props = this.props,
            id = _props.id,
            className = _props.className,
            align = _props.align,
            style = _props.style,
            prefix = _props.prefix,
            trigger = _props.trigger,
            children = _props.children,
            popupContainer = _props.popupContainer,
            popupProps = _props.popupProps,
            popupClassName = _props.popupClassName,
            popupStyle = _props.popupStyle,
            followTrigger = _props.followTrigger,
            triggerType = _props.triggerType,
            autoFocus = _props.autoFocus,
            alignEdge = _props.alignEdge,
            rtl = _props.rtl,
            delay = _props.delay,
            others = (0, _objectWithoutProperties3.default)(_props, ['id', 'className', 'align', 'style', 'prefix', 'trigger', 'children', 'popupContainer', 'popupProps', 'popupClassName', 'popupStyle', 'followTrigger', 'triggerType', 'autoFocus', 'alignEdge', 'rtl', 'delay']);


        var trOrigin = 'trOrigin';
        if (rtl) {
            others.rtl = true;
            trOrigin = 'rtlTrOrigin';
        }

        alignMap = alignEdge ? _alignMap.edgeMap : _alignMap.normalMap;

        var transformOrigin = alignMap[align][trOrigin];
        var _offset = alignMap[align].offset;
        var _style = (0, _extends3.default)({ transformOrigin: transformOrigin }, style);

        var content = _react2.default.createElement(
            _inner2.default,
            (0, _extends3.default)({}, others, {
                id: id,
                prefix: prefix,
                closable: false,
                isTooltip: true,
                className: className,
                style: _style,
                align: align,
                rtl: rtl,
                alignEdge: alignEdge
            }),
            children
        );

        var triggerProps = {};
        triggerProps['aria-describedby'] = id;
        triggerProps.tabIndex = '0';

        var newTriggerType = triggerType;

        if (triggerType === 'hover' && id) {
            newTriggerType = ['focus', 'hover'];
        }

        var ariaTrigger = id ? _react2.default.cloneElement(trigger, triggerProps) : trigger;

        var newTrigger = (0, _util.getDisabledCompatibleTrigger)(_react2.default.isValidElement(ariaTrigger) ? ariaTrigger : _react2.default.createElement(
            'span',
            null,
            ariaTrigger
        ));

        return _react2.default.createElement(
            Popup,
            (0, _extends3.default)({
                role: 'tooltip',
                container: popupContainer,
                followTrigger: followTrigger,
                trigger: newTrigger,
                triggerType: newTriggerType,
                align: alignMap[align].align,
                offset: _offset,
                delay: delay,
                className: popupClassName,
                style: popupStyle,
                rtl: rtl,
                autoFocus: triggerType === 'focus' ? false : autoFocus,
                shouldUpdatePosition: true,
                needAdjust: false,
                animation: {
                    in: 'zoomIn',
                    out: 'zoomOut'
                }
            }, popupProps),
            content
        );
    };

    return Tooltip;
}(_react2.default.Component), _class.propTypes = {
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
     * tooltip?????????
     */
    children: _propTypes2.default.any,
    /**
     * ???????????????
     * @enumdesc ???, ???, ???, ???, ??????, ??????, ??????, ??????, ??????, ??????, ??????, ??????
     */
    align: _propTypes2.default.oneOf(['t', 'r', 'b', 'l', 'tl', 'tr', 'bl', 'br', 'lt', 'lb', 'rt', 'rb']),
    /**
     * ????????????
     */
    trigger: _propTypes2.default.any,
    /**
     * ????????????
     * ????????????,  ????????????('hover', 'click')????????????????????????????????? ['hover', 'click'], ?????????????????????'focus'????????????????????????????????????triggerType???click???Balloon??????
     */
    triggerType: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.array]),
    /**
     * ????????????style????????????Popup
     */
    popupStyle: _propTypes2.default.object,
    /**
     * ????????????className????????????Popup
     */
    popupClassName: _propTypes2.default.string,
    /**
     * ??????????????????????????????Popup
     */
    popupProps: _propTypes2.default.object,
    /**
     * ??????pure render
     */
    pure: _propTypes2.default.bool,
    /**
     * ??????????????????????????????, ???????????????id????????????????????????????????????????????????
     */
    popupContainer: _propTypes2.default.any,
    /**
     * ??????????????????
     */
    followTrigger: _propTypes2.default.bool,
    /**
     * ??????id, ??????????????????????????????
     */
    id: _propTypes2.default.string,
    /**
     * ??????????????? Tooltip ?????????????????????????????????????????????????????? 100
     */
    delay: _propTypes2.default.number
}, _class.defaultProps = {
    triggerType: 'hover',
    prefix: 'next-',
    align: 'b',
    delay: 0,
    trigger: _react2.default.createElement('span', null)
}, _temp);
Tooltip.displayName = 'Tooltip';
exports.default = Tooltip;
module.exports = exports['default'];
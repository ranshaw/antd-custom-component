import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React from 'react';
import PropTypes from 'prop-types';
import Overlay from '../overlay';
import BalloonInner from './inner';
import { normalMap, edgeMap } from './alignMap';
import { getDisabledCompatibleTrigger } from './util';

var Popup = Overlay.Popup;


var alignMap = normalMap;
/** Balloon.Tooltip */
var Tooltip = (_temp = _class = function (_React$Component) {
    _inherits(Tooltip, _React$Component);

    function Tooltip() {
        _classCallCheck(this, Tooltip);

        return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
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
            others = _objectWithoutProperties(_props, ['id', 'className', 'align', 'style', 'prefix', 'trigger', 'children', 'popupContainer', 'popupProps', 'popupClassName', 'popupStyle', 'followTrigger', 'triggerType', 'autoFocus', 'alignEdge', 'rtl', 'delay']);

        var trOrigin = 'trOrigin';
        if (rtl) {
            others.rtl = true;
            trOrigin = 'rtlTrOrigin';
        }

        alignMap = alignEdge ? edgeMap : normalMap;

        var transformOrigin = alignMap[align][trOrigin];
        var _offset = alignMap[align].offset;
        var _style = _extends({ transformOrigin: transformOrigin }, style);

        var content = React.createElement(
            BalloonInner,
            _extends({}, others, {
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

        var ariaTrigger = id ? React.cloneElement(trigger, triggerProps) : trigger;

        var newTrigger = getDisabledCompatibleTrigger(React.isValidElement(ariaTrigger) ? ariaTrigger : React.createElement(
            'span',
            null,
            ariaTrigger
        ));

        return React.createElement(
            Popup,
            _extends({
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
}(React.Component), _class.propTypes = {
    /**
     * ???????????????????????????
     */
    prefix: PropTypes.string,
    /**
     * ???????????????
     */
    className: PropTypes.string,
    /**
     * ?????????????????????
     */
    style: PropTypes.object,
    /**
     * tooltip?????????
     */
    children: PropTypes.any,
    /**
     * ???????????????
     * @enumdesc ???, ???, ???, ???, ??????, ??????, ??????, ??????, ??????, ??????, ??????, ??????
     */
    align: PropTypes.oneOf(['t', 'r', 'b', 'l', 'tl', 'tr', 'bl', 'br', 'lt', 'lb', 'rt', 'rb']),
    /**
     * ????????????
     */
    trigger: PropTypes.any,
    /**
     * ????????????
     * ????????????,  ????????????('hover', 'click')????????????????????????????????? ['hover', 'click'], ?????????????????????'focus'????????????????????????????????????triggerType???click???Balloon??????
     */
    triggerType: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    /**
     * ????????????style????????????Popup
     */
    popupStyle: PropTypes.object,
    /**
     * ????????????className????????????Popup
     */
    popupClassName: PropTypes.string,
    /**
     * ??????????????????????????????Popup
     */
    popupProps: PropTypes.object,
    /**
     * ??????pure render
     */
    pure: PropTypes.bool,
    /**
     * ??????????????????????????????, ???????????????id????????????????????????????????????????????????
     */
    popupContainer: PropTypes.any,
    /**
     * ??????????????????
     */
    followTrigger: PropTypes.bool,
    /**
     * ??????id, ??????????????????????????????
     */
    id: PropTypes.string,
    /**
     * ??????????????? Tooltip ?????????????????????????????????????????????????????? 100
     */
    delay: PropTypes.number
}, _class.defaultProps = {
    triggerType: 'hover',
    prefix: 'next-',
    align: 'b',
    delay: 0,
    trigger: React.createElement('span', null)
}, _temp);
Tooltip.displayName = 'Tooltip';
export { Tooltip as default };
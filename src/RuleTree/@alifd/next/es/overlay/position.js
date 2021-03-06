import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import { Component, Children } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import ResizeObserver from 'resize-observer-polyfill';
import { func, dom, events } from '../util';
import position from './utils/position';
import findNode from './utils/find-node';

var noop = func.noop,
    bindCtx = func.bindCtx;
var getStyle = dom.getStyle;

var place = position.place;

var Position = (_temp = _class = function (_Component) {
    _inherits(Position, _Component);

    function Position(props) {
        _classCallCheck(this, Position);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        _this.observe = function () {
            var contentNode = _this.getContentNode();
            contentNode && _this.resizeObserver.observe(contentNode);
        };

        _this.unobserve = function () {
            _this.resizeObserver.disconnect();
        };

        bindCtx(_this, ['handleResize']);

        _this.resizeObserver = new ResizeObserver(_this.handleResize);
        return _this;
    }

    Position.prototype.componentDidMount = function componentDidMount() {
        this.setPosition();

        if (this.props.needListenResize) {
            events.on(window, 'resize', this.handleResize);
            this.observe();
        }
    };

    Position.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
        var props = this.props;


        if ('align' in props && props.align !== prevProps.align || props.shouldUpdatePosition) {
            this.shouldUpdatePosition = true;
        }

        if (this.shouldUpdatePosition) {
            clearTimeout(this.resizeTimeout);

            this.setPosition();
            this.shouldUpdatePosition = false;
        }
    };

    Position.prototype.componentWillUnmount = function componentWillUnmount() {
        if (this.props.needListenResize) {
            events.off(window, 'resize', this.handleResize);
            this.unobserve();
        }

        clearTimeout(this.resizeTimeout);
    };

    Position.prototype.setPosition = function setPosition() {
        var _props = this.props,
            align = _props.align,
            offset = _props.offset,
            beforePosition = _props.beforePosition,
            onPosition = _props.onPosition,
            needAdjust = _props.needAdjust,
            container = _props.container,
            rtl = _props.rtl,
            pinFollowBaseElementWhenFixed = _props.pinFollowBaseElementWhenFixed,
            autoFit = _props.autoFit;


        beforePosition();

        var contentNode = this.getContentNode();
        var targetNode = this.getTargetNode();

        if (contentNode && targetNode) {
            var resultAlign = place({
                pinElement: contentNode,
                baseElement: targetNode,
                pinFollowBaseElementWhenFixed: pinFollowBaseElementWhenFixed,
                align: align,
                offset: offset,
                autoFit: autoFit,
                container: container,
                needAdjust: needAdjust,
                isRtl: rtl
            });
            var top = getStyle(contentNode, 'top');
            var left = getStyle(contentNode, 'left');

            onPosition({
                align: resultAlign.split(' '),
                top: top,
                left: left
            }, contentNode);
        }
    };

    Position.prototype.getContentNode = function getContentNode() {
        try {
            return findDOMNode(this);
        } catch (err) {
            return null;
        }
    };

    Position.prototype.getTargetNode = function getTargetNode() {
        var target = this.props.target;


        return target === position.VIEWPORT ? position.VIEWPORT : findNode(target, this.props);
    };

    Position.prototype.handleResize = function handleResize() {
        var _this2 = this;

        clearTimeout(this.resizeTimeout);

        this.resizeTimeout = setTimeout(function () {
            _this2.setPosition();
        }, 200);
    };

    Position.prototype.render = function render() {
        return Children.only(this.props.children);
    };

    return Position;
}(Component), _class.VIEWPORT = position.VIEWPORT, _class.propTypes = {
    children: PropTypes.node,
    target: PropTypes.any,
    container: PropTypes.any,
    align: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    offset: PropTypes.array,
    beforePosition: PropTypes.func,
    onPosition: PropTypes.func,
    needAdjust: PropTypes.bool,
    autoFit: PropTypes.bool,
    needListenResize: PropTypes.bool,
    shouldUpdatePosition: PropTypes.bool,
    rtl: PropTypes.bool,
    pinFollowBaseElementWhenFixed: PropTypes.bool
}, _class.defaultProps = {
    align: 'tl bl',
    offset: [0, 0],
    beforePosition: noop,
    onPosition: noop,
    needAdjust: true,
    autoFit: false,
    needListenResize: true,
    shouldUpdatePosition: false,
    rtl: false
}, _temp);
Position.displayName = 'Position';
export { Position as default };
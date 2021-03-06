import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import React, { Component, Children } from 'react';
import { polyfill } from 'react-lifecycles-compat';
import ConfigProvider from '../../config-provider';
import { support, events, dom, obj } from '../../util';

var getHeight = function getHeight(el) {
    return dom.getStyle(el, 'height');
};
var setHeight = function setHeight(el, height) {
    return dom.setStyle(el, 'height', height);
};

/** Step */
var Step = (_temp = _class = function (_Component) {
    _inherits(Step, _Component);

    Step.getDerivedStateFromProps = function getDerivedStateFromProps(newProps) {
        if ('current' in newProps) {
            return {
                current: newProps.current
            };
        }
    };

    function Step(props, context) {
        _classCallCheck(this, Step);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

        _this._stepRefHandler = function (ref) {
            _this.step = ref;
        };

        _this.state = {
            parentWidth: 'auto',
            parentHeight: 'auto',
            currentfocus: 0
        };
        _this.resize = _this.resize.bind(_this);
        return _this;
    }

    Step.prototype.componentDidMount = function componentDidMount() {
        /* istanbul ignore if */
        if (!support.flex) {
            this.resize();
            events.on(window, 'resize', this.resize);
        }
        this.adjustHeight();
    };

    Step.prototype.componentDidUpdate = function componentDidUpdate() {
        this.adjustHeight();
    };

    Step.prototype.componentWillUnmount = function componentWillUnmount() {
        /* istanbul ignore if */
        if (!support.flex) {
            events.off(window, 'resize', this.resize);
        }
    };

    Step.prototype.adjustHeight = function adjustHeight() {
        var _props = this.props,
            shape = _props.shape,
            direction = _props.direction,
            prefix = _props.prefix,
            labelPlacement = _props.labelPlacement;

        var step = ReactDOM.findDOMNode(this.step);
        if (shape !== 'arrow' && (direction === 'horizontal' || direction === 'hoz') && (labelPlacement === 'vertical' || labelPlacement === 'ver')) {
            var height = Array.prototype.slice.call(step.getElementsByClassName(prefix + 'step-item')).reduce(function (ret, re) {
                var itemHeight = getHeight(re.getElementsByClassName(prefix + 'step-item-container')[0]) + getHeight(re.getElementsByClassName(prefix + 'step-item-body')[0]);
                return Math.max(itemHeight, ret);
            }, 0);
            setHeight(step, height);
        } else {
            setHeight(step, '');
        }
    };

    Step.prototype.resize = function resize() {
        if (this.step) {
            this.setState({
                parentWidth: this.step.offsetWidth || 0,
                parentHeight: this.step.offsetHeight || 0
            });
        }
    };

    // set dir key for aria handle
    // handleKeyDown = e => {
    //     const { shape, children } = this.props;
    //     const { length: max } = children;
    //     let { currentfocus } = this.state;
    //     const initPosition = currentfocus;
    //     switch (e.keyCode) {
    //         case KEYCODE.RIGHT:
    //         case KEYCODE.DOWN:
    //             currentfocus++;
    //             break;
    //         case KEYCODE.LEFT:
    //         case KEYCODE.UP:
    //             currentfocus--;
    //             break;
    //         default:
    //             break;
    //     }
    //     currentfocus =
    //         currentfocus >= max ? 0 : currentfocus < 0 ? max - 1 : currentfocus;
    //     this.setState({ currentfocus }, () => {
    //         const child = this.step.children[currentfocus];
    //         if (!child) return;
    //         const focusItem =
    //             shape === 'arrow'
    //                 ? child
    //                 : child.querySelector('.next-step-item-body');
    //         focusItem && focusItem.focus();
    //     });
    //     if (initPosition !== currentfocus) {
    //         e.preventDefault();
    //     }
    // };

    Step.prototype._getValidChildren = function _getValidChildren(children) {
        var result = [];
        React.Children.forEach(children, function (child) {
            if (React.isValidElement(child)) {
                result.push(child);
            }
        });
        return result;
    };

    Step.prototype.render = function render() {
        var _this2 = this,
            _classNames;

        // eslint-disable-next-line
        var _props2 = this.props,
            className = _props2.className,
            current = _props2.current,
            labelPlacement = _props2.labelPlacement,
            shape = _props2.shape,
            readOnly = _props2.readOnly,
            animation = _props2.animation,
            itemRender = _props2.itemRender,
            rtl = _props2.rtl,
            stretch = _props2.stretch;

        var others = obj.pickOthers(Step.propTypes, this.props);
        var _props3 = this.props,
            prefix = _props3.prefix,
            direction = _props3.direction,
            children = _props3.children;

        prefix = this.context.prefix || prefix;
        var _state = this.state,
            parentWidth = _state.parentWidth,
            parentHeight = _state.parentHeight;

        // type???????????????direction??????

        direction = shape === 'arrow' ? 'hoz' : direction;

        // children??????null
        children = this._getValidChildren(children);

        // ?????????????????????
        var cloneChildren = Children.map(children, function (child, index) {
            var status = index < current ? 'finish' : index === current ? 'process' : 'wait';

            return React.cloneElement(child, {
                prefix: prefix,
                key: index,
                index: index,
                total: children.length,
                status: child.props.status || status,
                shape: shape,
                direction: direction,
                labelPlacement: labelPlacement,
                parentWidth: parentWidth,
                parentHeight: parentHeight,
                readOnly: readOnly,
                animation: animation,
                tabIndex: 0,
                // tabIndex: this.state.currentfocus === index ? '0' : '-1',
                'aria-current': status === 'process' ? 'step' : null,
                itemRender: child.props.itemRender ? child.props.itemRender : itemRender, // ????????????Item???itemRender
                onResize: function onResize() {
                    _this2.step && _this2.adjustHeight();
                },
                stretch: stretch
            });
        });

        var _direction = direction === 'ver' || direction === 'vertical' ? 'vertical' : 'horizontal';
        var _labelPlacement = labelPlacement === 'ver' || labelPlacement === 'vertical' ? 'vertical' : 'horizontal';
        var stepCls = classNames((_classNames = {}, _classNames[prefix + 'step'] = true, _classNames[prefix + 'step-' + shape] = shape, _classNames[prefix + 'step-' + _direction] = _direction, _classNames[prefix + 'step-label-' + _labelPlacement] = _labelPlacement, _classNames[className] = className, _classNames));

        if (rtl) {
            others.dir = 'rtl';
        }

        // others.onKeyDown = makeChain(this.handleKeyDown, others.onKeyDown);
        return React.createElement(
            'ol',
            _extends({}, others, { className: stepCls, ref: this._stepRefHandler }),
            cloneChildren
        );
    };

    return Step;
}(Component), _class.propTypes = _extends({}, ConfigProvider.propTypes, {
    prefix: PropTypes.string,
    rtl: PropTypes.bool,
    /**
     * ????????????
     */
    current: PropTypes.number,
    /**
     * ????????????
     */
    direction: PropTypes.oneOf(['hoz', 'ver']),
    /**
     * ???????????????( direction ??? hoz )???????????????
     */
    labelPlacement: PropTypes.oneOf(['hoz', 'ver']),
    /**
     * ??????
     */
    shape: PropTypes.oneOf(['circle', 'arrow', 'dot']),
    /**
     * ??????????????????
     */
    readOnly: PropTypes.bool,
    /**
     * ??????????????????
     */
    animation: PropTypes.bool,
    /**
     * ??????????????????
     */
    className: PropTypes.string,
    /**
     * StepItem ??????????????????
     * @param {Number} index   ????????????
     * @param {String} status  ????????????
     * @returns {Node} ?????????????????????
     */
    itemRender: PropTypes.func,
    /**
     * ??????????????????
     */
    stretch: PropTypes.bool
}), _class.defaultProps = {
    prefix: 'next-',
    current: 0,
    direction: 'hoz',
    labelPlacement: 'ver',
    shape: 'circle',
    animation: true,
    itemRender: null,
    stretch: false
}, _class.contextTypes = {
    prefix: PropTypes.string
}, _temp);
Step.displayName = 'Step';


export default polyfill(Step);
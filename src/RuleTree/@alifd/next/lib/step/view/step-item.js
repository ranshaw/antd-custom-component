'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _class, _temp;

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _resizeObserverPolyfill = require('resize-observer-polyfill');

var _resizeObserverPolyfill2 = _interopRequireDefault(_resizeObserverPolyfill);

var _icon = require('../../icon');

var _icon2 = _interopRequireDefault(_icon);

var _progress = require('../../progress');

var _progress2 = _interopRequireDefault(_progress);

var _configProvider = require('../../config-provider');

var _configProvider2 = _interopRequireDefault(_configProvider);

var _util = require('../../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Step.Item */
var StepItem = (_temp = _class = function (_Component) {
    (0, _inherits3.default)(StepItem, _Component);

    function StepItem(props) {
        (0, _classCallCheck3.default)(this, StepItem);

        var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call(this, props));

        _this.onClick = function () {
            var _this$props = _this.props,
                index = _this$props.index,
                disabled = _this$props.disabled,
                readOnly = _this$props.readOnly,
                animation = _this$props.animation;

            if (disabled || readOnly) {
                return false;
            }

            if (animation && _this.stepNode) {
                _util.dom.hasClass(_this.stepNode, 'clicked') ? _util.dom.removeClass(_this.stepNode, 'clicked') : _util.dom.addClass(_this.stepNode, 'clicked');
            }
            _this.props.onClick(index);
        };

        _this.removeClickedCls = _this.removeClickedCls.bind(_this);
        _this._refHandlerCreator = _this._refHandlerCreator.bind(_this);
        _this.resize = _this.resize.bind(_this);
        _this.ro = new _resizeObserverPolyfill2.default(function () {
            var _this$props2 = _this.props,
                shape = _this$props2.shape,
                direction = _this$props2.direction,
                onResize = _this$props2.onResize;

            if (!_this.body || shape === 'arrow') {
                return;
            }
            if (direction === 'vertical' || direction === 'ver') {
                _this.resize();
            } else {
                onResize && onResize();
            }
        });
        return _this;
    }

    StepItem.prototype.componentDidMount = function componentDidMount() {
        var _props = this.props,
            shape = _props.shape,
            direction = _props.direction,
            labelPlacement = _props.labelPlacement,
            index = _props.index,
            total = _props.total,
            stretch = _props.stretch;

        this.body && this.ro.observe(_reactDom2.default.findDOMNode(this.body));
        if (shape === 'arrow') {
            return;
        }
        if (direction === 'vertical' || direction === 'ver') {
            this.resize();
            this.forceUpdate(); // ??????Step??????????????????????????????????????????0?????????
            this.eventHandler = _util.events.on(window, 'resize', this.resize); // ????????????Step
        } else if ((direction === 'horizontal' || direction === 'hoz') && (labelPlacement === 'horizontal' || labelPlacement === 'hoz') && index !== total - 1) {
            // ????????????Content
            this.adjustTail();
        }
        if (stretch && (direction === 'horizontal' || direction === 'hoz')) {
            this.adjustItemWidth();
        }
    };

    StepItem.prototype.componentDidUpdate = function componentDidUpdate() {
        var _this2 = this;

        var _props2 = this.props,
            shape = _props2.shape,
            direction = _props2.direction,
            labelPlacement = _props2.labelPlacement,
            index = _props2.index,
            total = _props2.total,
            rtl = _props2.rtl,
            stretch = _props2.stretch;

        if (shape === 'arrow') {
            return;
        }
        var resetTailStyle = function resetTailStyle() {
            _util.dom.setStyle(_this2.tail, {
                width: '',
                top: '',
                height: ''
            });
        };

        if (direction === 'vertical' || direction === 'ver') {
            this.resize();
        } else if (direction === 'horizontal' || direction === 'hoz') {
            var _dom$setStyle;

            var pos = rtl ? 'right' : 'left';
            _util.dom.setStyle(this.body, (_dom$setStyle = {
                width: ''
            }, _dom$setStyle[pos] = '', _dom$setStyle));
            if (shape === 'circle' && (labelPlacement === 'horizontal' || labelPlacement === 'hoz') && index !== total - 1) {
                // ????????????Content
                this.adjustTail();
            } else {
                resetTailStyle();
            }
            if (stretch) {
                this.adjustItemWidth();
            }
        } else if (index !== total - 1) {
            resetTailStyle();
        }
    };

    StepItem.prototype.componentWillUnmount = function componentWillUnmount() {
        this.eventHandler && this.eventHandler.off();
    };

    StepItem.prototype.adjustItemWidth = function adjustItemWidth() {
        var _props3 = this.props,
            index = _props3.index,
            total = _props3.total,
            labelPlacement = _props3.labelPlacement;

        var lastNodeWidth = labelPlacement === 'horizontal' || labelPlacement === 'hoz' ? this.container.offsetWidth + this.body.offsetWidth : this.title.offsetWidth;
        var width = total - 1 !== index ? 'calc((100% - ' + lastNodeWidth + 'px)/' + (total - 1) + ')' : 'auto';
        _util.dom.setStyle(this.step, {
            width: width
        });
    };

    StepItem.prototype.adjustTail = function adjustTail() {
        var width = this.container.offsetWidth + this.title.offsetWidth;
        _util.dom.setStyle(this.tail, {
            width: 'calc(100% - ' + width + 'px)',
            top: _util.dom.getStyle(this.container, 'height') / 2 + 'px'
        });
    };

    StepItem.prototype.resize = function resize() {
        var direction = this.props.direction;

        if (direction === 'vertical' || direction === 'ver') {
            var stepWidth = _util.dom.getStyle(this.step, 'width');
            var rtl = this.props.rtl;


            rtl ? this.body.style.right = stepWidth + 'px' : this.body.style.left = stepWidth + 'px';
            _util.dom.setStyle(this.body, {
                width: _util.dom.getStyle(this.step.parentNode.parentNode, 'width') - stepWidth
            });
            _util.dom.setStyle(this.tail, 'height', _util.dom.getStyle(this.body, 'height') - _util.dom.getStyle(this.container, 'height'));
        }
    };

    StepItem.prototype._getNode = function _getNode() {
        var _props4 = this.props,
            prefix = _props4.prefix,
            index = _props4.index,
            status = _props4.status,
            icon = _props4.icon,
            shape = _props4.shape,
            percent = _props4.percent,
            itemRender = _props4.itemRender;

        var nodeElement = icon;
        if (shape === 'dot') {
            nodeElement = icon ? _react2.default.createElement(_icon2.default, { type: icon }) : _react2.default.createElement(
                'div',
                { className: prefix + 'step-item-node-dot' },
                ' '
            );
        } else if (shape === 'circle' && percent) {
            nodeElement = _react2.default.createElement(_progress2.default, { shape: 'circle', percent: percent, className: prefix + 'step-item-progress' });
        } else if (shape === 'circle' && !!itemRender && typeof itemRender === 'function') {
            nodeElement = null; // ?????????????????????????????????????????????????????????
        } else {
            nodeElement = _react2.default.createElement(
                'div',
                { className: prefix + 'step-item-node-circle' },
                icon ? _react2.default.createElement(_icon2.default, { type: icon }) : this._itemRender(index, status)
            );
        }

        return nodeElement;
    };

    StepItem.prototype.getNode = function getNode(args) {
        var _props5 = this.props,
            prefix = _props5.prefix,
            itemRender = _props5.itemRender,
            index = _props5.index,
            status = _props5.status,
            title = _props5.title,
            content = _props5.content,
            shape = _props5.shape;
        var others = args.others,
            stepCls = args.stepCls,
            overlayCls = args.overlayCls;

        var nodeElement = this._getNode();
        var containerStyle = shape === 'dot' && { fontSize: 'initial' } || {};
        var finalNodeElement = _react2.default.createElement(
            'div',
            {
                className: prefix + 'step-item-container',
                style: containerStyle,
                ref: this._refHandlerCreator('container')
            },
            _react2.default.createElement(
                'div',
                { className: prefix + 'step-item-node-placeholder', onClick: this.onClick },
                _react2.default.createElement(
                    'div',
                    {
                        className: prefix + 'step-item-node',
                        ref: this._refHandlerCreator('stepNode'),
                        onTransitionEnd: this.removeClickedCls
                    },
                    nodeElement
                )
            )
        );

        if (!nodeElement) {
            // ????????????????????????
            finalNodeElement = _react2.default.createElement(
                'div',
                {
                    className: prefix + 'step-item-container',
                    style: containerStyle,
                    ref: this._refHandlerCreator('container')
                },
                _react2.default.createElement(
                    'div',
                    { className: prefix + 'step-item-node-placeholder', onClick: this.onClick },
                    itemRender(index, status, title, content)
                )
            );
        }
        if (shape !== 'arrow') {
            delete others.tabIndex;
            delete others['aria-current'];
        }

        return _react2.default.createElement(
            'li',
            (0, _extends3.default)({}, others, { style: this.getStyle(), className: stepCls, ref: this._refHandlerCreator('step') }),
            finalNodeElement,
            _react2.default.createElement(
                'div',
                {
                    className: prefix + 'step-item-body',
                    ref: this._refHandlerCreator('body'),
                    tabIndex: this.props.tabIndex,
                    'aria-current': this.props['aria-current']
                },
                _react2.default.createElement(
                    'div',
                    { className: prefix + 'step-item-title', ref: this._refHandlerCreator('title') },
                    title
                ),
                _react2.default.createElement(
                    'div',
                    { className: prefix + 'step-item-content' },
                    content
                )
            ),
            _react2.default.createElement(
                'div',
                { className: prefix + 'step-item-tail', ref: this._refHandlerCreator('tail') },
                _react2.default.createElement(
                    'div',
                    { className: prefix + 'step-item-tail-underlay' },
                    _react2.default.createElement('div', { className: prefix + 'step-item-tail-overlay', style: overlayCls })
                )
            )
        );
    };

    StepItem.prototype.getStyle = function getStyle() {
        var _props6 = this.props,
            parentWidth = _props6.parentWidth,
            parentHeight = _props6.parentHeight,
            direction = _props6.direction,
            total = _props6.total,
            index = _props6.index,
            shape = _props6.shape;

        var width = 'auto';

        if (Number(parentWidth) && Number(parentHeight)) {
            if (!_util.support.flex && shape === 'arrow') {
                width = Math.floor(parentWidth / total - parentHeight / 2 - parentHeight / 8);
            }
        }
        if (shape !== 'arrow' && (direction === 'horizontal' || direction === 'hoz')) {
            width = total - 1 !== index ? Math.floor(100 / total) + '%' : 'auto';
        }
        return {
            width: width
        };
    };

    StepItem.prototype.removeClickedCls = function removeClickedCls() {
        var animation = this.props.animation;

        if (animation && this.stepNode && _util.dom.hasClass(this.stepNode, 'clicked')) {
            _util.dom.removeClass(this.stepNode, 'clicked');
        }
    };

    // ?????????????????????


    StepItem.prototype._itemRender = function _itemRender(index, status) {
        var itemRender = this.props.itemRender;

        if (itemRender) {
            return itemRender(index, status);
        }
        return status === 'finish' ? _react2.default.createElement(_icon2.default, { type: 'select' }) : index + 1;
    };

    StepItem.prototype._refHandlerCreator = function _refHandlerCreator(refName) {
        var self = this;
        return function (ref) {
            self[refName] = ref;
        };
    };

    StepItem.prototype.render = function render() {
        var _classNames;

        // eslint-disable-next-line
        var _props7 = this.props,
            prefix = _props7.prefix,
            locale = _props7.locale,
            className = _props7.className,
            status = _props7.status,
            title = _props7.title,
            icon = _props7.icon,
            index = _props7.index,
            total = _props7.total,
            shape = _props7.shape,
            content = _props7.content,
            direction = _props7.direction,
            disabled = _props7.disabled,
            onClick = _props7.onClick,
            readOnly = _props7.readOnly,
            animation = _props7.animation,
            parentHeight = _props7.parentHeight,
            itemRender = _props7.itemRender,
            parentWidth = _props7.parentWidth,
            labelPlacement = _props7.labelPlacement,
            rtl = _props7.rtl,
            onResize = _props7.onResize;


        var others = _util.obj.pickOthers(StepItem.propTypes, this.props);

        var stepCls = (0, _classnames2.default)((_classNames = {}, _classNames[prefix + 'step-item'] = true, _classNames[prefix + 'step-item-' + status] = status, _classNames[prefix + 'step-item-first'] = index === 0, _classNames[prefix + 'step-item-last'] = index === total - 1, _classNames[prefix + 'step-item-disabled'] = disabled, _classNames[prefix + 'step-item-read-only'] = readOnly, _classNames[className] = className, _classNames));

        var overlayCls = status === 'finish' ? { width: '100%' } : null;
        var arrowElement = _react2.default.createElement(
            'li',
            (0, _extends3.default)({}, others, { style: this.getStyle(), className: stepCls, onClick: this.onClick }),
            _react2.default.createElement(
                'div',
                { className: prefix + 'step-item-container' },
                _react2.default.createElement(
                    'div',
                    { className: prefix + 'step-item-title' },
                    title
                )
            )
        );
        var otherElement = this.getNode({ others: others, stepCls: stepCls, overlayCls: overlayCls });

        return shape === 'arrow' ? arrowElement : otherElement;
    };

    return StepItem;
}(_react.Component), _class.propTypes = (0, _extends3.default)({}, _configProvider2.default.propTypes, {
    prefix: _propTypes2.default.string,
    rtl: _propTypes2.default.bool,
    /**
     * ???????????????????????????????????????????????? Step ??? current ??????????????????????????? `wait`, `process`, `finish`
     */
    status: _propTypes2.default.oneOf(['wait', 'process', 'finish']),
    /**
     * ??????
     */
    title: _propTypes2.default.node,
    direction: _propTypes2.default.oneOf(['hoz', 'ver']),
    labelPlacement: _propTypes2.default.oneOf(['hoz', 'ver']),
    shape: _propTypes2.default.oneOf(['circle', 'arrow', 'dot']),
    /**
     * ??????
     */
    icon: _propTypes2.default.string,
    /**
     * ????????????, shape??? arrow ?????????
     */
    content: _propTypes2.default.node,
    /**
     * StepItem ??????????????????, ???????????????????????????itemRender
     * @param {Number} index   ????????????
     * @param {String} status  ????????????
     * @returns {Node} ?????????????????????
     */
    itemRender: _propTypes2.default.func,
    /**
     * ?????????
     */
    percent: _propTypes2.default.number,
    index: _propTypes2.default.number,
    total: _propTypes2.default.number,
    animation: _propTypes2.default.bool, // ????????????????????????????????????
    /**
     * ????????????
     */
    disabled: _propTypes2.default.bool,
    parentWidth: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
    parentHeight: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
    /**
     * ????????????????????????
     * @param {Number} index ????????????
     */
    onClick: _propTypes2.default.func,
    /**
     * ???????????????
     */
    className: _propTypes2.default.string,
    readOnly: _propTypes2.default.bool,
    onResize: _propTypes2.default.func,
    stretch: _propTypes2.default.bool
}), _class.defaultProps = {
    shape: 'circle',
    index: 0,
    total: 1,
    onClick: function onClick() {},
    stretch: false
}, _temp);
StepItem.displayName = 'StepItem';
exports.default = _configProvider2.default.config(StepItem);
module.exports = exports['default'];
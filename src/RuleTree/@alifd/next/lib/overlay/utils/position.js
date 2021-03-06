'use strict';

exports.__esModule = true;
exports.default = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _class, _temp, _initialiseProps;

var _util = require('../../util');

var _findNode = require('./find-node');

var _findNode2 = _interopRequireDefault(_findNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var VIEWPORT = 'viewport';

// IE8 not support pageXOffset
var getPageX = function getPageX() {
    return window.pageXOffset || document.documentElement.scrollLeft;
};
var getPageY = function getPageY() {
    return window.pageYOffset || document.documentElement.scrollTop;
};

/**
 * @private get element size
 * @param       {Element} element
 * @return      {Object}
 */
function _getSize(element) {
    // element like `svg` do not have offsetWidth and offsetHeight prop
    // then getBoundingClientRect
    if ('offsetWidth' in element && 'offsetHeight' in element) {
        return {
            width: element.offsetWidth,
            height: element.offsetHeight
        };
    } else {
        var _element$getBoundingC = element.getBoundingClientRect(),
            width = _element$getBoundingC.width,
            height = _element$getBoundingC.height;

        return {
            width: width,
            height: height
        };
    }
}

/**
 * @private get element rect
 * @param       {Element} elem
 * @return      {Object}
 */
function _getElementRect(elem, container) {
    var offsetTop = 0,
        offsetLeft = 0,
        scrollTop = 0,
        scrollLeft = 0;

    var _getSize2 = _getSize(elem),
        width = _getSize2.width,
        height = _getSize2.height;

    do {
        if (!isNaN(elem.offsetTop)) {
            offsetTop += elem.offsetTop;
        }
        if (!isNaN(elem.offsetLeft)) {
            offsetLeft += elem.offsetLeft;
        }
        if (elem && elem.offsetParent) {
            if (!isNaN(elem.offsetParent.scrollLeft) && elem.offsetParent !== document.body) {
                scrollLeft += elem.offsetParent.scrollLeft;
            }

            if (!isNaN(elem.offsetParent.scrollTop) && elem.offsetParent !== document.body) {
                scrollTop += elem.offsetParent.scrollTop;
            }
        }

        elem = elem.offsetParent;
    } while (elem !== null && elem !== container);

    // if container is body or invalid, treat as window, use client width & height
    var treatAsWindow = !container || container === document.body;

    return {
        top: offsetTop - scrollTop - (treatAsWindow ? document.documentElement.scrollTop || document.body.scrollTop : 0),
        left: offsetLeft - scrollLeft - (treatAsWindow ? document.documentElement.scrollLeft || document.body.scrollLeft : 0),
        width: width,
        height: height
    };
}

/**
 * @private get viewport size
 * @return {Object}
 */
function _getViewportSize(container) {
    if (!container || container === document.body) {
        return {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        };
    }

    var _container$getBoundin = container.getBoundingClientRect(),
        width = _container$getBoundin.width,
        height = _container$getBoundin.height;

    return {
        width: width,
        height: height
    };
}

var getContainer = function getContainer(_ref) {
    var container = _ref.container,
        baseElement = _ref.baseElement;

    // SSR??????????????????
    if ((typeof document === 'undefined' ? 'undefined' : (0, _typeof3.default)(document)) === undefined) {
        return container;
    }

    var calcContainer = (0, _findNode2.default)(container, baseElement);

    if (!calcContainer) {
        calcContainer = document.body;
    }

    while (_util.dom.getStyle(calcContainer, 'position') === 'static') {
        if (!calcContainer || calcContainer === document.body) {
            return document.body;
        }
        calcContainer = calcContainer.parentNode;
    }

    return calcContainer;
};

var Position = (_temp = _class = function () {
    function Position(props) {
        (0, _classCallCheck3.default)(this, Position);

        _initialiseProps.call(this);

        this.pinElement = props.pinElement;
        this.baseElement = props.baseElement;
        this.pinFollowBaseElementWhenFixed = props.pinFollowBaseElementWhenFixed;
        this.container = getContainer(props);
        this.autoFit = props.autoFit || false;
        this.align = props.align || 'tl tl';
        this.offset = props.offset || [0, 0];
        this.needAdjust = props.needAdjust || false;
        this.isRtl = props.isRtl || false;
    }

    /**
     * @public static place method
     * @param  {Object}       props
     *     @param  {DOM}      props.pinElement
     *     @param  {DOM}      props.baseElement
     *     @param  {String}   props.align
     *     @param  {Number}   props.offset
     *     @param  {Boolean}  props.needAdjust
     *     @param  {Boolean}  props.isRtl
     * @return {Position}
     */


    Position.prototype.setPosition = function setPosition() {
        var pinElement = this.pinElement;
        var baseElement = this.baseElement;
        var pinFollowBaseElementWhenFixed = this.pinFollowBaseElementWhenFixed;
        var expectedAlign = this._getExpectedAlign();
        var isPinFixed = void 0,
            isBaseFixed = void 0,
            firstPositionResult = void 0;
        if (pinElement === VIEWPORT) {
            return;
        }
        if (_util.dom.getStyle(pinElement, 'position') !== 'fixed') {
            _util.dom.setStyle(pinElement, 'position', 'absolute');
            isPinFixed = false;
        } else {
            isPinFixed = true;
        }
        if (baseElement === VIEWPORT || _util.dom.getStyle(baseElement, 'position') !== 'fixed') {
            isBaseFixed = false;
        } else {
            isBaseFixed = true;
        }

        // ?????????????????????
        for (var i = 0; i < expectedAlign.length; i++) {
            var align = expectedAlign[i];
            var pinElementPoints = this._normalizePosition(pinElement, align.split(' ')[0], isPinFixed);
            var baseElementPoints = this._normalizePosition(baseElement, align.split(' ')[1],
            // ????????????????????????????????????dialog????????????
            isPinFixed && !pinFollowBaseElementWhenFixed);

            var pinElementParentOffset = this._getParentOffset(pinElement);
            var pinElementParentScrollOffset = this._getParentScrollOffset(pinElement);

            var baseElementOffset = isPinFixed && isBaseFixed ? this._getLeftTop(baseElement) : // ??? pin ??? fixed ?????????????????????????????? base ???????????????????????? base ??? offset ????????????????????????
            baseElementPoints.offset(isPinFixed && pinFollowBaseElementWhenFixed);
            var top = baseElementOffset.top + baseElementPoints.y - pinElementParentOffset.top - pinElementPoints.y + pinElementParentScrollOffset.top;
            var left = baseElementOffset.left + baseElementPoints.x - pinElementParentOffset.left - pinElementPoints.x + pinElementParentScrollOffset.left;

            this._setPinElementPostion(pinElement, { left: left, top: top }, this.offset);

            if (this._isInViewport(pinElement, align)) {
                return align;
            } else if (!firstPositionResult) {
                if (this.needAdjust && !this.autoFit) {
                    var _getViewportOffset2 = this._getViewportOffset(pinElement, align),
                        right = _getViewportOffset2.right;

                    firstPositionResult = {
                        left: right < 0 ? left + right : left,
                        top: top
                    };
                } else {
                    firstPositionResult = { left: left, top: top };
                }
            }
        }

        // This will only execute if `pinElement` could not be placed entirely in the Viewport
        var inViewportLeft = this._makeElementInViewport(pinElement, firstPositionResult.left, 'Left', isPinFixed);
        var inViewportTop = this._makeElementInViewport(pinElement, firstPositionResult.top, 'Top', isPinFixed);

        this._setPinElementPostion(pinElement, { left: inViewportLeft, top: inViewportTop }, this._calPinOffset(expectedAlign[0]));

        return expectedAlign[0];
    };

    Position.prototype._getParentOffset = function _getParentOffset(element) {
        var parent = element.offsetParent || document.documentElement;
        var offset = void 0;
        if (parent === document.body && _util.dom.getStyle(parent, 'position') === 'static') {
            offset = {
                top: 0,
                left: 0
            };
        } else {
            offset = this._getElementOffset(parent);
        }

        offset.top += parseFloat(_util.dom.getStyle(parent, 'border-top-width'), 10);
        offset.left += parseFloat(_util.dom.getStyle(parent, 'border-left-width'), 10);
        offset.offsetParent = parent;
        return offset;
    };

    Position.prototype._makeElementInViewport = function _makeElementInViewport(pinElement, number, type, isPinFixed) {
        // pinElement.offsetParent is never body because wrapper has position: absolute
        // refactored to make code clearer. Revert if wrapper style changes.
        var result = number;
        var docElement = document.documentElement;
        var offsetParent = pinElement.offsetParent || document.documentElement;

        if (result < 0) {
            if (isPinFixed) {
                result = 0;
            } else if (offsetParent === document.body && _util.dom.getStyle(offsetParent, 'position') === 'static') {
                // Only when div's offsetParent is document.body, we set new position result.
                result = Math.max(docElement['scroll' + type], document.body['scroll' + type]);
            }
        }
        return result;
    };

    // ???????????????????????????????????????????????????fixed??????????????????dialog??????????????????trigger??????


    Position.prototype._normalizePosition = function _normalizePosition(element, align, ignoreElementOffset) {
        var points = this._normalizeElement(element, ignoreElementOffset);
        this._normalizeXY(points, align);

        return points;
    };

    Position.prototype._normalizeXY = function _normalizeXY(points, align) {
        var x = align.split('')[1];
        var y = align.split('')[0];

        points.x = this._xyConverter(x, points, 'width');
        points.y = this._xyConverter(y, points, 'height');

        return points;
    };

    Position.prototype._xyConverter = function _xyConverter(align, points, type) {
        var res = align.replace(/t|l/gi, '0%').replace(/c/gi, '50%').replace(/b|r/gi, '100%').replace(/(\d+)%/gi, function (m, d) {
            return points.size()[type] * (d / 100);
        });

        return parseFloat(res, 10) || 0;
    };

    Position.prototype._getLeftTop = function _getLeftTop(element) {
        return {
            left: parseFloat(_util.dom.getStyle(element, 'left')) || 0,
            top: parseFloat(_util.dom.getStyle(element, 'top')) || 0
        };
    };

    Position.prototype._normalizeElement = function _normalizeElement(element, ignoreElementOffset) {
        var _this = this;

        var result = {
            element: element,
            x: 0,
            y: 0
        },
            isViewport = element === VIEWPORT,
            docElement = document.documentElement;

        result.offset = function (ignoreScroll) {
            // ?????????????????????????????????????????????ing?????????????????? fixed ?????????????????? dialog ?????????????????? trigger ??????
            if (ignoreElementOffset) {
                return {
                    left: 0,
                    top: 0
                };
            } else if (isViewport) {
                return {
                    left: getPageX(),
                    top: getPageY()
                };
            } else {
                return _this._getElementOffset(element, ignoreScroll);
            }
        };

        result.size = function () {
            if (isViewport) {
                return {
                    width: docElement.clientWidth,
                    height: docElement.clientHeight
                };
            } else {
                return _getSize(element);
            }
        };

        return result;
    };

    // ignoreScroll ??? pin ????????? fixed ????????????????????????????????????????????????
    // ??? fixed ????????? subNav ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????


    Position.prototype._getElementOffset = function _getElementOffset(element, ignoreScroll) {
        var rect = element.getBoundingClientRect();
        var docElement = document.documentElement;
        var body = document.body;
        var docClientLeft = docElement.clientLeft || body.clientLeft || 0;
        var docClientTop = docElement.clientTop || body.clientTop || 0;

        return {
            left: rect.left + (ignoreScroll ? 0 : getPageX()) - docClientLeft,
            top: rect.top + (ignoreScroll ? 0 : getPageY()) - docClientTop
        };
    };

    // According to the location of the overflow to calculate the desired positioning


    Position.prototype._getExpectedAlign = function _getExpectedAlign() {
        var align = this.isRtl ? this._replaceAlignDir(this.align, /l|r/g, { l: 'r', r: 'l' }) : this.align;
        var expectedAlign = [align];
        if (this.needAdjust) {
            if (/t|b/g.test(align)) {
                expectedAlign.push(this._replaceAlignDir(align, /t|b/g, { t: 'b', b: 't' }));
            }
            if (/l|r/g.test(align)) {
                expectedAlign.push(this._replaceAlignDir(align, /l|r/g, { l: 'r', r: 'l' }));
            }
            if (/c/g.test(align)) {
                expectedAlign.push(this._replaceAlignDir(align, /c(?= |$)/g, { c: 'l' }));
                expectedAlign.push(this._replaceAlignDir(align, /c(?= |$)/g, { c: 'r' }));
            }
            expectedAlign.push(this._replaceAlignDir(align, /l|r|t|b/g, {
                l: 'r',
                r: 'l',
                t: 'b',
                b: 't'
            }));
        }
        return expectedAlign;
    };

    // Transform align order.


    Position.prototype._replaceAlignDir = function _replaceAlignDir(align, regExp, map) {
        return align.replace(regExp, function (res) {
            return map[res];
        });
    };

    // Are the right sides of the pin and base aligned?


    Position.prototype._isRightAligned = function _isRightAligned(align) {
        var _align$split = align.split(' '),
            pinAlign = _align$split[0],
            baseAlign = _align$split[1];

        return pinAlign[1] === 'r' && pinAlign[1] === baseAlign[1];
    };

    // Are the bottoms of the pin and base aligned?


    Position.prototype._isBottomAligned = function _isBottomAligned(align) {
        var _align$split2 = align.split(' '),
            pinAlign = _align$split2[0],
            baseAlign = _align$split2[1];

        return pinAlign[0] === 'b' && pinAlign[0] === baseAlign[0];
    };

    // Detecting element is in the window??? we want to adjust position later.


    Position.prototype._isInViewport = function _isInViewport(element, align) {
        var viewportSize = _getViewportSize(this.container);
        var elementRect = _getElementRect(element, this.container);
        var elementSize = _getSize(element);

        // https://github.com/alibaba-fusion/next/issues/853
        // Equality causes issues in Chrome when pin element is off screen to right or bottom.
        // If it is not supposed to align with the bottom or right, then subtract 1 to use strict less than.
        var viewportWidth = this._isRightAligned(align) ? viewportSize.width : viewportSize.width - 1;
        var viewportHeight = this._isBottomAligned(align) ? viewportSize.height : viewportSize.height - 1;

        // ?????????????????? select + table ???????????????????????????????????????????????????????????????
        // ??? balloon ?????????????????????
        if (this.autoFit) {
            return elementRect.top >= 0 && elementRect.top + element.offsetHeight <= viewportHeight;
        }

        // Avoid animate problem that use offsetWidth instead of getBoundingClientRect.
        return elementRect.left >= 0 && elementRect.left + elementSize.width <= viewportWidth && elementRect.top >= 0 && elementRect.top + elementSize.height <= viewportHeight;
    };

    Position.prototype._getViewportOffset = function _getViewportOffset(element, align) {
        var viewportSize = _getViewportSize(this.container);
        var elementRect = _getElementRect(element, this.container);
        var elementSize = _getSize(element);

        var viewportWidth = this._isRightAligned(align) ? viewportSize.width : viewportSize.width - 1;
        var viewportHeight = this._isBottomAligned(align) ? viewportSize.height : viewportSize.height - 1;

        return {
            top: elementRect.top,
            right: viewportWidth - (elementRect.left + elementSize.width),
            bottom: viewportHeight - (elementRect.top + elementSize.height),
            left: elementRect.left
        };
    };

    // ????????????RTL?????? top-left ???????????????????????? top-right??????


    Position.prototype._setPinElementPostion = function _setPinElementPostion(pinElement, postion) {
        var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0, 0];
        var top = postion.top,
            left = postion.left;

        if (!this.isRtl) {
            _util.dom.setStyle(pinElement, {
                left: left + offset[0] + 'px',
                top: top + offset[1] + 'px'
            });
            return;
        }

        // transfer {left,top} equaly to {right,top}
        var pinElementParentOffset = this._getParentOffset(pinElement);

        var _getElementRect2 = _getElementRect(pinElementParentOffset.offsetParent),
            offsetParentWidth = _getElementRect2.width;

        var _getElementRect3 = _getElementRect(pinElement),
            width = _getElementRect3.width;

        var right = offsetParentWidth - (left + width);
        _util.dom.setStyle(pinElement, {
            left: 'auto',
            right: right + offset[0] + 'px',
            top: top + offset[1] + 'px'
        });
    };

    return Position;
}(), _class.VIEWPORT = VIEWPORT, _class.place = function (props) {
    return new Position(props).setPosition();
}, _initialiseProps = function _initialiseProps() {
    var _this2 = this;

    this._calPinOffset = function (align) {
        var offset = [].concat(_this2.offset);

        if (_this2.autoFit && align && _this2.container && _this2.container !== document.body) {
            var baseElementRect = _getElementRect(_this2.baseElement, _this2.container);
            var pinElementRect = _getElementRect(_this2.pinElement, _this2.container);
            var viewportSize = _getViewportSize(_this2.container);
            var pinAlign = align.split(' ')[0];
            var x = pinAlign.charAt(1);
            var y = pinAlign.charAt(0);

            if (pinElementRect.top < 0 || pinElementRect.top + pinElementRect.height > viewportSize.height) {
                offset[1] = -baseElementRect.top - (y === 't' ? baseElementRect.height : 0);
            }
        }
        return offset;
    };

    this._getParentScrollOffset = function (elem) {
        var top = 0;
        var left = 0;

        if (elem && elem.offsetParent && elem.offsetParent !== document.body) {
            if (!isNaN(elem.offsetParent.scrollTop)) {
                top += elem.offsetParent.scrollTop;
            }
            if (!isNaN(elem.offsetParent.scrollLeft)) {
                left += elem.offsetParent.scrollLeft;
            }
        }

        return {
            top: top,
            left: left
        };
    };
}, _temp);
exports.default = Position;
module.exports = exports['default'];
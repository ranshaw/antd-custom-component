'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _trackHelper = require('./trackHelper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var helpers = {
    initialize: function initialize(props) {
        var _this = this;

        var slickList = _reactDom2.default.findDOMNode(this.list);
        var slideCount = _react2.default.Children.count(props.children);
        var listWidth = this.getWidth(slickList) || 0;
        var trackWidth = this.getWidth(_reactDom2.default.findDOMNode(this.track)) || 0;
        var slideWidth = void 0;

        if (!props.vertical) {
            var centerPaddingAdj = props.centerMode && parseInt(props.centerPadding) * 2;
            slideWidth = (listWidth - centerPaddingAdj) / props.slidesToShow;
        } else {
            slideWidth = listWidth;
        }

        var slideHeight = this.getHeight(slickList.querySelector('[data-index="0"]')) || 0;
        var listHeight = slideHeight * props.slidesToShow;

        var slidesToShow = props.slidesToShow || 1;

        var activeIndex = 'activeIndex' in props ? props.activeIndex : props.defaultActiveIndex;
        var currentSlide = props.rtl ? slideCount - 1 - (slidesToShow - 1) - activeIndex : activeIndex;

        this.setState({
            slideCount: slideCount,
            slideWidth: slideWidth,
            listWidth: listWidth,
            trackWidth: trackWidth,
            currentSlide: currentSlide,
            slideHeight: slideHeight,
            listHeight: listHeight
        }, function () {
            var targetLeft = (0, _trackHelper.getTrackLeft)((0, _extends3.default)({
                slideIndex: _this.state.currentSlide,
                trackRef: _this.track
            }, props, _this.state));
            // getCSS function needs previously set state
            var trackStyle = (0, _trackHelper.getTrackCSS)((0, _extends3.default)({
                left: targetLeft
            }, props, _this.state));

            _this.setState({ trackStyle: trackStyle });

            _this.autoPlay(); // once we're set up, trigger the initial autoplay.
        });
    },
    update: function update(props) {
        this.initialize(props);
    },
    getWidth: function getWidth(elem) {
        if ('clientWidth' in elem) {
            return elem.clientWidth;
        }
        return elem && elem.getBoundingClientRect().width;
    },
    getHeight: function getHeight(elem) {
        if ('clientHeight' in elem) {
            return elem.clientHeight;
        }
        return elem && elem.getBoundingClientRect().height;
    },
    adaptHeight: function adaptHeight() {
        if (this.props.adaptiveHeight) {
            var selector = '[data-index="' + this.state.currentSlide + '"]';
            if (this.list) {
                var slickList = _reactDom2.default.findDOMNode(this.list);
                var listHeight = slickList.querySelector(selector).offsetHeight;
                slickList.style.height = listHeight + 'px';
            }
        }
    },
    canGoNext: function canGoNext(opts) {
        var canGo = true;
        if (!opts.infinite) {
            if (opts.centerMode) {
                if (opts.currentSlide >= opts.slideCount - 1) {
                    canGo = false;
                }
            } else if (opts.slideCount <= opts.slidesToShow || opts.currentSlide >= opts.slideCount - opts.slidesToShow) {
                // check if all slides are shown in slider
                canGo = false;
            }
        }
        return canGo;
    },
    slideHandler: function slideHandler(index) {
        var _this2 = this;

        var rtl = this.props.rtl;

        // Functionality of animateSlide and postSlide is merged into this function

        var targetSlide = void 0,
            currentSlide = void 0;
        var callback = void 0;

        if (this.props.waitForAnimate && this.state.animating) {
            return;
        }

        if (this.props.animation === 'fade') {
            currentSlide = this.state.currentSlide;

            // don't change slide if it's not infinite and current slide is the first or last slide'
            if (this.props.infinite === false && (index < 0 || index >= this.state.slideCount)) {
                return;
            }

            //  Shifting targetSlide back into the range
            if (index < 0) {
                targetSlide = index + this.state.slideCount;
            } else if (index >= this.state.slideCount) {
                targetSlide = index - this.state.slideCount;
            } else {
                targetSlide = index;
            }

            if (this.props.lazyLoad && this.state.lazyLoadedList.indexOf(targetSlide) < 0) {
                this.setState({
                    lazyLoadedList: this.state.lazyLoadedList.concat(targetSlide)
                });
            }

            callback = function callback() {
                _this2.setState({
                    animating: false
                });
                _this2.props.onChange(targetSlide);
                delete _this2.animationEndCallback;
            };

            this.props.onBeforeChange(this.state.currentSlide, targetSlide);

            this.setState({
                animating: true,
                currentSlide: targetSlide
            }, function () {
                this.animationEndCallback = setTimeout(callback, this.props.speed + 20);
            });

            this.autoPlay();
            return;
        }

        targetSlide = index;

        if (rtl) {
            if (targetSlide < 0) {
                if (this.props.infinite === false) {
                    currentSlide = 0;
                } else if (this.state.slideCount % this.props.slidesToScroll !== 0) {
                    if (targetSlide + this.props.slidesToScroll <= 0) {
                        currentSlide = this.state.slideCount + targetSlide;
                        targetSlide = this.state.slideCount - this.props.slidesToScroll;
                    } else {
                        currentSlide = targetSlide = 0;
                    }
                } else {
                    // this.state.slideCount % this.props.slidesToScroll
                    currentSlide = this.state.slideCount + targetSlide;
                }
            } else if (targetSlide >= this.state.slideCount) {
                if (this.props.infinite === false) {
                    currentSlide = this.state.slideCount - this.props.slidesToShow;
                } else if (this.state.slideCount % this.props.slidesToScroll !== 0) {
                    currentSlide = 0;
                } else {
                    currentSlide = targetSlide - this.state.slideCount;
                }
            } else {
                currentSlide = targetSlide;
            }
        } else if (targetSlide < 0) {
            if (this.props.infinite === false) {
                currentSlide = 0;
            } else if (this.state.slideCount % this.props.slidesToScroll !== 0) {
                currentSlide = this.state.slideCount - this.state.slideCount % this.props.slidesToScroll;
            } else {
                currentSlide = this.state.slideCount + targetSlide;
            }
        } else if (targetSlide >= this.state.slideCount) {
            if (this.props.infinite === false) {
                currentSlide = this.state.slideCount - this.props.slidesToShow;
            } else if (this.state.slideCount % this.props.slidesToScroll !== 0) {
                currentSlide = 0;
            } else {
                currentSlide = targetSlide - this.state.slideCount;
            }
        } else {
            currentSlide = targetSlide;
        }

        var targetLeft = (0, _trackHelper.getTrackLeft)((0, _extends3.default)({
            slideIndex: targetSlide,
            trackRef: this.track
        }, this.props, this.state));

        var currentLeft = (0, _trackHelper.getTrackLeft)((0, _extends3.default)({
            slideIndex: currentSlide,
            trackRef: this.track
        }, this.props, this.state));

        if (this.props.infinite === false) {
            targetLeft = currentLeft;
        }

        if (this.props.lazyLoad) {
            var loaded = true;
            var slidesToLoad = [];
            var slidesLen = this.state.slideCount;

            var sliderIndex = targetSlide < 0 ? slidesLen + targetSlide : currentSlide;

            for (var i = sliderIndex; i < sliderIndex + this.props.slidesToShow; i++) {
                var k = i;
                if (rtl) {
                    k = i >= slidesLen ? slidesLen * 2 - i - 1 : slidesLen - i - 1;
                }

                var pre = k - 1 < 0 ? slidesLen - 1 : k - 1;
                var next = k + 1 >= slidesLen ? 0 : k + 1;

                this.state.lazyLoadedList.indexOf(k) < 0 && slidesToLoad.push(k);
                this.state.lazyLoadedList.indexOf(pre) < 0 && slidesToLoad.push(pre);
                this.state.lazyLoadedList.indexOf(next) < 0 && slidesToLoad.push(next);
            }

            slidesToLoad.forEach(function (i) {
                if (_this2.state.lazyLoadedList.indexOf(i) < 0) {
                    loaded = false;
                }
            });

            if (!loaded) {
                this.setState({
                    lazyLoadedList: this.state.lazyLoadedList.concat(slidesToLoad)
                });
            }
        }

        this.props.onBeforeChange(this.state.currentSlide, currentSlide);

        // Slide Transition happens here.
        // animated transition happens to target Slide and
        // non - animated transition happens to current Slide
        // If CSS transitions are false, directly go the current slide.
        /* istanbul ignore if */
        if (this.props.useCSS === false) {
            this.setState({
                currentSlide: currentSlide,
                trackStyle: (0, _trackHelper.getTrackCSS)((0, _extends3.default)({
                    left: currentLeft
                }, this.props, this.state))
            }, function () {
                _this2.props.onChange(currentSlide);
            });
        } else {
            var nextStateChanges = {
                animating: false,
                currentSlide: currentSlide,
                trackStyle: (0, _trackHelper.getTrackCSS)((0, _extends3.default)({
                    left: currentLeft
                }, this.props, this.state)),
                swipeLeft: null
            };

            callback = function callback() {
                _this2.setState(nextStateChanges);
                _this2.props.onChange(currentSlide);
                delete _this2.animationEndCallback;
            };

            this.setState({
                animating: true,
                currentSlide: currentSlide,
                trackStyle: (0, _trackHelper.getTrackAnimateCSS)((0, _extends3.default)({
                    left: targetLeft
                }, this.props, this.state))
            }, function () {
                this.animationEndCallback = setTimeout(callback, this.props.speed + 20);
            });
        }

        this.autoPlay();
    },


    // ??????????????? arrow ????????????????????????
    arrowHoverHandler: function arrowHoverHandler(msg) {
        var offset = 30; // slide ??????????????????
        var targetLeft = (0, _trackHelper.getTrackLeft)((0, _extends3.default)({
            slideIndex: this.state.currentSlide,
            trackRef: this.track
        }, this.props, this.state));

        var left = void 0;
        /* istanbul ignore next */
        if (msg === 'next') {
            left = targetLeft - offset;
        } else if (msg === 'prev') {
            left = targetLeft + offset;
        } else {
            left = targetLeft;
        }

        this.setState({
            trackStyle: (0, _trackHelper.getTrackAnimateCSS)((0, _extends3.default)({
                left: left
            }, this.props, this.state))
        });
    },
    swipeDirection: function swipeDirection(touchObject) {
        /* istanbul ignore next */
        var swipeAngle = void 0;
        /* istanbul ignore next */
        var xDist = touchObject.startX - touchObject.curX;
        /* istanbul ignore next */
        var yDist = touchObject.startY - touchObject.curY;
        /* istanbul ignore next */
        var r = Math.atan2(yDist, xDist);
        /* istanbul ignore next */
        swipeAngle = Math.round(r * 180 / Math.PI);
        /* istanbul ignore next */
        if (swipeAngle < 0) {
            swipeAngle = 360 - Math.abs(swipeAngle);
        }
        /* istanbul ignore next */
        if (swipeAngle <= 45 && swipeAngle >= 0 || swipeAngle <= 360 && swipeAngle >= 315) {
            return this.props.rtl === false ? 'left' : 'right';
        }
        /* istanbul ignore next */
        if (swipeAngle >= 135 && swipeAngle <= 225) {
            return this.props.rtl === false ? 'right' : 'left';
        }
        /* istanbul ignore next */
        if (this.props.verticalSwiping === true) {
            if (swipeAngle >= 35 && swipeAngle <= 135) {
                return 'down';
            } else {
                return 'up';
            }
        }

        /* istanbul ignore next */
        return 'vertical';
    },
    play: function play() {
        var nextIndex = void 0;
        if (!this.hasMounted) {
            /* istanbul ignore next */
            return false;
        }
        if (this.props.rtl) {
            nextIndex = this.state.currentSlide - this.props.slidesToScroll;
        } else if (this.canGoNext((0, _extends3.default)({}, this.props, this.state))) {
            nextIndex = this.state.currentSlide + this.props.slidesToScroll;
        } else {
            return false;
        }
        this.slideHandler(nextIndex);
    },
    autoPlay: function autoPlay() {
        if (this.state.autoPlayTimer) {
            clearTimeout(this.state.autoPlayTimer);
        }
        if (this.props.autoplay) {
            this.setState({
                autoPlayTimer: setTimeout(this.play.bind(this), this.props.autoplaySpeed)
            });
        }
    },
    pause: function pause() {
        /* istanbul ignore next */
        if (this.state.autoPlayTimer) {
            clearTimeout(this.state.autoPlayTimer);
            this.setState({
                autoPlayTimer: null
            });
        }
    }
};

exports.default = helpers;
module.exports = exports['default'];
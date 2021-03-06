import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { polyfill } from 'react-lifecycles-compat';

import { obj } from '../../util';
import ConfigProvider from '../../config-provider';
import nextLocale from '../../locale/zh-cn';

/** Timeline */
var Timeline = (_temp = _class = function (_Component) {
    _inherits(Timeline, _Component);

    function Timeline(props, context) {
        _classCallCheck(this, Timeline);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

        _this.state = {
            fold: props.fold
        };
        return _this;
    }

    Timeline.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, prevState) {
        var innerUpdate = prevState.innerUpdate,
            fold = prevState.fold;


        if (innerUpdate) {
            return {
                fold: fold,
                innerUpdate: false
            };
        }

        if ('fold' in nextProps) {
            return {
                fold: nextProps.fold
            };
        }

        return null;
    };

    Timeline.prototype.toggleFold = function toggleFold(folderIndex, total) {
        var fold = this.state.fold.map(function (item) {
            return _extends({}, item);
        });

        if (folderIndex) {
            for (var i = 0; i < fold.length; i++) {
                var _fold$i = fold[i],
                    foldArea = _fold$i.foldArea,
                    foldShow = _fold$i.foldShow;


                if (foldArea[1] && folderIndex === foldArea[1] || !foldArea[1] && folderIndex === total - 1) {
                    fold[i].foldShow = !foldShow;
                }
            }

            this.setState({ fold: fold, innerUpdate: true });
        }
    };

    Timeline.prototype.render = function render() {
        var _this2 = this,
            _classNames;

        var _props = this.props,
            prefix = _props.prefix,
            rtl = _props.rtl,
            className = _props.className,
            children = _props.children,
            locale = _props.locale,
            animation = _props.animation,
            mode = _props.mode,
            others = _objectWithoutProperties(_props, ['prefix', 'rtl', 'className', 'children', 'locale', 'animation', 'mode']);

        var fold = this.state.fold;

        // ?????????????????????

        var childrenCount = React.Children.count(children);
        var isAlternateMode = mode === 'alternate';
        var getPositionCls = function getPositionCls(idx) {
            if (isAlternateMode) {
                return idx % 2 === 0 ? prefix + 'timeline-item-left' : prefix + 'timeline-item-right';
            }
            return prefix + 'timeline-item-left';
        };

        var cloneChildren = Children.map(children, function (child, i) {
            var folderIndex = null;
            var foldNodeShow = false;

            fold.forEach(function (item) {
                var foldArea = item.foldArea,
                    foldShow = item.foldShow;


                if (foldArea[0] && i >= foldArea[0] && (i <= foldArea[1] || !foldArea[1])) {
                    folderIndex = foldArea[1] || childrenCount - 1;
                    foldNodeShow = foldShow;
                }
            });

            return React.cloneElement(child, {
                prefix: prefix,
                locale: locale,
                total: childrenCount,
                className: getPositionCls(i),
                index: i,
                folderIndex: folderIndex,
                foldShow: foldNodeShow,
                toggleFold: folderIndex === i ? _this2.toggleFold.bind(_this2, folderIndex, childrenCount) : function () {},
                animation: animation
            });
        });

        var timelineCls = classNames((_classNames = {}, _classNames[prefix + 'timeline'] = true, _classNames[prefix + 'alternate'] = isAlternateMode, _classNames), className);

        if (rtl) {
            others.dir = 'rtl';
        }

        return React.createElement(
            'ul',
            _extends({}, obj.pickOthers(Timeline.propTypes, others), { className: timelineCls }),
            cloneChildren
        );
    };

    return Timeline;
}(Component), _class.propTypes = _extends({}, ConfigProvider.propTypes, {
    /**
     * ?????????????????????
     */
    prefix: PropTypes.string,
    rtl: PropTypes.bool,
    /**
     * ????????????????????? ??????`[{foldArea: [startIndex, endIndex], foldShow: boolean}]`
     */
    fold: PropTypes.array,
    /**
     * ???????????????
     */
    className: PropTypes.string,
    children: PropTypes.any,
    locale: PropTypes.object,
    animation: PropTypes.bool,
    /**
     * ???????????????
     * @enumdesc ???, ????????????
     * @version 1.23.18
     */
    mode: PropTypes.oneOf(['left', 'alternate'])
}), _class.defaultProps = {
    prefix: 'next-',
    rtl: false,
    fold: [],
    locale: nextLocale.Timeline,
    animation: true,
    mode: 'left'
}, _temp);
Timeline.displayName = 'Timeline';


export default ConfigProvider.config(polyfill(Timeline));
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Icon from '../../icon';
import Overlay from '../../overlay';
import { func, obj, dom } from '../../util';
import Item from './item';
import SelectableItem from './selectable-item';
import { getChildSelected } from './util';

var bindCtx = func.bindCtx;
var setStyle = dom.setStyle;

var Popup = Overlay.Popup;

/**
 * Menu.PopupItem
 * @order 2
 */
var PopupItem = (_temp = _class = function (_Component) {
    _inherits(PopupItem, _Component);

    function PopupItem(props) {
        _classCallCheck(this, PopupItem);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        bindCtx(_this, ['handleOpen', 'handlePopupOpen', 'handlePopupClose', 'getPopup']);
        return _this;
    }

    PopupItem.prototype.getPopup = function getPopup(ref) {
        this.popup = ref;
    };

    PopupItem.prototype.getOpen = function getOpen() {
        var _props = this.props,
            _key = _props._key,
            root = _props.root;
        var openKeys = root.state.openKeys;


        return openKeys.indexOf(_key) > -1;
    };

    PopupItem.prototype.getPopupProps = function getPopupProps() {
        var popupProps = this.props.root.props.popupProps;

        if (typeof popupProps === 'function') {
            popupProps = popupProps(this.props);
        }
        return popupProps;
    };

    PopupItem.prototype.handleOpen = function handleOpen(open, triggerType, e) {
        var _props2 = this.props,
            _key = _props2._key,
            root = _props2.root;

        root.handleOpen(_key, open, triggerType, e);

        var popupProps = this.popupProps;
        popupProps.onVisibleChange && popupProps.onVisibleChange(open, triggerType, e);
    };

    PopupItem.prototype.handlePopupOpen = function handlePopupOpen() {
        var _props3 = this.props,
            root = _props3.root,
            level = _props3.level,
            align = _props3.align,
            autoWidth = _props3.autoWidth;
        var _root$props = root.props,
            rootPopupAutoWidth = _root$props.popupAutoWidth,
            rootPopupAlign = _root$props.popupAlign,
            direction = _root$props.direction;

        var popupAlign = align || rootPopupAlign;
        var popupAutoWidth = 'autoWidth' in this.props ? autoWidth : rootPopupAutoWidth;
        try {
            // avoid errors while dom removed and js executing
            var itemNode = findDOMNode(this);
            var menuNode = itemNode.parentNode;
            this.popupNode = this.popup.getInstance().overlay.getInstance().getContentNode();
            root.popupNodes.push(this.popupNode);

            if (popupAutoWidth) {
                var targetNode = direction === 'hoz' && level === 1 ? itemNode : menuNode;

                if (targetNode.offsetWidth > this.popupNode.offsetWidth) {
                    setStyle(this.popupNode, 'width', targetNode.offsetWidth + 'px');
                }
            }
            if (popupAlign === 'outside' && !(direction === 'hoz' && level === 1)) {
                setStyle(this.popupNode, 'height', menuNode.offsetHeight + 'px');
                this.popupNode.firstElementChild && setStyle(this.popupNode.firstElementChild, 'overflow-y', 'auto');
            }
            // removeClass(this.popupNode, `${prefix}hide`);

            var popupProps = this.popupProps;
            popupProps.onOpen && popupProps.onOpen();
        } catch (error) {
            return null;
        }
    };

    PopupItem.prototype.handlePopupClose = function handlePopupClose() {
        var root = this.props.root;

        var popupNodes = root.popupNodes;
        var index = popupNodes.indexOf(this.popupNode);
        index > -1 && popupNodes.splice(index, 1);

        var popupProps = this.popupProps;
        popupProps.onClose && popupProps.onClose();
    };

    PopupItem.prototype.renderItem = function renderItem(selectable, children, others) {
        var _cx;

        var _props4 = this.props,
            _key = _props4._key,
            root = _props4.root,
            level = _props4.level,
            inlineLevel = _props4.inlineLevel,
            label = _props4.label,
            className = _props4.className;
        var _root$props2 = root.props,
            prefix = _root$props2.prefix,
            selectMode = _root$props2.selectMode;

        var NewItem = selectable ? SelectableItem : Item;
        var open = this.getOpen();

        var _root$state = root.state,
            selectedKeys = _root$state.selectedKeys,
            _k2n = _root$state._k2n;

        var isChildSelected = getChildSelected({
            _key: _key,
            _k2n: _k2n,
            selectMode: selectMode,
            selectedKeys: selectedKeys
        });

        var itemProps = {
            'aria-haspopup': true,
            'aria-expanded': open,
            _key: _key,
            root: root,
            level: level,
            inlineLevel: inlineLevel,
            type: 'submenu'
        };

        itemProps.className = cx((_cx = {}, _cx[prefix + 'opened'] = open, _cx[prefix + 'child-selected'] = isChildSelected, _cx[className] = !!className, _cx));

        return React.createElement(
            NewItem,
            _extends({}, itemProps, others),
            React.createElement(
                'span',
                { className: prefix + 'menu-item-text' },
                label
            ),
            children
        );
    };

    PopupItem.prototype.renderPopup = function renderPopup(trigger, triggerType, positionProps, children) {
        var _this2 = this;

        var _props5 = this.props,
            root = _props5.root,
            level = _props5.level,
            selectable = _props5.selectable,
            propCls = _props5.className;
        var direction = root.props.direction;

        this.popupProps = this.getPopupProps();
        var open = this.getOpen();

        if (direction === 'hoz' && level === 1 && selectable) {
            positionProps.target = function () {
                return findDOMNode(_this2);
            };
        }

        var posCls = positionProps.className,
            otherPostion = _objectWithoutProperties(positionProps, ['className']);

        var className = cx(propCls, posCls);

        return React.createElement(
            Popup,
            _extends({
                ref: this.getPopup
            }, otherPostion, this.popupProps, {
                canCloseByEsc: false,
                trigger: trigger,
                triggerType: triggerType,
                visible: open,
                pinFollowBaseElementWhenFixed: true,
                onVisibleChange: this.handleOpen,
                onOpen: this.handlePopupOpen,
                onClose: this.handlePopupClose
            }),
            React.createElement(
                'div',
                { className: className },
                children
            )
        );
    };

    PopupItem.prototype.render = function render() {
        var _this3 = this;

        var _props6 = this.props,
            root = _props6.root,
            level = _props6.level,
            hasSubMenu = _props6.hasSubMenu,
            selectableFromProps = _props6.selectable,
            children = _props6.children,
            triggerType = _props6.triggerType,
            align = _props6.align,
            noIcon = _props6.noIcon,
            rtl = _props6.rtl;

        var others = obj.pickOthers(Object.keys(PopupItem.propTypes), this.props);
        var _root$props3 = root.props,
            prefix = _root$props3.prefix,
            selectMode = _root$props3.selectMode,
            direction = _root$props3.direction,
            rootPopupAlign = _root$props3.popupAlign,
            rootTriggerType = _root$props3.triggerType;

        var popupAlign = align || rootPopupAlign;
        var newTriggerType = triggerType || (hasSubMenu ? rootTriggerType : 'hover');
        var newChildren = Array.isArray(children) ? children[0] : children;
        // let newChildren = Array.isArray(children) ? children[0] : children;
        // newChildren = cloneElement(newChildren, {
        //     className: cx({
        //         [`${prefix}menu-popup-content`]: true,
        //         [newChildren.props.className]: !!newChildren.props.className,
        //         [`${prefix}hide`]: popupAutoWidth || popupAlign === 'outside'
        //     })
        // });
        var selectable = selectMode && selectableFromProps;
        var triggerIsIcon = selectable && newTriggerType === 'click';
        var open = this.getOpen();

        var positionProps = {};
        var arrowProps = void 0;

        if (direction === 'hoz' && level === 1) {
            var _cx2;

            positionProps.align = 'tl bl';
            positionProps.className = prefix + 'menu-spacing-tb';

            arrowProps = {
                type: 'arrow-down',
                className: cx((_cx2 = {}, _cx2[prefix + 'menu-hoz-icon-arrow'] = true, _cx2[prefix + 'open'] = open, _cx2))
            };
        } else {
            if (popupAlign === 'outside') {
                positionProps.target = function () {
                    return findDOMNode(root);
                };
                positionProps.align = 'tl tr';

                positionProps.className = prefix + 'menu-spacing-lr ' + prefix + 'menu-outside';
            } else {
                if (triggerIsIcon) {
                    positionProps.target = function () {
                        return findDOMNode(_this3);
                    };
                }
                positionProps.align = 'tl tr';
                positionProps.className = prefix + 'menu-spacing-lr';
            }

            arrowProps = {
                type: 'arrow-right',
                className: prefix + 'menu-icon-arrow ' + prefix + 'menu-symbol-popupfold'
            };
        }

        var arrow = React.createElement(Icon, arrowProps);
        var trigger = triggerIsIcon ? arrow : this.renderItem(selectable, noIcon ? null : arrow, others);
        var popup = this.renderPopup(trigger, newTriggerType, positionProps, newChildren);
        return triggerIsIcon ? this.renderItem(selectable, popup, others) : popup;
    };

    return PopupItem;
}(Component), _class.menuChildType = 'submenu', _class.propTypes = {
    _key: PropTypes.string,
    root: PropTypes.object,
    level: PropTypes.number,
    hasSubMenu: PropTypes.bool,
    noIcon: PropTypes.bool,
    rtl: PropTypes.bool,
    selectable: PropTypes.bool,
    /**
     * ????????????
     */
    label: PropTypes.node,
    /**
     * ?????????????????????
     */
    children: PropTypes.node,
    className: PropTypes.string,
    /**
     * ??????????????????????????????
     */
    triggerType: PropTypes.oneOf(['click', 'hover']),
    align: PropTypes.oneOf(['outside', 'follow']),
    autoWidth: PropTypes.bool
}, _class.defaultProps = {
    selectable: false,
    noIcon: false
}, _temp);
PopupItem.displayName = 'PopupItem';
export { PopupItem as default };
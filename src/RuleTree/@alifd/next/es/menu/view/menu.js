import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import _typeof from 'babel-runtime/helpers/typeof';

var _class, _temp;

import React, { Component, Children, cloneElement } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { polyfill } from 'react-lifecycles-compat';
import SubMenu from './sub-menu';
import ConfigProvider from '../../config-provider';
import { func, obj, dom, events, KEYCODE } from '../../util';
import { getWidth, normalizeToArray, isSibling, isAncestor, isAvailablePos, getFirstAvaliablelChildKey } from './util';

var bindCtx = func.bindCtx;
var pickOthers = obj.pickOthers,
    isNil = obj.isNil;

var noop = function noop() {};
var MENUITEM_OVERFLOWED_CLASSNAME = 'menuitem-overflowed';

var getIndicatorsItem = function getIndicatorsItem(items, isPlaceholder) {
    var _cx;

    var prefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var renderMore = arguments[3];

    var moreCls = cx((_cx = {}, _cx[prefix + 'menu-more'] = true, _cx));

    var style = {};
    // keep placehold to get width
    if (isPlaceholder) {
        style.visibility = 'hidden';
        style.display = 'inline-block';
        // indicators which not in use, just display: none
    } else if (items && items.length === 0) {
        style.display = 'none';
        style.visibility = 'unset';
    }

    if (renderMore && typeof renderMore === 'function') {
        var moreNode = renderMore(items);
        var renderMoreCls = cx(moreCls, moreNode.props && moreNode.props.className);

        return React.isValidElement(moreNode) ? React.cloneElement(moreNode, {
            style: style,
            className: renderMoreCls
        }) : moreNode;
    }

    return React.createElement(
        SubMenu,
        { label: '\xB7\xB7\xB7', noIcon: true, className: moreCls, style: style },
        items
    );
};

var addIndicators = function addIndicators(_ref) {
    var children = _ref.children,
        lastVisibleIndex = _ref.lastVisibleIndex,
        prefix = _ref.prefix,
        renderMore = _ref.renderMore;

    var arr = [];

    children.forEach(function (child, index) {
        if (!child) {
            return;
        }
        var overflowedItems = [];

        if (index > lastVisibleIndex) {
            child = React.cloneElement(child, {
                key: 'more-' + index,
                style: { display: 'none' },
                className: (child && child.className || '') + ' ' + MENUITEM_OVERFLOWED_CLASSNAME
            });
        }

        if (index === lastVisibleIndex + 1) {
            overflowedItems = children.slice(lastVisibleIndex + 1).map(function (c, i) {
                return React.cloneElement(c, {
                    key: 'more-' + index + '-' + i
                });
            });
            arr.push(getIndicatorsItem(overflowedItems, false, prefix, renderMore));
        }

        arr.push(child);
    });

    arr.push(getIndicatorsItem([], true, prefix, renderMore));

    return arr;
};

var getNewChildren = function getNewChildren(_ref2) {
    var children = _ref2.children,
        root = _ref2.root,
        mode = _ref2.mode,
        lastVisibleIndex = _ref2.lastVisibleIndex,
        hozInLine = _ref2.hozInLine,
        prefix = _ref2.prefix,
        renderMore = _ref2.renderMore;

    var k2n = {};
    var p2n = {};

    var arr = hozInLine ? addIndicators({
        children: children,
        lastVisibleIndex: lastVisibleIndex,
        prefix: prefix,
        renderMore: renderMore
    }) : children;

    var loop = function loop(children, posPrefix) {
        var indexWrapper = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { index: 0 };
        var inlineLevel = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

        var keyArray = [];
        return Children.map(children, function (child) {
            if (child && (typeof child.type === 'function' ||
            // `React.forwardRef(render)` returns a forwarding
            // object that includes `render` method, and the specific
            // `child.type` will be an object instead of a class or
            // function.
            _typeof(child.type) === 'object') && 'menuChildType' in child.type) {
                var newChild = void 0;

                var pos = void 0;
                var props = { root: root };

                if (['item', 'submenu', 'group'].indexOf(child.type.menuChildType) > -1) {
                    pos = posPrefix + '-' + indexWrapper.index++;
                    var key = typeof child.key === 'string' ? child.key : pos;

                    // filter out duplicate keys
                    if (keyArray.indexOf(key) > -1) {
                        return;
                    }

                    keyArray.push(key);

                    var level = pos.split('-').length - 1;
                    k2n[key] = p2n[pos] = {
                        key: key,
                        pos: pos,
                        mode: child.props.mode,
                        type: child.type.menuChildType,
                        disabled: child.props.disabled,
                        label: child.props.label || child.props.children
                    };

                    props.level = level;
                    props.inlineLevel = inlineLevel;
                    props._key = key;
                    props.groupIndent = child.type.menuChildType === 'group' ? 1 : 0;
                }

                // paddingLeft(or paddingRight in rtl) only make sense in inline mode
                // parent know children's inlineLevel
                // if parent's mode is popup, then children's inlineLevel must be 1;
                // else inlineLevel should add 1
                var childLevel = (child.props.mode || mode) === 'popup' ? 1 : inlineLevel + 1;

                switch (child.type.menuChildType) {
                    case 'submenu':
                        newChild = cloneElement(child, props, loop(child.props.children, pos, undefined, childLevel));
                        break;
                    case 'group':
                        newChild = cloneElement(child, props, loop(child.props.children, posPrefix, indexWrapper, props.level));
                        break;
                    case 'item':
                    case 'divider':
                        newChild = cloneElement(child, props);
                        break;
                    default:
                        newChild = child;
                        break;
                }

                return newChild;
            }

            return child;
        });
    };

    var newChildren = loop(arr, '0');

    return {
        newChildren: newChildren,
        _k2n: k2n,
        _p2n: p2n
    };
};

/**
 * Menu
 */
var Menu = (_temp = _class = function (_Component) {
    _inherits(Menu, _Component);

    function Menu(props) {
        _classCallCheck(this, Menu);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        _this.getUpdateChildren = function () {
            var _this$state = _this.state,
                root = _this$state.root,
                lastVisibleIndex = _this$state.lastVisibleIndex;


            return getNewChildren(_extends({
                root: root,
                lastVisibleIndex: lastVisibleIndex
            }, _this.props));
        };

        _this.menuContentRef = function (ref) {
            _this.menuContent = ref;
        };

        _this.menuHeaderRef = function (ref) {
            _this.menuHeader = ref;
        };

        _this.menuFooterRef = function (ref) {
            _this.menuFooter = ref;
        };

        var _this$props = _this.props,
            prefix = _this$props.prefix,
            children = _this$props.children,
            selectedKeys = _this$props.selectedKeys,
            defaultSelectedKeys = _this$props.defaultSelectedKeys,
            focusedKey = _this$props.focusedKey,
            focusable = _this$props.focusable,
            autoFocus = _this$props.autoFocus,
            hozInLine = _this$props.hozInLine,
            renderMore = _this$props.renderMore;


        _this.state = {
            lastVisibleIndex: undefined
        };

        var _getNewChildren = getNewChildren(_extends({
            root: _this
        }, _this.props)),
            newChildren = _getNewChildren.newChildren,
            _k2n = _getNewChildren._k2n,
            _p2n = _getNewChildren._p2n;

        var tabbableKey = focusable ? getFirstAvaliablelChildKey('0', _p2n) : undefined;

        _this.state = {
            root: _this,
            lastVisibleIndex: undefined,
            newChildren: newChildren,
            _k2n: _k2n,
            _p2n: _p2n,
            tabbableKey: tabbableKey,
            openKeys: _this.getInitOpenKeys(props, _k2n, _p2n),
            selectedKeys: normalizeToArray(selectedKeys || defaultSelectedKeys),
            focusedKey: !isNil(_this.props.focusedKey) ? focusedKey : focusable && autoFocus ? tabbableKey : null
        };

        bindCtx(_this, ['handleOpen', 'handleSelect', 'handleItemClick', 'handleItemKeyDown', 'onBlur', 'adjustChildrenWidth']);

        _this.popupNodes = [];
        return _this;
    }

    Menu.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, prevState) {
        var state = {};

        if ('openKeys' in nextProps) {
            state.openKeys = normalizeToArray(nextProps.openKeys);
            // 从展开状态变为收起状态，才需要清空openKeys
        } else if ('mode' in nextProps && nextProps.mode === 'popup' && prevState.lastMode === 'inline') {
            state.openKeys = [];
        }

        if ('selectedKeys' in nextProps) {
            state.selectedKeys = normalizeToArray(nextProps.selectedKeys);
        }
        if ('focusedKey' in nextProps) {
            state.focusedKey = nextProps.focusedKey;
        }

        state.lastMode = nextProps.mode;

        var _getNewChildren2 = getNewChildren(_extends({
            root: prevState.root,
            lastVisibleIndex: prevState.lastVisibleIndex
        }, nextProps)),
            newChildren = _getNewChildren2.newChildren,
            _k2n = _getNewChildren2._k2n,
            _p2n = _getNewChildren2._p2n;

        state.newChildren = newChildren;
        state._k2n = _k2n;
        state._p2n = _p2n;

        if (nextProps.focusable) {
            if (prevState.tabbableKey in _k2n) {
                if (prevState.focusedKey) {
                    state.tabbableKey = prevState.focusedKey;
                }
            } else {
                state.tabbableKey = getFirstAvaliablelChildKey('0', _p2n);
            }
        }

        return state;
    };

    Menu.prototype.componentDidMount = function componentDidMount() {
        this.menuNode = findDOMNode(this);

        this.adjustChildrenWidth();

        if (this.props.hozInLine) {
            events.on(window, 'resize', this.adjustChildrenWidth);
        }
    };

    Menu.prototype.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
        if (prevState.lastVisibleIndex !== this.state.lastVisibleIndex) {
            this.adjustChildrenWidth();
        }
    };

    Menu.prototype.componentWillUnmount = function componentWillUnmount() {
        events.off(window, 'resize', this.adjustChildrenWidth);
    };

    Menu.prototype.adjustChildrenWidth = function adjustChildrenWidth() {
        var _props = this.props,
            direction = _props.direction,
            prefix = _props.prefix,
            header = _props.header,
            footer = _props.footer,
            hozInLine = _props.hozInLine;

        if (direction !== 'hoz' || !hozInLine) {
            return;
        }

        if (!this.menuNode && !this.menuContent) {
            return;
        }

        var children = [],
            spaceWidth = void 0;

        if (header || footer) {
            children = this.menuContent.children;
            spaceWidth = getWidth(this.menuNode) - getWidth(this.menuHeader) - getWidth(this.menuFooter);
        } else {
            children = this.menuNode.children;
            spaceWidth = getWidth(this.menuNode);
        }

        if (children.length < 2) {
            return;
        }

        var currentSumWidth = 0,
            lastVisibleIndex = -1;

        var moreNode = '';

        var menuItemNodes = [].slice.call(children).filter(function (node) {
            if (node.className.split(' ').indexOf(prefix + 'menu-more') < 0) {
                return true;
            } else {
                moreNode = node;
            }
            return false;
        });

        var overflowedItems = menuItemNodes.filter(function (c) {
            return c.className.split(' ').indexOf(MENUITEM_OVERFLOWED_CLASSNAME) >= 0;
        });

        overflowedItems.forEach(function (c) {
            dom.setStyle(c, 'display', 'inline-block');
        });

        dom.setStyle(moreNode, 'display', 'inline-block');
        var moreWidth = getWidth(moreNode);

        this.menuItemSizes = menuItemNodes.map(function (c) {
            return getWidth(c);
        });
        var totalLen = this.menuItemSizes.length;

        overflowedItems.forEach(function (c) {
            dom.setStyle(c, 'display', 'none');
        });

        this.menuItemSizes.forEach(function (liWidth, i) {
            currentSumWidth += liWidth;
            if (i >= totalLen - 1 && currentSumWidth <= spaceWidth || currentSumWidth + moreWidth <= spaceWidth) {
                lastVisibleIndex++;
            }
        });

        if (lastVisibleIndex >= totalLen - 1) {
            dom.setStyle(moreNode, 'display', 'none');
        }

        this.setState(_extends({
            lastVisibleIndex: lastVisibleIndex
        }, this.getUpdateChildren()));
    };

    Menu.prototype.onBlur = function onBlur(e) {
        this.setState({
            focusedKey: undefined
        });

        this.props.onBlur && this.props.onBlur(e);
    };

    Menu.prototype.getInitOpenKeys = function getInitOpenKeys(props, _k2n, _p2n) {
        var initOpenKeys = void 0;

        var openKeys = props.openKeys,
            defaultOpenKeys = props.defaultOpenKeys,
            defaultOpenAll = props.defaultOpenAll,
            mode = props.mode,
            openMode = props.openMode;

        if (openKeys) {
            initOpenKeys = openKeys;
        } else if (defaultOpenAll && mode === 'inline' && openMode === 'multiple') {
            initOpenKeys = Object.keys(_k2n).filter(function (key) {
                return _k2n[key].type === 'submenu';
            });
        } else {
            initOpenKeys = defaultOpenKeys;
        }

        return normalizeToArray(initOpenKeys);
    };

    Menu.prototype.handleOpen = function handleOpen(key, open, triggerType, e) {
        var newOpenKeys = void 0;

        var _props2 = this.props,
            mode = _props2.mode,
            openMode = _props2.openMode;
        var _state = this.state,
            openKeys = _state.openKeys,
            _k2n = _state._k2n;

        var index = openKeys.indexOf(key);
        if (open && index === -1) {
            if (mode === 'inline') {
                if (openMode === 'single') {
                    newOpenKeys = openKeys.filter(function (k) {
                        return _k2n[k] && !isSibling(_k2n[key].pos, _k2n[k].pos);
                    });
                    newOpenKeys.push(key);
                } else {
                    newOpenKeys = openKeys.concat(key);
                }
            } else {
                newOpenKeys = openKeys.filter(function (k) {
                    return _k2n[k] && isAncestor(_k2n[key].pos, _k2n[k].pos);
                });
                newOpenKeys.push(key);
            }
        } else if (!open && index > -1) {
            if (mode === 'inline') {
                newOpenKeys = [].concat(openKeys.slice(0, index), openKeys.slice(index + 1));
            } else if (triggerType === 'docClick') {
                if (!this.popupNodes.concat(this.menuNode).some(function (node) {
                    return node.contains(e.target);
                })) {
                    newOpenKeys = [];
                }
            } else {
                newOpenKeys = openKeys.filter(function (k) {
                    return k !== key && _k2n[k] && !isAncestor(_k2n[k].pos, _k2n[key].pos);
                });
            }
        }

        if (newOpenKeys) {
            if (isNil(this.props.openKeys)) {
                this.setState(_extends({
                    openKeys: newOpenKeys
                }, this.getUpdateChildren()));
            }

            this.props.onOpen(newOpenKeys, {
                key: key,
                open: open
            });
        }
    };

    Menu.prototype.getPath = function getPath(key, _k2n, _p2n) {
        var keyPath = [];
        var labelPath = [];

        var pos = _k2n[key].pos;
        var nums = pos.split('-');
        for (var i = 1; i < nums.length - 1; i++) {
            var parentNums = nums.slice(0, i + 1);
            var parentPos = parentNums.join('-');
            var parent = _p2n[parentPos];
            keyPath.push(parent.key);
            labelPath.push(parent.label);
        }

        return {
            keyPath: keyPath,
            labelPath: labelPath
        };
    };

    Menu.prototype.handleSelect = function handleSelect(key, select, menuItem) {
        var _state2 = this.state,
            _k2n = _state2._k2n,
            _p2n = _state2._p2n;

        var pos = _k2n[key].pos;
        var level = pos.split('-').length - 1;
        if (this.props.shallowSelect && level > 1) {
            return;
        }

        var newSelectedKeys = void 0;

        var selectMode = this.props.selectMode;
        var selectedKeys = this.state.selectedKeys;

        var index = selectedKeys.indexOf(key);
        if (select && index === -1) {
            if (selectMode === 'single') {
                newSelectedKeys = [key];
            } else if (selectMode === 'multiple') {
                newSelectedKeys = selectedKeys.concat(key);
            }
        } else if (!select && index > -1 && selectMode === 'multiple') {
            newSelectedKeys = [].concat(selectedKeys.slice(0, index), selectedKeys.slice(index + 1));
        }

        if (newSelectedKeys) {
            if (isNil(this.props.selectedKeys)) {
                this.setState({
                    selectedKeys: newSelectedKeys
                });
            }

            this.props.onSelect(newSelectedKeys, menuItem, _extends({
                key: key,
                select: select,
                label: _k2n[key].label
            }, this.getPath(key, _k2n, _p2n)));
        }
    };

    Menu.prototype.handleItemClick = function handleItemClick(key, item, e) {
        var _k2n = this.state._k2n;

        if (this.props.focusable) {
            if (isNil(this.props.focusedKey)) {
                this.setState({
                    focusedKey: key
                });
            }

            this.props.onItemFocus(key, item, e);
        }

        if (item.props.type === 'item') {
            if (item.props.parentMode === 'popup' && this.state.openKeys.length) {
                if (isNil(this.props.openKeys)) {
                    this.setState({
                        openKeys: []
                    });
                }

                this.props.onOpen([], {
                    key: this.state.openKeys.sort(function (prevKey, nextKey) {
                        return _k2n[nextKey].pos.split('-').length - _k2n[prevKey].pos.split('-').length;
                    })[0],
                    open: false
                });
            }

            this.props.onItemClick(key, item, e);
        }
    };

    Menu.prototype.getAvailableKey = function getAvailableKey(pos, prev) {
        var _p2n = this.state._p2n;

        var ps = Object.keys(_p2n).filter(function (p) {
            return isAvailablePos(pos, p, _p2n);
        });
        if (ps.length > 1) {
            var index = ps.indexOf(pos);
            var targetIndex = void 0;
            if (prev) {
                targetIndex = index === 0 ? ps.length - 1 : index - 1;
            } else {
                targetIndex = index === ps.length - 1 ? 0 : index + 1;
            }

            return _p2n[ps[targetIndex]].key;
        }

        return null;
    };

    Menu.prototype.getParentKey = function getParentKey(pos) {
        return this.state._p2n[pos.slice(0, pos.length - 2)].key;
    };

    Menu.prototype.handleItemKeyDown = function handleItemKeyDown(key, type, item, e) {
        if ([KEYCODE.UP, KEYCODE.DOWN, KEYCODE.RIGHT, KEYCODE.LEFT, KEYCODE.ENTER, KEYCODE.ESC, KEYCODE.SPACE].indexOf(e.keyCode) > -1) {
            e.preventDefault();
            e.stopPropagation();
        }

        var focusedKey = this.state.focusedKey;
        var _state3 = this.state,
            _p2n = _state3._p2n,
            _k2n = _state3._k2n;
        var direction = this.props.direction;

        var pos = _k2n[key].pos;
        var level = pos.split('-').length - 1;
        switch (e.keyCode) {
            case KEYCODE.UP:
                {
                    var avaliableKey = this.getAvailableKey(pos, true);
                    if (avaliableKey) {
                        focusedKey = avaliableKey;
                    }
                    break;
                }
            case KEYCODE.DOWN:
                {
                    var _avaliableKey = void 0;
                    if (direction === 'hoz' && level === 1 && type === 'submenu') {
                        this.handleOpen(key, true);
                        _avaliableKey = getFirstAvaliablelChildKey(pos, _p2n);
                    } else {
                        _avaliableKey = this.getAvailableKey(pos, false);
                    }
                    if (_avaliableKey) {
                        focusedKey = _avaliableKey;
                    }
                    break;
                }
            case KEYCODE.RIGHT:
                {
                    var _avaliableKey2 = void 0;
                    if (direction === 'hoz' && level === 1) {
                        _avaliableKey2 = this.getAvailableKey(pos, false);
                    } else if (type === 'submenu') {
                        this.handleOpen(key, true);
                        _avaliableKey2 = getFirstAvaliablelChildKey(pos, _p2n);
                    }
                    if (_avaliableKey2) {
                        focusedKey = _avaliableKey2;
                    }
                    break;
                }
            case KEYCODE.ENTER:
                {
                    if (type === 'submenu') {
                        this.handleOpen(key, true);
                        var _avaliableKey3 = getFirstAvaliablelChildKey(pos, _p2n);
                        if (_avaliableKey3) {
                            focusedKey = _avaliableKey3;
                        }
                    }
                    break;
                }
            case KEYCODE.LEFT:
                {
                    if (direction === 'hoz' && level === 1) {
                        var _avaliableKey4 = this.getAvailableKey(pos, true);
                        if (_avaliableKey4) {
                            focusedKey = _avaliableKey4;
                        }
                    } else if (level > 1) {
                        var parentKey = this.getParentKey(pos);
                        this.handleOpen(parentKey, false);
                        focusedKey = parentKey;
                    }
                    break;
                }
            case KEYCODE.ESC:
                if (level > 1) {
                    var _parentKey = this.getParentKey(pos);
                    this.handleOpen(_parentKey, false);
                    focusedKey = _parentKey;
                }
                break;

            case KEYCODE.TAB:
                focusedKey = null;
                break;
            default:
                break;
        }

        if (focusedKey !== this.state.focusedKey) {
            if (isNil(this.props.focusedKey)) {
                this.setState({
                    focusedKey: focusedKey
                });
            }

            this.props.onItemKeyDown(focusedKey, item, e);
            this.props.onItemFocus(focusedKey, e);
        }
    };

    Menu.prototype.render = function render() {
        var _cx2;

        var _props3 = this.props,
            prefix = _props3.prefix,
            className = _props3.className,
            direction = _props3.direction,
            hozAlign = _props3.hozAlign,
            header = _props3.header,
            footer = _props3.footer,
            embeddable = _props3.embeddable,
            selectMode = _props3.selectMode,
            hozInLine = _props3.hozInLine,
            rtl = _props3.rtl,
            flatenContent = _props3.flatenContent;
        var newChildren = this.state.newChildren;

        var others = pickOthers(Object.keys(Menu.propTypes), this.props);

        var newClassName = cx((_cx2 = {}, _cx2[prefix + 'menu'] = true, _cx2[prefix + 'ver'] = direction === 'ver', _cx2[prefix + 'hoz'] = direction === 'hoz', _cx2[prefix + 'menu-embeddable'] = embeddable, _cx2[prefix + 'menu-nowrap'] = hozInLine, _cx2[prefix + 'menu-selectable-' + selectMode] = selectMode, _cx2[className] = !!className, _cx2));

        var role = direction === 'hoz' ? 'menubar' : 'menu';
        var ariaMultiselectable = void 0;
        if ('selectMode' in this.props) {
            role = 'listbox';
            ariaMultiselectable = !!(selectMode === 'multiple');
        }

        var headerElement = header ? React.createElement(
            'li',
            { className: prefix + 'menu-header', ref: this.menuHeaderRef },
            header
        ) : null;
        var itemsElement = !flatenContent && (header || footer) ? React.createElement(
            'ul',
            { className: prefix + 'menu-content', ref: this.menuContentRef },
            newChildren
        ) : newChildren;
        var footerElement = footer ? React.createElement(
            'li',
            { className: prefix + 'menu-footer', ref: this.menuFooterRef },
            footer
        ) : null;
        var shouldWrapItemsAndFooter = hozAlign === 'right' && !!header;

        if (rtl) {
            others.dir = 'rtl';
        }

        return React.createElement(
            'ul',
            _extends({
                role: role,
                onBlur: this.onBlur,
                className: newClassName,
                onKeyDown: this.handleEnter,
                'aria-multiselectable': ariaMultiselectable
            }, others),
            headerElement,
            shouldWrapItemsAndFooter ? React.createElement(
                'div',
                { className: prefix + 'menu-hoz-right' },
                itemsElement,
                footerElement
            ) : null,
            !shouldWrapItemsAndFooter ? itemsElement : null,
            !shouldWrapItemsAndFooter ? footerElement : null
        );
    };

    return Menu;
}(Component), _class.isNextMenu = true, _class.propTypes = _extends({}, ConfigProvider.propTypes, {
    prefix: PropTypes.string,
    pure: PropTypes.bool,
    rtl: PropTypes.bool,
    className: PropTypes.string,
    /**
     * 菜单项和子菜单
     */
    children: PropTypes.node,
    /**
     * 点击菜单项触发的回调函数
     * @param {String} key 点击的菜单项的 key 值
     * @param {Object} item 点击的菜单项对象
     * @param {Object} event 点击的事件对象
     */
    onItemClick: PropTypes.func,
    /**
     * 当前打开的子菜单的 key 值
     */
    openKeys: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    /**
     * 初始打开的子菜单的 key 值
     */
    defaultOpenKeys: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    /**
     * 初始展开所有的子菜单，只在 mode 设置为 'inline' 以及 openMode 设置为 'multiple' 下生效，优先级高于 defaultOpenKeys
     */
    defaultOpenAll: PropTypes.bool,
    /**
     * 打开或关闭子菜单触发的回调函数
     * @param {Array} key 打开的所有子菜单的 key 值
     * @param {Object} extra 额外参数
     * @param {String} extra.key 当前操作子菜单的 key 值
     * @param {Boolean} extra.open 是否是打开
     */
    onOpen: PropTypes.func,
    /**
     * 子菜单打开的模式
     */
    mode: PropTypes.oneOf(['inline', 'popup']),
    /**
     * 子菜单打开的触发行为
     */
    triggerType: PropTypes.oneOf(['click', 'hover']),
    /**
     * 展开内连子菜单的模式，同时可以展开一个子菜单还是多个子菜单，该属性仅在 mode 为 inline 时生效
     */
    openMode: PropTypes.oneOf(['single', 'multiple']),
    /**
     * 内连子菜单缩进距离
     */
    inlineIndent: PropTypes.number,
    inlineArrowDirection: PropTypes.oneOf(['down', 'right']),
    /**
     * 是否自动让弹层的宽度和菜单项保持一致，如果弹层的宽度比菜单项小则和菜单项保持一致，如果宽度大于菜单项则不做处理
     */
    popupAutoWidth: PropTypes.bool,
    /**
     * 弹层的对齐方式
     */
    popupAlign: PropTypes.oneOf(['follow', 'outside']),
    /**
     * 弹层自定义 props
     */
    popupProps: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    /**
     * 弹出子菜单自定义 className
     */
    popupClassName: PropTypes.string,
    /**
     * 弹出子菜单自定义 style
     */
    popupStyle: PropTypes.object,
    /**
     * 当前选中菜单项的 key 值
     */
    selectedKeys: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    /**
     * 初始选中菜单项的 key 值
     */
    defaultSelectedKeys: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    /**
     * 选中或取消选中菜单项触发的回调函数
     * @param {Array} selectedKeys 选中的所有菜单项的值
     * @param {Object} item 选中或取消选中的菜单项
     * @param {Object} extra 额外参数
     * @param {Boolean} extra.select 是否是选中
     * @param {Array} extra.key 菜单项的 key
     * @param {Object} extra.label 菜单项的文本
     * @param {Array} extra.keyPath 菜单项 key 的路径
     */
    onSelect: PropTypes.func,
    /**
     * 选中模式，单选还是多选，默认无值，不可选
     */
    selectMode: PropTypes.oneOf(['single', 'multiple']),
    /**
     * 是否只能选择第一层菜单项（不能选择子菜单中的菜单项）
     */
    shallowSelect: PropTypes.bool,
    /**
     * 是否显示选中图标，如果设置为 false 需配合配置平台设置选中时的背景色以示区分
     */
    hasSelectedIcon: PropTypes.bool,
    labelToggleChecked: PropTypes.bool,
    /**
     * 是否将选中图标居右，仅当 hasSelectedIcon 为true 时生效。
     * 注意：SubMenu 上的选中图标一直居左，不受此API控制
     */
    isSelectIconRight: PropTypes.bool,
    /**
     * 菜单第一层展示方向
     */
    direction: PropTypes.oneOf(['ver', 'hoz']),
    /**
     * 横向菜单条 item 和 footer 的对齐方向，在 direction 设置为 'hoz' 并且 header 存在时生效
     */
    hozAlign: PropTypes.oneOf(['left', 'right']),
    /**
     * 横向菜单模式下，是否维持在一行，即超出一行折叠成 SubMenu 显示， 仅在 direction='hoz' mode='popup' 时生效
     */
    hozInLine: PropTypes.bool,
    renderMore: PropTypes.func,
    /**
     * 自定义菜单头部
     */
    header: PropTypes.node,
    /**
     * 自定义菜单尾部
     */
    footer: PropTypes.node,
    /**
     * 是否自动获得焦点
     */
    autoFocus: PropTypes.bool,
    /**
     * 当前获得焦点的子菜单或菜单项 key 值
     */
    focusedKey: PropTypes.string,
    focusable: PropTypes.bool,
    onItemFocus: PropTypes.func,
    onBlur: PropTypes.func,
    /**
     * 是否开启嵌入式模式，一般用于Layout的布局中，开启后没有默认背景、外层border、box-shadow，可以配合`<Menu style={{lineHeight: '100px'}}>` 自定义高度
     * @version 1.18
     */
    embeddable: PropTypes.bool,
    onItemKeyDown: PropTypes.func,
    expandAnimation: PropTypes.bool,
    itemClassName: PropTypes.string,
    /**
     * 可配置的icons，包括 select 等
     */
    icons: PropTypes.object,
    // content 是否为单层模式，目前主要在有 header 或 footer 的时候有意义
    flatenContent: PropTypes.bool
}), _class.defaultProps = {
    prefix: 'next-',
    pure: false,
    defaultOpenKeys: [],
    defaultOpenAll: false,
    onOpen: noop,
    mode: 'inline',
    triggerType: 'click',
    openMode: 'multiple',
    inlineIndent: 20,
    inlineArrowDirection: 'down',
    popupAutoWidth: false,
    popupAlign: 'follow',
    popupProps: {},
    defaultSelectedKeys: [],
    onSelect: noop,
    shallowSelect: false,
    hasSelectedIcon: true,
    isSelectIconRight: false,
    labelToggleChecked: true,
    direction: 'ver',
    hozAlign: 'left',
    hozInLine: false,
    autoFocus: false,
    focusable: true,
    embeddable: false,
    onItemFocus: noop,
    onItemKeyDown: noop,
    onItemClick: noop,
    expandAnimation: true,
    icons: {}
}, _temp);
Menu.displayName = 'Menu';


export default polyfill(Menu);
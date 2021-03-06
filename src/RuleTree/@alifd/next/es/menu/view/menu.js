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
            // ???????????????????????????????????????????????????openKeys
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
     * ?????????????????????
     */
    children: PropTypes.node,
    /**
     * ????????????????????????????????????
     * @param {String} key ????????????????????? key ???
     * @param {Object} item ????????????????????????
     * @param {Object} event ?????????????????????
     */
    onItemClick: PropTypes.func,
    /**
     * ??????????????????????????? key ???
     */
    openKeys: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    /**
     * ??????????????????????????? key ???
     */
    defaultOpenKeys: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    /**
     * ??????????????????????????????????????? mode ????????? 'inline' ?????? openMode ????????? 'multiple' ??????????????????????????? defaultOpenKeys
     */
    defaultOpenAll: PropTypes.bool,
    /**
     * ?????????????????????????????????????????????
     * @param {Array} key ??????????????????????????? key ???
     * @param {Object} extra ????????????
     * @param {String} extra.key ???????????????????????? key ???
     * @param {Boolean} extra.open ???????????????
     */
    onOpen: PropTypes.func,
    /**
     * ????????????????????????
     */
    mode: PropTypes.oneOf(['inline', 'popup']),
    /**
     * ??????????????????????????????
     */
    triggerType: PropTypes.oneOf(['click', 'hover']),
    /**
     * ????????????????????????????????????????????????????????????????????????????????????????????????????????? mode ??? inline ?????????
     */
    openMode: PropTypes.oneOf(['single', 'multiple']),
    /**
     * ???????????????????????????
     */
    inlineIndent: PropTypes.number,
    inlineArrowDirection: PropTypes.oneOf(['down', 'right']),
    /**
     * ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
     */
    popupAutoWidth: PropTypes.bool,
    /**
     * ?????????????????????
     */
    popupAlign: PropTypes.oneOf(['follow', 'outside']),
    /**
     * ??????????????? props
     */
    popupProps: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    /**
     * ???????????????????????? className
     */
    popupClassName: PropTypes.string,
    /**
     * ???????????????????????? style
     */
    popupStyle: PropTypes.object,
    /**
     * ???????????????????????? key ???
     */
    selectedKeys: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    /**
     * ???????????????????????? key ???
     */
    defaultSelectedKeys: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    /**
     * ???????????????????????????????????????????????????
     * @param {Array} selectedKeys ??????????????????????????????
     * @param {Object} item ?????????????????????????????????
     * @param {Object} extra ????????????
     * @param {Boolean} extra.select ???????????????
     * @param {Array} extra.key ???????????? key
     * @param {Object} extra.label ??????????????????
     * @param {Array} extra.keyPath ????????? key ?????????
     */
    onSelect: PropTypes.func,
    /**
     * ????????????????????????????????????????????????????????????
     */
    selectMode: PropTypes.oneOf(['single', 'multiple']),
    /**
     * ??????????????????????????????????????????????????????????????????????????????
     */
    shallowSelect: PropTypes.bool,
    /**
     * ?????????????????????????????????????????? false ????????????????????????????????????????????????????????????
     */
    hasSelectedIcon: PropTypes.bool,
    labelToggleChecked: PropTypes.bool,
    /**
     * ???????????????????????????????????? hasSelectedIcon ???true ????????????
     * ?????????SubMenu ??????????????????????????????????????????API??????
     */
    isSelectIconRight: PropTypes.bool,
    /**
     * ???????????????????????????
     */
    direction: PropTypes.oneOf(['ver', 'hoz']),
    /**
     * ??????????????? item ??? footer ????????????????????? direction ????????? 'hoz' ?????? header ???????????????
     */
    hozAlign: PropTypes.oneOf(['left', 'right']),
    /**
     * ???????????????????????????????????????????????????????????????????????? SubMenu ????????? ?????? direction='hoz' mode='popup' ?????????
     */
    hozInLine: PropTypes.bool,
    renderMore: PropTypes.func,
    /**
     * ?????????????????????
     */
    header: PropTypes.node,
    /**
     * ?????????????????????
     */
    footer: PropTypes.node,
    /**
     * ????????????????????????
     */
    autoFocus: PropTypes.bool,
    /**
     * ?????????????????????????????????????????? key ???
     */
    focusedKey: PropTypes.string,
    focusable: PropTypes.bool,
    onItemFocus: PropTypes.func,
    onBlur: PropTypes.func,
    /**
     * ??????????????????????????????????????????Layout???????????????????????????????????????????????????border???box-shadow???????????????`<Menu style={{lineHeight: '100px'}}>` ???????????????
     * @version 1.18
     */
    embeddable: PropTypes.bool,
    onItemKeyDown: PropTypes.func,
    expandAnimation: PropTypes.bool,
    itemClassName: PropTypes.string,
    /**
     * ????????????icons????????? select ???
     */
    icons: PropTypes.object,
    // content ?????????????????????????????????????????? header ??? footer ??????????????????
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
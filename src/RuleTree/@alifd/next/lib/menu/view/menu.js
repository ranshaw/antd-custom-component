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

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactLifecyclesCompat = require('react-lifecycles-compat');

var _subMenu = require('./sub-menu');

var _subMenu2 = _interopRequireDefault(_subMenu);

var _configProvider = require('../../config-provider');

var _configProvider2 = _interopRequireDefault(_configProvider);

var _util = require('../../util');

var _util2 = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bindCtx = _util.func.bindCtx;
var pickOthers = _util.obj.pickOthers,
    isNil = _util.obj.isNil;

var noop = function noop() {};
var MENUITEM_OVERFLOWED_CLASSNAME = 'menuitem-overflowed';

var getIndicatorsItem = function getIndicatorsItem(items, isPlaceholder) {
    var _cx;

    var prefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var renderMore = arguments[3];

    var moreCls = (0, _classnames2.default)((_cx = {}, _cx[prefix + 'menu-more'] = true, _cx));

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
        var renderMoreCls = (0, _classnames2.default)(moreCls, moreNode.props && moreNode.props.className);

        return _react2.default.isValidElement(moreNode) ? _react2.default.cloneElement(moreNode, {
            style: style,
            className: renderMoreCls
        }) : moreNode;
    }

    return _react2.default.createElement(
        _subMenu2.default,
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
            child = _react2.default.cloneElement(child, {
                key: 'more-' + index,
                style: { display: 'none' },
                className: (child && child.className || '') + ' ' + MENUITEM_OVERFLOWED_CLASSNAME
            });
        }

        if (index === lastVisibleIndex + 1) {
            overflowedItems = children.slice(lastVisibleIndex + 1).map(function (c, i) {
                return _react2.default.cloneElement(c, {
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
        return _react.Children.map(children, function (child) {
            if (child && (typeof child.type === 'function' ||
            // `React.forwardRef(render)` returns a forwarding
            // object that includes `render` method, and the specific
            // `child.type` will be an object instead of a class or
            // function.
            (0, _typeof3.default)(child.type) === 'object') && 'menuChildType' in child.type) {
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
                        newChild = (0, _react.cloneElement)(child, props, loop(child.props.children, pos, undefined, childLevel));
                        break;
                    case 'group':
                        newChild = (0, _react.cloneElement)(child, props, loop(child.props.children, posPrefix, indexWrapper, props.level));
                        break;
                    case 'item':
                    case 'divider':
                        newChild = (0, _react.cloneElement)(child, props);
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
    (0, _inherits3.default)(Menu, _Component);

    function Menu(props) {
        (0, _classCallCheck3.default)(this, Menu);

        var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call(this, props));

        _this.getUpdateChildren = function () {
            var _this$state = _this.state,
                root = _this$state.root,
                lastVisibleIndex = _this$state.lastVisibleIndex;


            return getNewChildren((0, _extends3.default)({
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

        var _getNewChildren = getNewChildren((0, _extends3.default)({
            root: _this
        }, _this.props)),
            newChildren = _getNewChildren.newChildren,
            _k2n = _getNewChildren._k2n,
            _p2n = _getNewChildren._p2n;

        var tabbableKey = focusable ? (0, _util2.getFirstAvaliablelChildKey)('0', _p2n) : undefined;

        _this.state = {
            root: _this,
            lastVisibleIndex: undefined,
            newChildren: newChildren,
            _k2n: _k2n,
            _p2n: _p2n,
            tabbableKey: tabbableKey,
            openKeys: _this.getInitOpenKeys(props, _k2n, _p2n),
            selectedKeys: (0, _util2.normalizeToArray)(selectedKeys || defaultSelectedKeys),
            focusedKey: !isNil(_this.props.focusedKey) ? focusedKey : focusable && autoFocus ? tabbableKey : null
        };

        bindCtx(_this, ['handleOpen', 'handleSelect', 'handleItemClick', 'handleItemKeyDown', 'onBlur', 'adjustChildrenWidth']);

        _this.popupNodes = [];
        return _this;
    }

    Menu.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, prevState) {
        var state = {};

        if ('openKeys' in nextProps) {
            state.openKeys = (0, _util2.normalizeToArray)(nextProps.openKeys);
            // ???????????????????????????????????????????????????openKeys
        } else if ('mode' in nextProps && nextProps.mode === 'popup' && prevState.lastMode === 'inline') {
            state.openKeys = [];
        }

        if ('selectedKeys' in nextProps) {
            state.selectedKeys = (0, _util2.normalizeToArray)(nextProps.selectedKeys);
        }
        if ('focusedKey' in nextProps) {
            state.focusedKey = nextProps.focusedKey;
        }

        state.lastMode = nextProps.mode;

        var _getNewChildren2 = getNewChildren((0, _extends3.default)({
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
                state.tabbableKey = (0, _util2.getFirstAvaliablelChildKey)('0', _p2n);
            }
        }

        return state;
    };

    Menu.prototype.componentDidMount = function componentDidMount() {
        this.menuNode = (0, _reactDom.findDOMNode)(this);

        this.adjustChildrenWidth();

        if (this.props.hozInLine) {
            _util.events.on(window, 'resize', this.adjustChildrenWidth);
        }
    };

    Menu.prototype.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
        if (prevState.lastVisibleIndex !== this.state.lastVisibleIndex) {
            this.adjustChildrenWidth();
        }
    };

    Menu.prototype.componentWillUnmount = function componentWillUnmount() {
        _util.events.off(window, 'resize', this.adjustChildrenWidth);
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
            spaceWidth = (0, _util2.getWidth)(this.menuNode) - (0, _util2.getWidth)(this.menuHeader) - (0, _util2.getWidth)(this.menuFooter);
        } else {
            children = this.menuNode.children;
            spaceWidth = (0, _util2.getWidth)(this.menuNode);
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
            _util.dom.setStyle(c, 'display', 'inline-block');
        });

        _util.dom.setStyle(moreNode, 'display', 'inline-block');
        var moreWidth = (0, _util2.getWidth)(moreNode);

        this.menuItemSizes = menuItemNodes.map(function (c) {
            return (0, _util2.getWidth)(c);
        });
        var totalLen = this.menuItemSizes.length;

        overflowedItems.forEach(function (c) {
            _util.dom.setStyle(c, 'display', 'none');
        });

        this.menuItemSizes.forEach(function (liWidth, i) {
            currentSumWidth += liWidth;
            if (i >= totalLen - 1 && currentSumWidth <= spaceWidth || currentSumWidth + moreWidth <= spaceWidth) {
                lastVisibleIndex++;
            }
        });

        if (lastVisibleIndex >= totalLen - 1) {
            _util.dom.setStyle(moreNode, 'display', 'none');
        }

        this.setState((0, _extends3.default)({
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

        return (0, _util2.normalizeToArray)(initOpenKeys);
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
                        return _k2n[k] && !(0, _util2.isSibling)(_k2n[key].pos, _k2n[k].pos);
                    });
                    newOpenKeys.push(key);
                } else {
                    newOpenKeys = openKeys.concat(key);
                }
            } else {
                newOpenKeys = openKeys.filter(function (k) {
                    return _k2n[k] && (0, _util2.isAncestor)(_k2n[key].pos, _k2n[k].pos);
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
                    return k !== key && _k2n[k] && !(0, _util2.isAncestor)(_k2n[k].pos, _k2n[key].pos);
                });
            }
        }

        if (newOpenKeys) {
            if (isNil(this.props.openKeys)) {
                this.setState((0, _extends3.default)({
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

            this.props.onSelect(newSelectedKeys, menuItem, (0, _extends3.default)({
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
            return (0, _util2.isAvailablePos)(pos, p, _p2n);
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
        if ([_util.KEYCODE.UP, _util.KEYCODE.DOWN, _util.KEYCODE.RIGHT, _util.KEYCODE.LEFT, _util.KEYCODE.ENTER, _util.KEYCODE.ESC, _util.KEYCODE.SPACE].indexOf(e.keyCode) > -1) {
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
            case _util.KEYCODE.UP:
                {
                    var avaliableKey = this.getAvailableKey(pos, true);
                    if (avaliableKey) {
                        focusedKey = avaliableKey;
                    }
                    break;
                }
            case _util.KEYCODE.DOWN:
                {
                    var _avaliableKey = void 0;
                    if (direction === 'hoz' && level === 1 && type === 'submenu') {
                        this.handleOpen(key, true);
                        _avaliableKey = (0, _util2.getFirstAvaliablelChildKey)(pos, _p2n);
                    } else {
                        _avaliableKey = this.getAvailableKey(pos, false);
                    }
                    if (_avaliableKey) {
                        focusedKey = _avaliableKey;
                    }
                    break;
                }
            case _util.KEYCODE.RIGHT:
                {
                    var _avaliableKey2 = void 0;
                    if (direction === 'hoz' && level === 1) {
                        _avaliableKey2 = this.getAvailableKey(pos, false);
                    } else if (type === 'submenu') {
                        this.handleOpen(key, true);
                        _avaliableKey2 = (0, _util2.getFirstAvaliablelChildKey)(pos, _p2n);
                    }
                    if (_avaliableKey2) {
                        focusedKey = _avaliableKey2;
                    }
                    break;
                }
            case _util.KEYCODE.ENTER:
                {
                    if (type === 'submenu') {
                        this.handleOpen(key, true);
                        var _avaliableKey3 = (0, _util2.getFirstAvaliablelChildKey)(pos, _p2n);
                        if (_avaliableKey3) {
                            focusedKey = _avaliableKey3;
                        }
                    }
                    break;
                }
            case _util.KEYCODE.LEFT:
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
            case _util.KEYCODE.ESC:
                if (level > 1) {
                    var _parentKey = this.getParentKey(pos);
                    this.handleOpen(_parentKey, false);
                    focusedKey = _parentKey;
                }
                break;

            case _util.KEYCODE.TAB:
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

        var newClassName = (0, _classnames2.default)((_cx2 = {}, _cx2[prefix + 'menu'] = true, _cx2[prefix + 'ver'] = direction === 'ver', _cx2[prefix + 'hoz'] = direction === 'hoz', _cx2[prefix + 'menu-embeddable'] = embeddable, _cx2[prefix + 'menu-nowrap'] = hozInLine, _cx2[prefix + 'menu-selectable-' + selectMode] = selectMode, _cx2[className] = !!className, _cx2));

        var role = direction === 'hoz' ? 'menubar' : 'menu';
        var ariaMultiselectable = void 0;
        if ('selectMode' in this.props) {
            role = 'listbox';
            ariaMultiselectable = !!(selectMode === 'multiple');
        }

        var headerElement = header ? _react2.default.createElement(
            'li',
            { className: prefix + 'menu-header', ref: this.menuHeaderRef },
            header
        ) : null;
        var itemsElement = !flatenContent && (header || footer) ? _react2.default.createElement(
            'ul',
            { className: prefix + 'menu-content', ref: this.menuContentRef },
            newChildren
        ) : newChildren;
        var footerElement = footer ? _react2.default.createElement(
            'li',
            { className: prefix + 'menu-footer', ref: this.menuFooterRef },
            footer
        ) : null;
        var shouldWrapItemsAndFooter = hozAlign === 'right' && !!header;

        if (rtl) {
            others.dir = 'rtl';
        }

        return _react2.default.createElement(
            'ul',
            (0, _extends3.default)({
                role: role,
                onBlur: this.onBlur,
                className: newClassName,
                onKeyDown: this.handleEnter,
                'aria-multiselectable': ariaMultiselectable
            }, others),
            headerElement,
            shouldWrapItemsAndFooter ? _react2.default.createElement(
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
}(_react.Component), _class.isNextMenu = true, _class.propTypes = (0, _extends3.default)({}, _configProvider2.default.propTypes, {
    prefix: _propTypes2.default.string,
    pure: _propTypes2.default.bool,
    rtl: _propTypes2.default.bool,
    className: _propTypes2.default.string,
    /**
     * ?????????????????????
     */
    children: _propTypes2.default.node,
    /**
     * ????????????????????????????????????
     * @param {String} key ????????????????????? key ???
     * @param {Object} item ????????????????????????
     * @param {Object} event ?????????????????????
     */
    onItemClick: _propTypes2.default.func,
    /**
     * ??????????????????????????? key ???
     */
    openKeys: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.array]),
    /**
     * ??????????????????????????? key ???
     */
    defaultOpenKeys: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.array]),
    /**
     * ??????????????????????????????????????? mode ????????? 'inline' ?????? openMode ????????? 'multiple' ??????????????????????????? defaultOpenKeys
     */
    defaultOpenAll: _propTypes2.default.bool,
    /**
     * ?????????????????????????????????????????????
     * @param {Array} key ??????????????????????????? key ???
     * @param {Object} extra ????????????
     * @param {String} extra.key ???????????????????????? key ???
     * @param {Boolean} extra.open ???????????????
     */
    onOpen: _propTypes2.default.func,
    /**
     * ????????????????????????
     */
    mode: _propTypes2.default.oneOf(['inline', 'popup']),
    /**
     * ??????????????????????????????
     */
    triggerType: _propTypes2.default.oneOf(['click', 'hover']),
    /**
     * ????????????????????????????????????????????????????????????????????????????????????????????????????????? mode ??? inline ?????????
     */
    openMode: _propTypes2.default.oneOf(['single', 'multiple']),
    /**
     * ???????????????????????????
     */
    inlineIndent: _propTypes2.default.number,
    inlineArrowDirection: _propTypes2.default.oneOf(['down', 'right']),
    /**
     * ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
     */
    popupAutoWidth: _propTypes2.default.bool,
    /**
     * ?????????????????????
     */
    popupAlign: _propTypes2.default.oneOf(['follow', 'outside']),
    /**
     * ??????????????? props
     */
    popupProps: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.func]),
    /**
     * ???????????????????????? className
     */
    popupClassName: _propTypes2.default.string,
    /**
     * ???????????????????????? style
     */
    popupStyle: _propTypes2.default.object,
    /**
     * ???????????????????????? key ???
     */
    selectedKeys: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.array]),
    /**
     * ???????????????????????? key ???
     */
    defaultSelectedKeys: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.array]),
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
    onSelect: _propTypes2.default.func,
    /**
     * ????????????????????????????????????????????????????????????
     */
    selectMode: _propTypes2.default.oneOf(['single', 'multiple']),
    /**
     * ??????????????????????????????????????????????????????????????????????????????
     */
    shallowSelect: _propTypes2.default.bool,
    /**
     * ?????????????????????????????????????????? false ????????????????????????????????????????????????????????????
     */
    hasSelectedIcon: _propTypes2.default.bool,
    labelToggleChecked: _propTypes2.default.bool,
    /**
     * ???????????????????????????????????? hasSelectedIcon ???true ????????????
     * ?????????SubMenu ??????????????????????????????????????????API??????
     */
    isSelectIconRight: _propTypes2.default.bool,
    /**
     * ???????????????????????????
     */
    direction: _propTypes2.default.oneOf(['ver', 'hoz']),
    /**
     * ??????????????? item ??? footer ????????????????????? direction ????????? 'hoz' ?????? header ???????????????
     */
    hozAlign: _propTypes2.default.oneOf(['left', 'right']),
    /**
     * ???????????????????????????????????????????????????????????????????????? SubMenu ????????? ?????? direction='hoz' mode='popup' ?????????
     */
    hozInLine: _propTypes2.default.bool,
    renderMore: _propTypes2.default.func,
    /**
     * ?????????????????????
     */
    header: _propTypes2.default.node,
    /**
     * ?????????????????????
     */
    footer: _propTypes2.default.node,
    /**
     * ????????????????????????
     */
    autoFocus: _propTypes2.default.bool,
    /**
     * ?????????????????????????????????????????? key ???
     */
    focusedKey: _propTypes2.default.string,
    focusable: _propTypes2.default.bool,
    onItemFocus: _propTypes2.default.func,
    onBlur: _propTypes2.default.func,
    /**
     * ??????????????????????????????????????????Layout???????????????????????????????????????????????????border???box-shadow???????????????`<Menu style={{lineHeight: '100px'}}>` ???????????????
     * @version 1.18
     */
    embeddable: _propTypes2.default.bool,
    onItemKeyDown: _propTypes2.default.func,
    expandAnimation: _propTypes2.default.bool,
    itemClassName: _propTypes2.default.string,
    /**
     * ????????????icons????????? select ???
     */
    icons: _propTypes2.default.object,
    // content ?????????????????????????????????????????? header ??? footer ??????????????????
    flatenContent: _propTypes2.default.bool
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
exports.default = (0, _reactLifecyclesCompat.polyfill)(Menu);
module.exports = exports['default'];
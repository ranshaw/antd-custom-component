'use strict';

exports.__esModule = true;

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _class, _temp; /* eslint-disable max-depth */


var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash.clonedeep');

var _lodash2 = _interopRequireDefault(_lodash);

var _reactLifecyclesCompat = require('react-lifecycles-compat');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _util = require('../../util');

var _treeNode = require('./tree-node');

var _treeNode2 = _interopRequireDefault(_treeNode);

var _virtualList = require('../../virtual-list');

var _virtualList2 = _interopRequireDefault(_virtualList);

var _util2 = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bindCtx = _util.func.bindCtx,
    noop = _util.func.noop;
var getOffset = _util.dom.getOffset;
var pickOthers = _util.obj.pickOthers,
    isPlainObject = _util.obj.isPlainObject;


var getExpandedKeys = function getExpandedKeys(props, willReceiveProps, _k2n, _p2n) {
    var expandedKeys = void 0;

    if (!willReceiveProps && props.defaultExpandAll) {
        expandedKeys = Object.keys(_k2n).filter(function (key) {
            var children = _k2n[key].children;
            return children && children.length;
        });
    } else {
        expandedKeys = 'expandedKeys' in props ? props.expandedKeys : willReceiveProps ? [] : props.defaultExpandedKeys;
        expandedKeys = (0, _util2.normalizeToArray)(expandedKeys);

        if (props.autoExpandParent) {
            var newExpandedKeys = [];

            var expandedPoss = expandedKeys.reduce(function (ret, key) {
                var pos = _k2n[key] && _k2n[key].pos;
                if (pos) {
                    ret.push(pos);
                    newExpandedKeys.push(key);
                }
                return ret;
            }, []);

            expandedPoss.forEach(function (pos) {
                var nums = pos.split('-');
                if (nums.length === 2) {
                    return;
                }
                for (var i = 1; i <= nums.length - 2; i++) {
                    var ancestorPos = nums.slice(0, i + 1).join('-');
                    var ancestorKey = _p2n[ancestorPos].key;
                    if (newExpandedKeys.indexOf(ancestorKey) === -1) {
                        newExpandedKeys.push(ancestorKey);
                    }
                }
            });

            return newExpandedKeys;
        }
    }

    return expandedKeys;
};

var getSelectedKeys = function getSelectedKeys(props, willReceiveProps, _k2n) {
    var selectedKeys = 'selectedKeys' in props ? props.selectedKeys : willReceiveProps ? [] : props.defaultSelectedKeys;
    selectedKeys = (0, _util2.normalizeToArray)(selectedKeys);

    return selectedKeys.filter(function (key) {
        return _k2n[key];
    });
};

var getIndeterminateKeys = function getIndeterminateKeys(checkedKeys, checkStrictly, _k2n, _p2n) {
    if (checkStrictly) {
        return [];
    }

    var indeterminateKeys = [];

    var poss = (0, _util2.filterChildKey)(checkedKeys.filter(function (key) {
        return !!_k2n[key];
    }).filter(function (key) {
        return !_k2n[key].disabled && !_k2n[key].checkboxDisabled && _k2n[key].checkable !== false;
    }), _k2n, _p2n).map(function (key) {
        return _k2n[key].pos;
    });

    poss.forEach(function (pos) {
        var nums = pos.split('-');
        for (var i = nums.length; i > 2; i--) {
            var parentPos = nums.slice(0, i - 1).join('-');
            var parent = _p2n[parentPos];
            if (parent.disabled || parent.checkboxDisabled) break;
            var parentKey = parent.key;
            if (indeterminateKeys.indexOf(parentKey) === -1) {
                indeterminateKeys.push(parentKey);
            }
        }
    });

    return indeterminateKeys;
};

var getCheckedKeys = function getCheckedKeys(props, willReceiveProps, _k2n, _p2n) {
    var checkedKeys = props.defaultCheckedKeys;
    var indeterminateKeys = void 0;

    if ('checkedKeys' in props) {
        checkedKeys = props.checkedKeys;
    } else if (willReceiveProps) {
        checkedKeys = [];
    }

    var checkStrictly = props.checkStrictly; // TODO TEST

    if (checkStrictly) {
        if (isPlainObject(checkedKeys)) {
            var _checkedKeys = checkedKeys,
                checked = _checkedKeys.checked,
                indeterminate = _checkedKeys.indeterminate;

            checkedKeys = (0, _util2.normalizeToArray)(checked);
            indeterminateKeys = (0, _util2.normalizeToArray)(indeterminate);
        } else {
            checkedKeys = (0, _util2.normalizeToArray)(checkedKeys);
        }

        checkedKeys = checkedKeys.filter(function (key) {
            return !!_k2n[key];
        });
    } else {
        checkedKeys = (0, _util2.getAllCheckedKeys)(checkedKeys, _k2n, _p2n);
        checkedKeys = checkedKeys.filter(function (key) {
            return !!_k2n[key];
        });

        indeterminateKeys = getIndeterminateKeys(checkedKeys, props.checkStrictly, _k2n, _p2n);
    }

    return { checkedKeys: checkedKeys, indeterminateKeys: indeterminateKeys };
};

var preHandleData = function preHandleData(dataSource, props) {
    var k2n = {};
    var p2n = {};
    var keyList = [];

    var drill = function drill() {
        var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
        var prefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '0';
        var parent = arguments[3];
        return data.map(function (item, index) {
            // ??????????????????????????? ??????????????????
            if (item.illegalFlag) {
                return item;
            }

            var children = item.children;

            var pos = prefix + '-' + index;
            var key = item.key;


            item.pos = pos;
            item.level = level;

            // ?????????????????????
            // - ??????isLeaf??????
            // - loadData????????? ????????????isLeaf???true
            // - ??????children??????
            if (!('isLeaf' in item)) {
                item.isLeaf = !(children && children.length || props.loadData);
            }

            item.isLastChild = parent ? [].concat(parent.isLastChild || [], index === data.length - 1) : [];

            if (key === undefined || key === null) {
                item.key = key = pos;
            }
            keyList.push(key);
            !item.isLeaf && drill(children, level + 1, pos, item);

            k2n[key] = p2n[pos] = (0, _extends3.default)({}, item);

            return item;
        });
    };

    return { dataSource: drill(dataSource), k2n: k2n, p2n: p2n, keyList: keyList };
};

var preHandleChildren = function preHandleChildren(props) {
    var k2n = {};
    var p2n = {};
    var keyList = [];

    var loop = function loop(children) {
        var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '0';
        var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
        return _react.Children.map(children, function (node, index) {
            if (!_react2.default.isValidElement(node)) {
                return;
            }
            var pos = prefix + '-' + index;
            var key = node.key;


            key = key || pos;

            var item = (0, _extends3.default)({}, node.props, { key: key, pos: pos, level: level });
            var children = node.props.children;

            var hasChildren = children && _react.Children.count(children);

            if (!('isLeaf' in item)) {
                item.isLeaf = !(hasChildren || props.loadData);
            }
            keyList.push(key);
            if (hasChildren) {
                item.children = loop(children, pos, level + 1);
            }

            k2n[key] = p2n[pos] = item;
            return item;
        });
    };
    loop(props.children);

    return { k2n: k2n, p2n: p2n, keyList: keyList };
};

var getData = function getData(props) {
    var dataSource = props.dataSource,
        renderChildNodes = props.renderChildNodes,
        _props$children = props.children,
        children = _props$children === undefined ? [] : _props$children,
        useVirtual = props.useVirtual,
        immutable = props.immutable;

    var data = immutable ? (0, _lodash2.default)(dataSource) : dataSource;

    if ((renderChildNodes || useVirtual) && !('dataSource' in props)) {
        data = (0, _util2.convertChildren2Data)(children);
    }

    if (data) {
        try {
            return preHandleData(data, props);
        } catch (err) {
            if ((err.message || '').match('object is not extensible')) {
                // eslint-disable-next-line no-console
                console.error(err.message, 'try to set immutable to true to allow immutable dataSource');
            } else {
                throw err;
            }
        }
    } else {
        return preHandleChildren(props);
    }
};

/**
 * Tree
 */
var Tree = (_temp = _class = function (_Component) {
    (0, _inherits3.default)(Tree, _Component);

    function Tree(props) {
        (0, _classCallCheck3.default)(this, Tree);

        var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call(this, props));

        var _getData = getData(props),
            _getData$dataSource = _getData.dataSource,
            dataSource = _getData$dataSource === undefined ? [] : _getData$dataSource,
            k2n = _getData.k2n,
            p2n = _getData.p2n,
            keyList = _getData.keyList;

        var _this$props = _this.props,
            focusable = _this$props.focusable,
            autoFocus = _this$props.autoFocus,
            focusedKey = _this$props.focusedKey;

        var willReceiveProps = false;

        var _getCheckedKeys = getCheckedKeys(props, willReceiveProps, k2n, p2n),
            checkedKeys = _getCheckedKeys.checkedKeys,
            _getCheckedKeys$indet = _getCheckedKeys.indeterminateKeys,
            indeterminateKeys = _getCheckedKeys$indet === undefined ? [] : _getCheckedKeys$indet;

        _this.state = {
            _k2n: k2n,
            _p2n: p2n,
            _keyList: keyList,
            dataSource: dataSource,
            willReceiveProps: willReceiveProps,
            expandedKeys: getExpandedKeys(props, willReceiveProps, k2n, p2n),
            selectedKeys: getSelectedKeys(props, willReceiveProps, k2n, p2n),
            checkedKeys: checkedKeys,
            indeterminateKeys: indeterminateKeys
        };

        if (focusable) {
            _this.tabbableKey = _this.getFirstAvaliablelChildKey('0');
        }

        _this.state.focusedKey = 'focusedKey' in props ? focusedKey : focusable && autoFocus ? _this.tabbableKey : null;

        if (focusable) {
            _this.tabbableKey = _this.getFirstAvaliablelChildKey('0');
        }

        bindCtx(_this, ['handleExpand', 'handleSelect', 'handleCheck', 'handleBlur']);
        return _this;
    }

    Tree.getDerivedStateFromProps = function getDerivedStateFromProps(props, state) {
        var _getData2 = getData(props),
            _getData2$dataSource = _getData2.dataSource,
            dataSource = _getData2$dataSource === undefined ? [] : _getData2$dataSource,
            k2n = _getData2.k2n,
            p2n = _getData2.p2n,
            keyList = _getData2.keyList;

        var st = {};

        if (!state.willReceiveProps) {
            return {
                willReceiveProps: true,
                _k2n: k2n,
                _p2n: p2n,
                _keyList: keyList
            };
        }

        if ('expandedKeys' in props) {
            st.expandedKeys = getExpandedKeys(props, state.willReceiveProps, k2n, p2n);
        }

        if ('selectedKeys' in props) {
            st.selectedKeys = getSelectedKeys(props, state.willReceiveProps, k2n);
        }

        if ('checkedKeys' in props) {
            var _getCheckedKeys2 = getCheckedKeys(props, state.willReceiveProps, k2n, p2n),
                checkedKeys = _getCheckedKeys2.checkedKeys;

            st.checkedKeys = checkedKeys;
        }

        st.indeterminateKeys = props.checkStrictly ? props.checkedKeys && props.checkedKeys.indeterminate || [] : getIndeterminateKeys(st.checkedKeys || state.checkedKeys || [], props.checkStrictly, k2n, p2n);

        return (0, _extends3.default)({}, st, {
            dataSource: dataSource,
            _k2n: k2n,
            _p2n: p2n
        });
    };

    Tree.prototype.setFocusKey = function setFocusKey() {
        var _state$selectedKeys = this.state.selectedKeys,
            selectedKeys = _state$selectedKeys === undefined ? [] : _state$selectedKeys;

        this.setState({
            focusedKey: selectedKeys.length > 0 ? selectedKeys[0] : this.getFirstAvaliablelChildKey('0')
        });
    };

    Tree.prototype.getAvailableKey = function getAvailableKey(pos, prev) {
        var _this2 = this;

        var ps = Object.keys(this.state._p2n).filter(function (p) {
            return _this2.isAvailablePos(pos, p);
        });
        if (ps.length > 1) {
            var index = ps.indexOf(pos);
            var targetIndex = void 0;
            if (prev) {
                targetIndex = index === 0 ? ps.length - 1 : index - 1;
            } else {
                targetIndex = index === ps.length - 1 ? 0 : index + 1;
            }

            return this.state._p2n[ps[targetIndex]].key;
        }

        return null;
    };

    Tree.prototype.getFirstAvaliablelChildKey = function getFirstAvaliablelChildKey(parentPos) {
        var _this3 = this;

        var pos = Object.keys(this.state._p2n).find(function (p) {
            return _this3.isAvailablePos(parentPos + '-0', p);
        });
        return pos ? this.state._p2n[pos].key : null;
    };

    Tree.prototype.isAvailablePos = function isAvailablePos(refPos, targetPos) {
        var disabled = this.state._p2n[targetPos].disabled;


        return this.isSibling(refPos, targetPos) && !disabled;
    };

    Tree.prototype.isSibling = function isSibling(currentPos, targetPos) {
        var currentNums = currentPos.split('-').slice(0, -1);
        var targetNums = targetPos.split('-').slice(0, -1);

        return currentNums.length === targetNums.length && currentNums.every(function (num, index) {
            return num === targetNums[index];
        });
    };

    Tree.prototype.getParentKey = function getParentKey(pos) {
        return this.state._p2n[pos.slice(0, pos.length - 2)].key;
    };

    Tree.prototype.processKey = function processKey(keys, key, add) {
        var index = keys.indexOf(key);
        if (add && index === -1) {
            keys.push(key);
        } else if (!add && index > -1) {
            keys.splice(index, 1);
        }
        return keys;
    };

    /*eslint-disable max-statements*/


    Tree.prototype.handleItemKeyDown = function handleItemKeyDown(key, item, e) {
        if ([_util.KEYCODE.UP, _util.KEYCODE.DOWN, _util.KEYCODE.RIGHT, _util.KEYCODE.LEFT, _util.KEYCODE.ENTER, _util.KEYCODE.ESC, _util.KEYCODE.SPACE].indexOf(e.keyCode) > -1) {
            e.preventDefault();
            e.stopPropagation();
        }

        var focusedKey = this.state.focusedKey;

        var node = this.state._k2n[key];
        var pos = this.state._k2n[key].pos;
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
                    var _avaliableKey = this.getAvailableKey(pos, false);
                    if (_avaliableKey) {
                        focusedKey = _avaliableKey;
                    }
                    break;
                }
            case _util.KEYCODE.RIGHT:
                {
                    this.handleExpand(true, key, node);
                    var _avaliableKey2 = this.getFirstAvaliablelChildKey(pos);
                    if (_avaliableKey2) {
                        focusedKey = _avaliableKey2;
                    }
                    break;
                }
            case _util.KEYCODE.LEFT:
            case _util.KEYCODE.ESC:
                {
                    if (level === 1) {
                        var _avaliableKey3 = this.getAvailableKey(pos, true);
                        if (_avaliableKey3) {
                            focusedKey = _avaliableKey3;
                        }
                    } else if (level > 1) {
                        var parentKey = this.getParentKey(pos);
                        this.handleExpand(false, parentKey, node);
                        focusedKey = parentKey;
                    }
                    break;
                }

            case _util.KEYCODE.ENTER:
            case _util.KEYCODE.SPACE:
                {
                    var checkable = 'checkable' in item.props ? item.props.checkable : this.props.checkable;
                    var selectable = 'selectable' in item.props ? item.props.selectable : this.props.selectable;

                    if (checkable) {
                        this.handleCheck(!item.props.checked, key, node);
                    } else if (selectable) {
                        this.handleSelect(!item.props.selected, key, node, e);
                    }
                    break;
                }
            case _util.KEYCODE.TAB:
                focusedKey = null;
                break;
            default:
                break;
        }

        if (focusedKey !== this.state.focusedKey) {
            if (!('focusedKey' in this.props)) {
                this.setState({
                    focusedKey: focusedKey
                });
            }
        }

        this.props.onItemKeyDown(focusedKey, item, e);
        this.props.onItemFocus(focusedKey, e);
    };

    Tree.prototype.handleBlur = function handleBlur(e) {
        this.setState({
            focusedKey: ''
        });

        this.props.onBlur && this.props.onBlur(e);
    };

    Tree.prototype.handleExpand = function handleExpand(expand, key, node) {
        var _this4 = this;

        var _props = this.props,
            onExpand = _props.onExpand,
            loadData = _props.loadData;

        var expandedKeys = this.state.expandedKeys; // ??????setState ?????????????????????????????? [...this.state.expandedKeys]
        this.processKey(expandedKeys, key, expand);
        var setExpandedState = function setExpandedState() {
            if (!('expandedKeys' in _this4.props)) {
                _this4.setState({ expandedKeys: expandedKeys });
            }
            onExpand(expandedKeys, { expanded: expand, node: node });
        };

        if (expand && loadData) {
            return loadData(node).then(setExpandedState);
        } else {
            setExpandedState();
        }
    };

    Tree.prototype.handleSelect = function handleSelect(select, key, node, e) {
        var _props2 = this.props,
            multiple = _props2.multiple,
            onSelect = _props2.onSelect;

        var selectedKeys = [].concat(this.state.selectedKeys);
        if (multiple) {
            this.processKey(selectedKeys, key, select);
        } else {
            selectedKeys = select ? [key] : [];
        }

        if (!('selectedKeys' in this.props)) {
            this.setState({ selectedKeys: selectedKeys });
        }
        onSelect(selectedKeys, {
            selectedNodes: this.getNodes(selectedKeys),
            node: node,
            selected: select,
            event: e
        });
    };

    // eslint-disable-next-line max-statements


    Tree.prototype.handleCheck = function handleCheck(check, key, node) {
        var _this5 = this;

        var _props3 = this.props,
            checkStrictly = _props3.checkStrictly,
            checkedStrategy = _props3.checkedStrategy,
            onCheck = _props3.onCheck;
        var _state = this.state,
            _k2n = _state._k2n,
            _p2n = _state._p2n;

        var checkedKeys = [].concat(this.state.checkedKeys);

        if (checkStrictly) {
            this.processKey(checkedKeys, key, check);
            var _newCheckedKeys = isPlainObject(this.props.checkedKeys) ? {
                checked: checkedKeys,
                indeterminate: this.state.indeterminateKeys
            } : checkedKeys;

            onCheck(_newCheckedKeys, {
                checkedNodes: this.getNodes(checkedKeys),
                checkedNodesPositions: checkedKeys.map(function (key) {
                    if (!_k2n[key]) return null;
                    var _k2n$key = _k2n[key],
                        node = _k2n$key.node,
                        pos = _k2n$key.pos;

                    return { node: node, pos: pos };
                }).filter(function (v) {
                    return !!v;
                }),
                node: node,
                indeterminateKeys: this.state.indeterminateKeys,
                checked: check,
                key: key
            });

            return;
        }

        var pos = _k2n[key].pos;

        (0, _util2.forEachEnableNode)(_k2n[key], function (node) {
            if (node.checkable === false) return;
            _this5.processKey(checkedKeys, node.key, check);
        });

        var ps = Object.keys(_p2n);

        var currentPos = pos;
        var nums = pos.split('-');

        for (var i = nums.length; i > 2; i--) {
            var parentCheck = true;

            var parentPos = nums.slice(0, i - 1).join('-');
            if (_p2n[parentPos].disabled || _p2n[parentPos].checkboxDisabled || _p2n[parentPos].checkable === false) {
                currentPos = parentPos;
                continue;
            }
            var parentKey = _p2n[parentPos].key;
            var parentChecked = checkedKeys.indexOf(parentKey) > -1;
            if (!check && !parentChecked) {
                break;
            }

            for (var j = 0; j < ps.length; j++) {
                var p = ps[j];
                var pnode = _p2n[p];
                if ((0, _util2.isSiblingOrSelf)(currentPos, p) && !pnode.disabled && !pnode.checkboxDisabled) {
                    var k = pnode.key;
                    if (pnode.checkable === false) {
                        // eslint-disable-next-line max-depth
                        if (!pnode.children || pnode.children.length === 0) continue;

                        // eslint-disable-next-line max-depth
                        for (var m = 0; m < pnode.children.length; m++) {
                            if (!pnode.children.every(function (child) {
                                return (0, _util2.isNodeChecked)(child, checkedKeys);
                            })) {
                                parentCheck = false;
                                break;
                            }
                        }
                    } else if (checkedKeys.indexOf(k) === -1) {
                        parentCheck = false;
                    }

                    if (!parentCheck) break;
                }
            }

            this.processKey(checkedKeys, parentKey, parentCheck);

            currentPos = parentPos;
        }

        var indeterminateKeys = getIndeterminateKeys(checkedKeys, checkStrictly, _k2n, _p2n);
        if (!('checkedKeys' in this.props)) {
            this.setState({
                checkedKeys: checkedKeys,
                indeterminateKeys: indeterminateKeys
            });
        }

        var newCheckedKeys = void 0;
        switch (checkedStrategy) {
            case 'parent':
                newCheckedKeys = (0, _util2.filterChildKey)(checkedKeys, _k2n, _p2n);
                break;
            case 'child':
                newCheckedKeys = (0, _util2.filterParentKey)(checkedKeys, _k2n, _p2n);
                break;
            default:
                newCheckedKeys = checkedKeys;
                break;
        }

        onCheck(newCheckedKeys, {
            checkedNodes: this.getNodes(newCheckedKeys),
            checkedNodesPositions: newCheckedKeys.map(function (key) {
                if (!_k2n[key]) return null;
                var _k2n$key2 = _k2n[key],
                    node = _k2n$key2.node,
                    pos = _k2n$key2.pos;

                return { node: node, pos: pos };
            }).filter(function (v) {
                return !!v;
            }),
            node: node,
            indeterminateKeys: indeterminateKeys,
            checked: check,
            key: key
        });
    };

    Tree.prototype.getNodeProps = function getNodeProps(key) {
        var prefix = this.props.prefix;
        var _state2 = this.state,
            expandedKeys = _state2.expandedKeys,
            selectedKeys = _state2.selectedKeys,
            checkedKeys = _state2.checkedKeys,
            dragOverNodeKey = _state2.dragOverNodeKey,
            _k2n = _state2._k2n,
            indeterminateKeys = _state2.indeterminateKeys;
        var _k2n$key3 = _k2n[key],
            pos = _k2n$key3.pos,
            isLeaf = _k2n$key3.isLeaf,
            level = _k2n$key3.level;


        return {
            prefix: prefix,
            root: this,
            eventKey: key,
            pos: pos,
            isLeaf: isLeaf,
            level: level,
            expanded: expandedKeys.indexOf(key) > -1,
            selected: selectedKeys.indexOf(key) > -1,
            checked: checkedKeys.indexOf(key) > -1,
            indeterminate: indeterminateKeys.indexOf(key) > -1,
            dragOver: dragOverNodeKey === key && this.dropPosition === 0,
            dragOverGapTop: dragOverNodeKey === key && this.dropPosition === -1,
            dragOverGapBottom: dragOverNodeKey === key && this.dropPosition === 1
        };
    };

    Tree.prototype.getNodes = function getNodes(keys) {
        var _this6 = this;

        return keys.map(function (key) {
            return _this6.state._k2n[key] && _this6.state._k2n[key].node;
        }).filter(function (v) {
            return !!v;
        });
    };

    Tree.prototype.handleDragStart = function handleDragStart(e, node) {
        var _this7 = this;

        var dragNodeKey = node.props.eventKey;
        this.dragNode = node;
        this.dragNodesKeys = Object.keys(this.state._k2n).filter(function (k) {
            return (0, _util2.isDescendantOrSelf)(_this7.state._k2n[dragNodeKey].pos, _this7.state._k2n[k].pos);
        });

        var expandedKeys = this.processKey([].concat(this.state.expandedKeys), dragNodeKey, false);
        this.setState({ expandedKeys: expandedKeys });

        this.props.onDragStart({
            event: e,
            node: node,
            expandedKeys: expandedKeys
        });
    };

    Tree.prototype.handleDragEnter = function handleDragEnter(e, node) {
        var dragOverNodeKey = node.props.eventKey;
        this.dropPosition = this.getDropPosition(e, node);
        if (this.dragNode && this.dragNode.props.eventKey === dragOverNodeKey && this.dropPosition === 0) {
            this.setState({
                dragOverNodeKey: null
            });
            return;
        }

        var expandedKeys = this.processKey([].concat(this.state.expandedKeys), dragOverNodeKey, true);
        this.setState({
            dragOverNodeKey: dragOverNodeKey,
            expandedKeys: expandedKeys
        });

        this.props.onDragEnter({
            event: e,
            node: node,
            expandedKeys: expandedKeys
        });
    };

    Tree.prototype.getDropPosition = function getDropPosition(e, node) {
        var labelWrapperNode = node.labelWrapperEl;
        var offsetTop = getOffset(labelWrapperNode).top;
        var offsetHeight = labelWrapperNode.offsetHeight;
        var pageY = e.pageY;
        var gapHeight = 2;

        if (pageY > offsetTop + offsetHeight - gapHeight) {
            return 1;
        }
        if (pageY < offsetTop + gapHeight) {
            return -1;
        }
        return 0;
    };

    Tree.prototype.handleDragOver = function handleDragOver(e, node) {
        var dragOverNodeKey = node.props.eventKey;
        if (this.state.dragOverNodeKey !== dragOverNodeKey) {
            this.setState({
                dragOverNodeKey: dragOverNodeKey
            });
        }

        this.props.onDragOver({ event: e, node: node });
    };

    Tree.prototype.handleDragLeave = function handleDragLeave(e, node) {
        var eventKey = node.props.eventKey;
        var _keyList = this.state._keyList;

        var firstKey = _keyList[0];
        var lastKey = _keyList[_keyList.length - 1];
        // ??????????????????????????????????????????????????????????????????
        if (eventKey === firstKey || eventKey === lastKey) {
            this.setState({
                dragOverNodeKey: null
            });
        }
        this.props.onDragLeave({ event: e, node: node });
    };

    Tree.prototype.handleDragEnd = function handleDragEnd(e, node) {
        this.setState({
            dragOverNodeKey: null
        });

        this.props.onDragEnd({ event: e, node: node });
    };

    Tree.prototype.handleDrop = function handleDrop(e, node) {
        if (this.dragNode && (0, _util2.isDescendantOrSelf)(this.state._k2n[this.dragNode.props.eventKey].pos, this.state._k2n[node.props.eventKey].pos)) {
            return;
        }

        this.setState({
            dragOverNodeKey: null
        });

        var params = this.generateDropParams(node);
        this.props.onDrop((0, _extends3.default)({
            event: e
        }, params));
    };

    Tree.prototype.canDrop = function canDrop(node) {
        var params = this.generateDropParams(node);
        return this.props.canDrop(params);
    };

    Tree.prototype.generateDropParams = function generateDropParams(node) {
        return {
            dragNode: this.dragNode,
            dragNodesKeys: [].concat(this.dragNodesKeys),
            node: node,
            dropPosition: this.dropPosition
        };
    };

    Tree.prototype.filterTreeNode = function filterTreeNode(node) {
        return this.props.filterTreeNode.call(this, node);
    };

    Tree.prototype.shouldNodeShow = function shouldNodeShow(nodeData) {
        var _state3 = this.state,
            expandedKeys = _state3.expandedKeys,
            _p2n = _state3._p2n;


        return !(nodeData.style && nodeData.style.display === 'none') && (0, _util2.getAllDescendantKeys)(nodeData, _p2n).every(function (k) {
            return expandedKeys.includes(k);
        });
    };

    Tree.prototype.renderTreeNode = function renderTreeNode(props, childNodes) {
        var rtl = this.props.rtl;
        var key = props.key;

        var nodeProps = (0, _extends3.default)({
            _key: key
        }, props, this.getNodeProps(key));

        return _react2.default.createElement(
            _treeNode2.default,
            (0, _extends3.default)({ rtl: rtl, key: key }, nodeProps),
            childNodes
        );
    };

    Tree.prototype.renderNodeList = function renderNodeList(dataSource) {
        var _this8 = this;

        var nodeList = [];
        var _k2n = this.state._k2n;

        var drill = function drill(list) {
            list.forEach(function (item) {
                // ??????????????????????????? ??????????????????
                if (item.illegalFlag) {
                    nodeList.push(item);
                    return;
                }

                var children = item.children,
                    nodeProps = (0, _objectWithoutProperties3.default)(item, ['children']);


                if (!_this8.shouldNodeShow(item)) {
                    return;
                }

                nodeList.push(nodeProps);
                children && children.length && drill(children);
            });
        };

        drill(dataSource);

        return nodeList.map(function (nodeProps, index) {
            // ??????????????????????????? ??????????????????
            if (nodeProps.illegalFlag) {
                return nodeProps.node;
            }
            // aria props
            nodeProps.size = nodeList.length;
            nodeProps.posinset = index + 1;

            return _k2n[nodeProps.key].node = _this8.renderTreeNode(nodeProps);
        });
    };

    Tree.prototype.renderWithCustomChildNodes = function renderWithCustomChildNodes(dataSource) {
        var _this9 = this;

        var renderChildNodes = this.props.renderChildNodes;
        var _k2n = this.state._k2n;


        var drill = function drill(list) {
            return list.map(function (_ref, index) {
                var children = _ref.children,
                    nodeProps = (0, _objectWithoutProperties3.default)(_ref, ['children']);

                var childNodes = void 0;

                if (children && children.length) {
                    childNodes = renderChildNodes(drill(children));
                }

                // aria props
                nodeProps.size = list.length;
                nodeProps.posinset = index + 1;

                return _k2n[nodeProps.key].node = _this9.renderTreeNode(nodeProps, childNodes);
            });
        };
        return drill(dataSource);
    };

    Tree.prototype.renderByDataSource = function renderByDataSource(dataSource) {
        var _this10 = this;

        var rtl = this.props.rtl;

        var drill = function drill(data) {
            var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '0';

            return data.map(function (item, index) {
                // ??????????????????????????? ??????????????????
                if (item.illegalFlag) {
                    return item.node;
                }
                var pos = prefix + '-' + index;
                var _item$key = item.key,
                    key = _item$key === undefined ? pos : _item$key,
                    children = item.children,
                    others = (0, _objectWithoutProperties3.default)(item, ['key', 'children']);

                var props = (0, _extends3.default)({}, others, _this10.getNodeProps('' + key), {
                    _key: key
                });
                if (children && children.length) {
                    props.children = drill(children, pos);
                }
                var node = _react2.default.createElement(_treeNode2.default, (0, _extends3.default)({ rtl: rtl, key: key, size: data.length }, props));
                // eslint-disable-next-line
                _this10.state._k2n[key].node = node;
                return node;
            });
        };

        return drill(dataSource);
    };

    Tree.prototype.renderByChildren = function renderByChildren() {
        var _this11 = this;

        var rtl = this.props.rtl;
        var _k2n = this.state._k2n;


        var loop = function loop(children) {
            var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '0';

            return _react.Children.map(children, function (child, index) {
                if (!_react2.default.isValidElement(child)) {
                    return;
                }
                var pos = prefix + '-' + index;
                var key = child.key || pos;
                var props = _this11.getNodeProps('' + key);
                if (child.props.children) {
                    props.children = loop(child.props.children, pos);
                }

                props._key = key;
                props.rtl = rtl;
                props.size = _react.Children.count(children);

                var node = (0, _react.cloneElement)(child, props);
                _k2n[key].node = node;
                return node;
            });
        };

        return loop(this.props.children);
    };

    Tree.prototype.render = function render() {
        var _cx,
            _this12 = this;

        var _props4 = this.props,
            prefix = _props4.prefix,
            rtl = _props4.rtl,
            className = _props4.className,
            showLine = _props4.showLine,
            isNodeBlock = _props4.isNodeBlock,
            isLabelBlock = _props4.isLabelBlock,
            multiple = _props4.multiple,
            useVirtual = _props4.useVirtual,
            renderChildNodes = _props4.renderChildNodes;
        var dataSource = this.state.dataSource;

        var _pickOthers = pickOthers(Object.keys(Tree.propTypes), this.props),
            style = _pickOthers.style,
            others = (0, _objectWithoutProperties3.default)(_pickOthers, ['style']);

        if (rtl) {
            others.dir = 'rtl';
        }

        var newClassName = (0, _classnames2.default)((_cx = {}, _cx[prefix + 'tree'] = true, _cx[prefix + 'label-block'] = isLabelBlock, _cx[prefix + 'node-block'] = isNodeBlock, _cx[prefix + 'node-indent'] = !isNodeBlock, _cx[prefix + 'show-line'] = !isNodeBlock && showLine, _cx[className] = !!className, _cx));

        var treeRender = function treeRender(items, ref) {
            return _react2.default.createElement(
                'ul',
                (0, _extends3.default)({
                    role: 'tree',
                    ref: ref,
                    'aria-multiselectable': multiple,
                    onBlur: _this12.handleBlur,
                    className: newClassName,
                    style: useVirtual ? null : style
                }, others),
                items
            );
        };

        var virtualTreeRender = function virtualTreeRender(dataSource) {
            return _react2.default.createElement(
                'div',
                { className: prefix + 'virtual-tree-container', style: style },
                _react2.default.createElement(
                    _virtualList2.default,
                    { itemsRenderer: function itemsRenderer(items, ref) {
                            return treeRender(items, ref);
                        } },
                    _this12.renderNodeList(dataSource)
                )
            );
        };

        return useVirtual ? virtualTreeRender(dataSource) : renderChildNodes ? treeRender(this.renderWithCustomChildNodes(dataSource)) : !this.props.dataSource ? treeRender(this.renderByChildren()) : treeRender(this.renderByDataSource(dataSource));
    };

    return Tree;
}(_react.Component), _class.propTypes = {
    prefix: _propTypes2.default.string,
    rtl: _propTypes2.default.bool,
    pure: _propTypes2.default.bool,
    className: _propTypes2.default.string,
    /**
     * ?????????
     */
    children: _propTypes2.default.node,
    /**
     * ???????????????????????????????????? children
     */
    dataSource: _propTypes2.default.array,
    /**
     * ?????????????????????
     */
    showLine: _propTypes2.default.bool,
    /**
     * ????????????????????????
     */
    selectable: _propTypes2.default.bool,
    /**
     * ???????????????????????????????????? key ?????????
     */
    selectedKeys: _propTypes2.default.arrayOf(_propTypes2.default.string),
    /**
     * ??????????????????????????????????????? key ?????????
     */
    defaultSelectedKeys: _propTypes2.default.arrayOf(_propTypes2.default.string),
    /**
     * ???????????????????????????????????????????????????
     * @param {Array} selectedKeys ????????????key?????????
     * @param {Object} extra ????????????
     * @param {Array} extra.selectedNodes ?????????????????????
     * @param {Object} extra.node ?????????????????????
     * @param {Boolean} extra.selected ???????????????????????????
     */
    onSelect: _propTypes2.default.func,
    /**
     * ??????????????????
     */
    multiple: _propTypes2.default.bool,
    /**
     * ????????????????????????????????????
     */
    checkable: _propTypes2.default.bool,
    /**
     * ????????????????????????????????????????????? key ???????????? `{checked: Array, indeterminate: Array}` ?????????
     */
    checkedKeys: _propTypes2.default.oneOfType([_propTypes2.default.arrayOf(_propTypes2.default.string), _propTypes2.default.object]),
    /**
     * ???????????????????????????????????????????????? key ?????????
     */
    defaultCheckedKeys: _propTypes2.default.arrayOf(_propTypes2.default.string),
    /**
     * ?????????????????????????????????????????????????????????????????????????????????
     */
    checkStrictly: _propTypes2.default.bool,
    /**
     * ??????????????????????????????
     * @enumdesc ???????????????????????????, ??????????????????????????????????????????, ??????????????????????????????????????????
     */
    checkedStrategy: _propTypes2.default.oneOf(['all', 'parent', 'child']),
    /**
     * ??????????????????????????????????????????????????????
     * @param {Array} checkedKeys ?????????????????????key?????????
     * @param {Object} extra ????????????
     * @param {Array} extra.checkedNodes ??????????????????????????????
     * @param {Array} extra.checkedNodesPositions ????????????????????????????????????????????????????????????
     * @param {Array} extra.indeterminateKeys ????????????????????? key ?????????
     * @param {Object} extra.node ?????????????????????
     * @param {Boolean} extra.checked ???????????????????????????
     */
    onCheck: _propTypes2.default.func,
    /**
     * ??????????????????????????????????????? key ?????????
     */
    expandedKeys: _propTypes2.default.arrayOf(_propTypes2.default.string),
    /**
     * ?????????????????????????????????????????? key ?????????
     */
    defaultExpandedKeys: _propTypes2.default.arrayOf(_propTypes2.default.string),
    /**
     * ??????????????????????????????
     */
    defaultExpandAll: _propTypes2.default.bool,
    /**
     * ??????????????????????????????????????????????????????false
     */
    autoExpandParent: _propTypes2.default.bool,
    /**
     * ?????????????????????????????????????????????
     * @param {Array} expandedKeys ???????????????key?????????
     * @param {Object} extra ????????????
     * @param {Object} extra.node ?????????????????????
     * @param {Boolean} extra.expanded ???????????????????????????
     */
    onExpand: _propTypes2.default.func,
    /**
     * ??????????????????????????????
     */
    editable: _propTypes2.default.bool,
    /**
     * ????????????????????????????????????????????????
     * @param {String} key ??????????????? key
     * @param {String} label ????????????????????????????????????
     * @param {Object} node ?????????????????????
     */
    onEditFinish: _propTypes2.default.func,
    /**
     * ????????????????????????
     */
    draggable: _propTypes2.default.bool,
    /**
     * ??????????????????????????????????????????
     * @param {Object} info ????????????
     * @param {Object} info.event ????????????
     * @param {Object} info.node ???????????????
     */
    onDragStart: _propTypes2.default.func,
    /**
     * ??????????????????????????????????????????????????????
     * @param {Object} info ????????????
     * @param {Object} info.event ????????????
     * @param {Object} info.node ????????????
     * @param {Array} info.expandedKeys ?????????????????????key?????????
     */
    onDragEnter: _propTypes2.default.func,
    /**
     * ??????????????????????????????????????????????????????????????????
     * @param {Object} info ????????????
     * @param {Object} info.event ????????????
     * @param {Object} info.node ????????????
     */
    onDragOver: _propTypes2.default.func,
    /**
     * ??????????????????????????????????????????????????????
     * @param {Object} info ????????????
     * @param {Object} info.event ????????????
     * @param {Object} info.node ????????????
     */
    onDragLeave: _propTypes2.default.func,
    /**
     * ????????????????????????????????????????????????
     * @param {Object} info ????????????
     * @param {Object} info.event ????????????
     * @param {Object} info.node ????????????
     */
    onDragEnd: _propTypes2.default.func,
    /**
     * ???????????????????????????????????????????????????????????????
     * @param {Object} info ????????????
     * @param {Object} info.event ????????????
     * @param {Object} info.node ????????????
     * @param {Object} info.dragNode ???????????????
     * @param {Array} info.dragNodesKeys ?????????????????????????????? key ?????????
     * @param {Number} info.dropPosition ???????????????-1????????????????????????0????????????????????????1?????????????????????
     */
    onDrop: _propTypes2.default.func,
    /**
     * ?????????????????????????????????????????????
     * @param {Object} info ????????????
     * @param {Object} info.node ????????????
     * @param {Object} info.dragNode ???????????????
     * @param {Array} info.dragNodesKeys ?????????????????????????????? key ?????????
     * @param {Number} info.dropPosition ???????????????-1????????????????????????0????????????????????????1?????????????????????
     * @return {Boolean} ?????????????????????????????????
     */
    canDrop: _propTypes2.default.func,
    /**
     * ???????????????????????????
     * @param {Object} node ????????????????????????
     */
    loadData: _propTypes2.default.func,
    /**
     * ????????????????????????
     * @param {Object} node ??????????????????
     * @return {Boolean} ??????????????????
     */
    filterTreeNode: _propTypes2.default.func,
    /**
     * ??????????????????????????????????????????
     * @param {Object} info ????????????
     * @param {Object} info.event ????????????
     * @param {Object} info.node ???????????????
     */
    onRightClick: _propTypes2.default.func,
    /**
     * ???????????????????????????????????????????????????????????????????????????????????????(?????? flex ???????????????????????? ie10+)
     */
    isLabelBlock: _propTypes2.default.bool,
    /**
     * ??????????????????????????????
     */
    isNodeBlock: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.object]),
    /**
     * ??????????????????????????????
     */
    animation: _propTypes2.default.bool,
    /**
     * ?????????????????????????????????????????? key ???
     */
    focusedKey: _propTypes2.default.string,
    /**
     * ???????????????
     * @param {Array<ReactNode>} nodes ??????????????????
     * @return {ReactNode} ????????????
     */
    renderChildNodes: _propTypes2.default.func,
    focusable: _propTypes2.default.bool,
    autoFocus: _propTypes2.default.bool,
    onItemFocus: _propTypes2.default.func,
    onBlur: _propTypes2.default.func,
    onItemKeyDown: _propTypes2.default.func,
    /**
     * ????????????????????????
     */
    useVirtual: _propTypes2.default.bool,
    /**
     * ????????????????????????
     * @version 1.23
     */
    immutable: _propTypes2.default.bool
}, _class.defaultProps = {
    prefix: 'next-',
    rtl: false,
    pure: false,
    showLine: false,
    selectable: true,
    editable: false,
    multiple: false,
    checkable: false,
    checkStrictly: false,
    checkedStrategy: 'all',
    draggable: false,
    autoExpandParent: true,
    defaultExpandAll: false,
    defaultExpandedKeys: [],
    defaultCheckedKeys: [],
    defaultSelectedKeys: [],
    onExpand: noop,
    onCheck: noop,
    onSelect: noop,
    onDragStart: noop,
    onDragEnter: noop,
    onDragOver: noop,
    onDragLeave: noop,
    onDragEnd: noop,
    onDrop: noop,
    canDrop: function canDrop() {
        return true;
    },
    onEditFinish: noop,
    onRightClick: noop,
    isLabelBlock: false,
    isNodeBlock: false,
    animation: true,
    focusable: true,
    autoFocus: false,
    onItemFocus: noop,
    onItemKeyDown: noop,
    useVirtual: false,
    immutable: false
}, _temp);
Tree.displayName = 'Tree';
exports.default = (0, _reactLifecyclesCompat.polyfill)(Tree);
module.exports = exports['default'];
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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactLifecyclesCompat = require('react-lifecycles-compat');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _select = require('../select');

var _select2 = _interopRequireDefault(_select);

var _cascader = require('../cascader');

var _cascader2 = _interopRequireDefault(_cascader);

var _menu = require('../menu');

var _menu2 = _interopRequireDefault(_menu);

var _util = require('../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bindCtx = _util.func.bindCtx;
var pickOthers = _util.obj.pickOthers;
var getStyle = _util.dom.getStyle;


var normalizeValue = function normalizeValue(value) {
    if (value) {
        if (Array.isArray(value)) {
            return value;
        }

        return [value];
    }

    return [];
};

/**
 * CascaderSelect
 */
var CascaderSelect = (_temp = _class = function (_Component) {
    (0, _inherits3.default)(CascaderSelect, _Component);

    function CascaderSelect(props) {
        (0, _classCallCheck3.default)(this, CascaderSelect);

        var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call(this, props));

        _this.refreshValueDataCache = function (curValue) {
            if (curValue) {
                var valueArr = Array.isArray(curValue) ? curValue : [curValue];

                valueArr.length && Object.keys(_this._valueDataCache).forEach(function (v) {
                    if (!valueArr.includes(v)) {
                        delete _this._valueDataCache[v];
                    }
                });
            } else {
                _this._valueDataCache = {};
            }
        };

        _this.state = {
            value: normalizeValue('value' in props ? props.value : props.defaultValue),
            searchValue: '',
            visible: typeof props.visible === 'undefined' ? props.defaultVisible : props.visible
        };

        // ?????????????????????
        _this._valueDataCache = {};

        bindCtx(_this, ['handleVisibleChange', 'handleAfterOpen', 'handleSelect', 'handleChange', 'handleClear', 'handleRemove', 'handleSearch', 'getPopup', 'saveSelectRef', 'saveCascaderRef', 'handleKeyDown']);
        return _this;
    }

    CascaderSelect.getDerivedStateFromProps = function getDerivedStateFromProps(props) {
        var st = {};

        if ('value' in props) {
            st.value = normalizeValue(props.value);
        }
        if ('visible' in props) {
            st.visible = props.visible;
        }

        return st;
    };

    CascaderSelect.prototype.updateCache = function updateCache(dataSource) {
        var _this2 = this;

        this._v2n = {};
        this._p2n = {};
        var loop = function loop(data) {
            var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '0';
            return data.forEach(function (item, index) {
                var value = item.value,
                    children = item.children;

                var pos = prefix + '-' + index;
                _this2._v2n[value] = _this2._p2n[pos] = (0, _extends3.default)({}, item, { pos: pos });

                if (children && children.length) {
                    loop(children, pos);
                }
            });
        };

        loop(dataSource);
    };

    CascaderSelect.prototype.flatValue = function flatValue(value) {
        var _this3 = this;

        var getDepth = function getDepth(v) {
            var pos = _this3.getPos(v);
            if (!pos) {
                return 0;
            }
            return pos.split('-').length;
        };
        var newValue = value.slice(0).sort(function (prev, next) {
            return getDepth(prev) - getDepth(next);
        });

        for (var i = 0; i < newValue.length; i++) {
            for (var j = 0; j < newValue.length; j++) {
                if (i !== j && this.isDescendantOrSelf(this.getPos(newValue[i]), this.getPos(newValue[j]))) {
                    newValue.splice(j, 1);
                    j--;
                }
            }
        }

        return newValue;
    };

    CascaderSelect.prototype.isDescendantOrSelf = function isDescendantOrSelf(currentPos, targetPos) {
        if (!currentPos || !targetPos) {
            return false;
        }

        var currentNums = currentPos.split('-');
        var targetNums = targetPos.split('-');

        return currentNums.length <= targetNums.length && currentNums.every(function (num, index) {
            return num === targetNums[index];
        });
    };

    CascaderSelect.prototype.getValue = function getValue(pos) {
        return this._p2n[pos] ? this._p2n[pos].value : null;
    };

    CascaderSelect.prototype.getPos = function getPos(value) {
        return this._v2n[value] ? this._v2n[value].pos : null;
    };

    CascaderSelect.prototype.getData = function getData(value) {
        var _this4 = this;

        return value.map(function (v) {
            return _this4._v2n[v] || _this4._valueDataCache[v];
        });
    };

    CascaderSelect.prototype.getLabelPath = function getLabelPath(data) {
        var _this5 = this;

        var nums = data.pos.split('-');
        return nums.slice(1).reduce(function (ret, num, index) {
            var p = nums.slice(0, index + 2).join('-');
            ret.push(_this5._p2n[p].label);
            return ret;
        }, []);
    };

    CascaderSelect.prototype.getSingleData = function getSingleData(value) {
        if (!value.length) {
            return null;
        }

        if (Array.isArray(value)) value = value[0];

        var data = this._v2n[value];

        if (data) {
            var labelPath = this.getLabelPath(data);
            var displayRender = this.props.displayRender || function (labels) {
                return labels.join(' / ');
            };

            data = (0, _extends3.default)({}, data, {
                label: displayRender(labelPath, data)
            });

            this._valueDataCache[value] = data;
            this.refreshValueDataCache(value);
        } else {
            data = this._valueDataCache[value];
        }

        return data || {
            value: value
        };
    };

    CascaderSelect.prototype.getMultipleData = function getMultipleData(value) {
        var _this6 = this;

        if (!value.length) {
            return null;
        }

        var _props = this.props,
            checkStrictly = _props.checkStrictly,
            canOnlyCheckLeaf = _props.canOnlyCheckLeaf,
            displayRender = _props.displayRender;

        var flatValue = checkStrictly || canOnlyCheckLeaf ? value : this.flatValue(value);
        var data = flatValue.map(function (v) {
            var item = _this6._v2n[v];

            if (item) {
                _this6._valueDataCache[v] = item;
            } else {
                item = _this6._valueDataCache[v];
            }

            return item || { value: v };
        });

        if (displayRender) {
            data = data.map(function (item) {
                if (!item.pos || !(item.value in _this6._v2n)) {
                    return item;
                }

                var labelPath = _this6.getLabelPath(item);
                var newItem = (0, _extends3.default)({}, item, {
                    label: displayRender(labelPath, item)
                });

                _this6._valueDataCache[item.value] = newItem;

                return newItem;
            });
        }

        return data;
    };

    CascaderSelect.prototype.getIndeterminate = function getIndeterminate(value) {
        var _this7 = this;

        var indeterminate = [];

        var positions = value.map(this.getPos.bind(this));
        positions.forEach(function (pos) {
            if (!pos) {
                return false;
            }
            var nums = pos.split('-');
            for (var i = nums.length; i > 2; i--) {
                var parentPos = nums.slice(0, i - 1).join('-');
                var parentValue = _this7.getValue(parentPos);
                if (indeterminate.indexOf(parentValue) === -1) {
                    indeterminate.push(parentValue);
                }
            }
        });

        return indeterminate;
    };

    CascaderSelect.prototype.saveSelectRef = function saveSelectRef(ref) {
        this.select = ref;
    };

    CascaderSelect.prototype.saveCascaderRef = function saveCascaderRef(ref) {
        this.cascader = ref;
    };

    CascaderSelect.prototype.completeValue = function completeValue(value) {
        var newValue = [];

        var flatValue = this.flatValue(value).reverse();
        var ps = Object.keys(this._p2n);
        for (var i = 0; i < ps.length; i++) {
            for (var j = 0; j < flatValue.length; j++) {
                var v = flatValue[j];
                if (this.isDescendantOrSelf(this.getPos(v), ps[i])) {
                    newValue.push(this.getValue(ps[i]));
                    ps.splice(i, 1);
                    i--;
                    break;
                }
            }
        }

        return newValue;
    };

    CascaderSelect.prototype.isLeaf = function isLeaf(data) {
        return !(data.children && data.children.length || !!this.props.loadData && !data.isLeaf);
    };

    CascaderSelect.prototype.handleVisibleChange = function handleVisibleChange(visible, type) {
        var searchValue = this.state.searchValue;

        if (!('visible' in this.props)) {
            this.setState({
                visible: visible
            });
        }

        if (!visible && searchValue) {
            this.setState({
                searchValue: ''
            });
        }

        if (['fromCascader', 'keyboard'].indexOf(type) !== -1 && !visible) {
            this.select.focusInput();
        }

        this.props.onVisibleChange(visible, type);
    };

    CascaderSelect.prototype.handleKeyDown = function handleKeyDown(e) {
        var onKeyDown = this.props.onKeyDown;
        var visible = this.state.visible;


        if (onKeyDown) {
            onKeyDown(e);
        }

        if (!visible) {
            return;
        }

        switch (e.keyCode) {
            case _util.KEYCODE.UP:
            case _util.KEYCODE.DOWN:
                this.cascader.setFocusValue();
                e.preventDefault();
                break;
            default:
                break;
        }
    };

    CascaderSelect.prototype.getPopup = function getPopup(ref) {
        this.popup = ref;
        if (typeof this.props.popupProps.ref === 'function') {
            this.props.popupProps.ref(ref);
        }
    };

    CascaderSelect.prototype.handleAfterOpen = function handleAfterOpen() {
        if (!this.popup) {
            return;
        }

        var _props2 = this.props,
            prefix = _props2.prefix,
            popupProps = _props2.popupProps;

        var dropDownNode = this.popup.getInstance().overlay.getInstance().getContentNode();
        var cascaderNode = dropDownNode.querySelector('.' + prefix + 'cascader');
        if (cascaderNode) {
            this.cascaderHeight = getStyle(cascaderNode, 'height');
        }

        if (typeof popupProps.afterOpen === 'function') {
            popupProps.afterOpen();
        }
    };

    CascaderSelect.prototype.handleSelect = function handleSelect(value, data) {
        var _props3 = this.props,
            multiple = _props3.multiple,
            changeOnSelect = _props3.changeOnSelect;
        var _state = this.state,
            visible = _state.visible,
            searchValue = _state.searchValue;


        if (!multiple && (!changeOnSelect || this.isLeaf(data) || !!searchValue)) {
            this.handleVisibleChange(!visible, 'fromCascader');
        }
    };

    /**
     * ???????????????????????????????????????
     * @param {Arrary | String} curValue ?????????
     */


    CascaderSelect.prototype.handleChange = function handleChange(value, data, extra) {
        var _this8 = this;

        var _props4 = this.props,
            multiple = _props4.multiple,
            onChange = _props4.onChange;
        var _state2 = this.state,
            searchValue = _state2.searchValue,
            stateValue = _state2.value;


        var st = {};

        if (multiple && stateValue && Array.isArray(stateValue)) {
            var noExistedValues = stateValue.filter(function (v) {
                return !_this8._v2n[v];
            });

            value = [].concat(noExistedValues, value);
            // onChange ?????? data ????????????????????????????????? value ?????????
            // ??? dataSource ????????????????????????????????????value??????????????????????????????
            data = [].concat(noExistedValues.map(function (v) {
                return _this8._valueDataCache[v];
            }).filter(function (v) {
                return v;
            }), data).filter(function (current, index, arr) {
                return index === arr.indexOf(current);
            });
            // ????????????
            this.refreshValueDataCache(value);
        }

        if (!('value' in this.props)) {
            st.value = value;
        }
        if (!multiple && searchValue) {
            st.searchValue = '';
        }
        if (Object.keys(st).length) {
            this.setState(st);
        }

        if (onChange) {
            onChange(value, data, extra);
        }

        if (searchValue && this.select) {
            this.select.handleSearchClear();
        }
    };

    CascaderSelect.prototype.handleClear = function handleClear() {
        // ???????????????????????????
        var _props5 = this.props,
            hasClear = _props5.hasClear,
            multiple = _props5.multiple,
            treeCheckable = _props5.treeCheckable;

        if (hasClear && (!multiple || !treeCheckable)) {
            if (!('value' in this.props)) {
                this.setState({
                    value: []
                });
            }

            this.props.onChange(null, null);
        }
    };

    CascaderSelect.prototype.handleRemove = function handleRemove(currentData) {
        var currentValue = currentData.value;

        var value = void 0;

        var _props6 = this.props,
            multiple = _props6.multiple,
            checkStrictly = _props6.checkStrictly,
            onChange = _props6.onChange;

        if (multiple) {
            value = [].concat(this.state.value);
            value.splice(value.indexOf(currentValue), 1);

            if (this.props.onChange) {
                var data = this.getData(value);
                var checked = false;

                if (checkStrictly) {
                    this.props.onChange(value, data, {
                        checked: checked,
                        currentData: currentData,
                        checkedData: data
                    });
                } else {
                    var checkedValue = this.completeValue(value);
                    var checkedData = this.getData(checkedValue);
                    var indeterminateValue = this.getIndeterminate(value);
                    var indeterminateData = this.getData(indeterminateValue);
                    this.props.onChange(value, data, {
                        checked: checked,
                        currentData: currentData,
                        checkedData: checkedData,
                        indeterminateData: indeterminateData
                    });
                }
            }
        } else {
            value = [];
            onChange(null, null);
        }

        if (!('value' in this.props)) {
            this.setState({
                value: value
            });
        }

        this.refreshValueDataCache(value);
    };

    CascaderSelect.prototype.handleSearch = function handleSearch(searchValue) {
        this.setState({
            searchValue: searchValue
        });

        this.props.onSearch && this.props.onSearch(searchValue);
    };

    CascaderSelect.prototype.getPath = function getPath(pos) {
        var items = [];

        var nums = pos.split('-');
        if (nums === 2) {
            items.push(this._p2n[pos]);
        } else {
            for (var i = 1; i < nums.length; i++) {
                var p = nums.slice(0, i + 1).join('-');
                items.push(this._p2n[p]);
            }
        }

        return items;
    };

    CascaderSelect.prototype.filterItems = function filterItems() {
        var _this9 = this;

        var _props7 = this.props,
            multiple = _props7.multiple,
            changeOnSelect = _props7.changeOnSelect,
            canOnlyCheckLeaf = _props7.canOnlyCheckLeaf,
            filter = _props7.filter;
        var searchValue = this.state.searchValue;

        var items = Object.keys(this._p2n).map(function (p) {
            return _this9._p2n[p];
        });
        if (!multiple && !changeOnSelect || multiple && canOnlyCheckLeaf) {
            items = items.filter(function (item) {
                return !item.children || !item.children.length;
            });
        }

        return items.map(function (item) {
            return _this9.getPath(item.pos);
        }).filter(function (path) {
            return filter(searchValue, path);
        });
    };

    CascaderSelect.prototype.renderNotFound = function renderNotFound() {
        var _props8 = this.props,
            prefix = _props8.prefix,
            notFoundContent = _props8.notFoundContent;


        return _react2.default.createElement(
            _menu2.default,
            { className: prefix + 'cascader-select-not-found' },
            _react2.default.createElement(
                _menu2.default.Item,
                null,
                notFoundContent
            )
        );
    };

    CascaderSelect.prototype.renderCascader = function renderCascader() {
        var dataSource = this.props.dataSource;

        if (dataSource.length === 0) {
            return this.renderNotFound();
        }

        var searchValue = this.state.searchValue;

        var filteredPaths = [];

        if (searchValue) {
            filteredPaths = this.filterItems();
            if (filteredPaths.length === 0) {
                return this.renderNotFound();
            }
        }

        var _props9 = this.props,
            multiple = _props9.multiple,
            useVirtual = _props9.useVirtual,
            changeOnSelect = _props9.changeOnSelect,
            checkStrictly = _props9.checkStrictly,
            canOnlyCheckLeaf = _props9.canOnlyCheckLeaf,
            defaultExpandedValue = _props9.defaultExpandedValue,
            expandTriggerType = _props9.expandTriggerType,
            onExpand = _props9.onExpand,
            listStyle = _props9.listStyle,
            listClassName = _props9.listClassName,
            loadData = _props9.loadData,
            showSearch = _props9.showSearch,
            resultRender = _props9.resultRender,
            readOnly = _props9.readOnly,
            itemRender = _props9.itemRender,
            immutable = _props9.immutable;
        var value = this.state.value;


        var props = {
            dataSource: dataSource,
            value: value,
            multiple: multiple,
            useVirtual: useVirtual,
            canOnlySelectLeaf: !changeOnSelect,
            checkStrictly: checkStrictly,
            canOnlyCheckLeaf: canOnlyCheckLeaf,
            defaultExpandedValue: defaultExpandedValue,
            expandTriggerType: expandTriggerType,
            ref: this.saveCascaderRef,
            onExpand: onExpand,
            listStyle: listStyle,
            listClassName: listClassName,
            loadData: loadData,
            itemRender: itemRender,
            immutable: immutable
        };

        if ('expandedValue' in this.props) {
            props.expandedValue = this.props.expandedValue;
        }

        if (!readOnly) {
            props.onChange = this.handleChange;
            props.onSelect = this.handleSelect;
        }
        if (showSearch) {
            props.searchValue = searchValue;
            props.filteredPaths = filteredPaths;
            props.resultRender = resultRender;
            props.filteredListStyle = { height: this.cascaderHeight };
        }

        return _react2.default.createElement(_cascader2.default, props);
    };

    CascaderSelect.prototype.renderPopupContent = function renderPopupContent() {
        var _props10 = this.props,
            prefix = _props10.prefix,
            header = _props10.header,
            footer = _props10.footer;

        return _react2.default.createElement(
            'div',
            { className: prefix + 'cascader-select-dropdown' },
            header,
            this.renderCascader(),
            footer
        );
    };

    CascaderSelect.prototype.renderPreview = function renderPreview(others) {
        var _props11 = this.props,
            prefix = _props11.prefix,
            multiple = _props11.multiple,
            className = _props11.className,
            renderPreview = _props11.renderPreview;
        var value = this.state.value;

        var previewCls = (0, _classnames2.default)(className, prefix + 'form-preview');
        var items = (multiple ? this.getMultipleData(value) : this.getSingleData(value)) || [];

        if (!Array.isArray(items)) {
            items = [items];
        }

        if (typeof renderPreview === 'function') {
            return _react2.default.createElement(
                'div',
                (0, _extends3.default)({}, others, { className: previewCls }),
                renderPreview(items, this.props)
            );
        }

        return _react2.default.createElement(
            'p',
            (0, _extends3.default)({}, others, { className: previewCls }),
            items.map(function (_ref) {
                var label = _ref.label;
                return label;
            }).join(', ')
        );
    };

    CascaderSelect.prototype.render = function render() {
        var _props12 = this.props,
            prefix = _props12.prefix,
            size = _props12.size,
            hasArrow = _props12.hasArrow,
            hasBorder = _props12.hasBorder,
            hasClear = _props12.hasClear,
            label = _props12.label,
            readOnly = _props12.readOnly,
            placeholder = _props12.placeholder,
            dataSource = _props12.dataSource,
            disabled = _props12.disabled,
            multiple = _props12.multiple,
            className = _props12.className,
            showSearch = _props12.showSearch,
            popupStyle = _props12.popupStyle,
            popupClassName = _props12.popupClassName,
            popupContainer = _props12.popupContainer,
            popupProps = _props12.popupProps,
            followTrigger = _props12.followTrigger,
            isPreview = _props12.isPreview,
            resultAutoWidth = _props12.resultAutoWidth;
        var _state3 = this.state,
            value = _state3.value,
            searchValue = _state3.searchValue,
            visible = _state3.visible;

        var others = pickOthers(Object.keys(CascaderSelect.propTypes), this.props);

        this.updateCache(dataSource);

        if (isPreview) {
            return this.renderPreview(others);
        }

        var popupContent = this.renderPopupContent();

        var props = {
            prefix: prefix,
            className: className,
            size: size,
            placeholder: placeholder,
            disabled: disabled,
            hasArrow: hasArrow,
            hasBorder: hasBorder,
            hasClear: hasClear,
            label: label,
            readOnly: readOnly,
            ref: this.saveSelectRef,
            autoWidth: false,
            mode: multiple ? 'multiple' : 'single',
            value: multiple ? this.getMultipleData(value) : this.getSingleData(value),
            onChange: this.handleClear,
            onRemove: this.handleRemove,
            visible: visible,
            onVisibleChange: this.handleVisibleChange,
            showSearch: showSearch,
            onSearch: this.handleSearch,
            onKeyDown: this.handleKeyDown,
            popupContent: popupContent,
            popupStyle: popupStyle,
            popupClassName: popupClassName,
            popupContainer: popupContainer,
            popupProps: popupProps,
            followTrigger: followTrigger
        };

        if (showSearch) {
            props.popupProps = (0, _extends3.default)({}, popupProps, {
                ref: this.getPopup,
                afterOpen: this.handleAfterOpen
            });
            props.autoWidth = resultAutoWidth && !!searchValue;
        }

        return _react2.default.createElement(_select2.default, (0, _extends3.default)({}, props, others));
    };

    return CascaderSelect;
}(_react.Component), _class.propTypes = {
    prefix: _propTypes2.default.string,
    pure: _propTypes2.default.bool,
    className: _propTypes2.default.string,
    /**
     * ???????????????
     */
    size: _propTypes2.default.oneOf(['small', 'medium', 'large']),
    /**
     * ??????????????????
     */
    placeholder: _propTypes2.default.string,
    /**
     * ????????????
     */
    disabled: _propTypes2.default.bool,
    /**
     * ?????????????????????
     */
    hasArrow: _propTypes2.default.bool,
    /**
     * ???????????????
     */
    hasBorder: _propTypes2.default.bool,
    /**
     * ?????????????????????
     */
    hasClear: _propTypes2.default.bool,
    /**
     * ??????????????? label
     */
    label: _propTypes2.default.node,
    /**
     * ????????????????????????????????????????????????????????????
     */
    readOnly: _propTypes2.default.bool,
    /**
     * ???????????????????????????????????????
     */
    dataSource: _propTypes2.default.arrayOf(_propTypes2.default.object),
    /**
     * ????????????????????????
     */
    defaultValue: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.arrayOf(_propTypes2.default.string)]),
    /**
     * ?????????????????????
     */
    value: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.arrayOf(_propTypes2.default.string)]),
    /**
     * ???????????????????????????????????????
     * @param {String|Array} value ???????????????????????????????????????????????????????????????
     * @param {Object|Array} data ???????????????????????? value ??? label?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
     * @param {Object} extra ????????????
     * @param {Array} extra.selectedPath ?????????????????????????????????
     * @param {Boolean} extra.checked ???????????????????????????????????????????????????
     * @param {Object} extra.currentData ??????????????????????????????
     * @param {Array} extra.checkedData ?????????????????????????????????
     * @param {Array} extra.indeterminateData ????????????????????????
     */
    onChange: _propTypes2.default.func,
    /**
     * ????????????????????????????????????????????????????????? defaultValue/value ??????????????????
     */
    defaultExpandedValue: _propTypes2.default.arrayOf(_propTypes2.default.string),
    /**
     * ???????????????????????????
     */
    expandedValue: _propTypes2.default.arrayOf(_propTypes2.default.string),
    /**
     * ?????????????????????
     */
    expandTriggerType: _propTypes2.default.oneOf(['click', 'hover']),
    onExpand: _propTypes2.default.func,
    /**
     * ????????????????????????
     */
    useVirtual: _propTypes2.default.bool,
    /**
     * ????????????
     */
    multiple: _propTypes2.default.bool,
    /**
     * ???????????????????????????, ????????????????????????????????????
     */
    changeOnSelect: _propTypes2.default.bool,
    /**
     * ??????????????????????????????checkbox???????????????????????????????????????
     */
    canOnlyCheckLeaf: _propTypes2.default.bool,
    /**
     * ?????????????????????????????????
     */
    checkStrictly: _propTypes2.default.bool,
    /**
     * ????????????????????????
     */
    listStyle: _propTypes2.default.object,
    /**
     * ??????????????????
     */
    listClassName: _propTypes2.default.string,
    /**
     * ??????????????????????????????????????????????????????
     * @param {Array} label ???????????????????????????
     * @return {ReactNode} ??????????????????????????????
     * @default ????????????labelPath => labelPath.join(' / ')???????????????labelPath => labelPath[labelPath.length - 1]
     */
    displayRender: _propTypes2.default.func,
    /**
     * ?????? item ???????????????
     * @param {Object} item ???????????????item
     * @return {ReactNode} item node
     */
    itemRender: _propTypes2.default.func,
    /**
     * ?????????????????????
     */
    showSearch: _propTypes2.default.bool,
    /**
     * ?????????????????????
     * @param {String} searchValue ??????????????????
     * @param {Array} path ????????????
     * @return {Boolean} ????????????
     * @default ????????????????????????????????????????????????
     */
    filter: _propTypes2.default.func,
    /**
     * ??????????????????????????????
     * @param {String} value ??????
     * @version 1.23
     */
    onSearch: _propTypes2.default.func,
    /**
     * ?????????????????????????????????
     * @param {String} searchValue ??????????????????
     * @param {Array} path ????????????????????????
     * @return {ReactNode} ???????????????
     * @default ?????????????????? a / b / c ???????????????
     */
    resultRender: _propTypes2.default.func,
    /**
     * ??????????????????????????????????????????
     */
    resultAutoWidth: _propTypes2.default.bool,
    /**
     * ????????????????????????
     */
    notFoundContent: _propTypes2.default.node,
    /**
     * ????????????????????????
     * @param {Object} data ?????????????????????????????????
     */
    loadData: _propTypes2.default.func,
    /**
     * ????????????????????????
     */
    header: _propTypes2.default.node,
    /**
     * ????????????????????????
     */
    footer: _propTypes2.default.node,
    /**
     * ???????????????????????????
     */
    defaultVisible: _propTypes2.default.bool,
    /**
     * ???????????????????????????
     */
    visible: _propTypes2.default.bool,
    /**
     * ??????????????????????????????????????????????????????
     * @param {Boolean} visible ????????????
     * @param {String} type ?????????????????????????????????, fromTrigger ?????????trigger?????????????????? docClick ?????????document???????????????
     */
    onVisibleChange: _propTypes2.default.func,
    /**
     * ??????????????????????????????
     */
    popupStyle: _propTypes2.default.object,
    /**
     * ??????????????????????????????
     */
    popupClassName: _propTypes2.default.string,
    /**
     * ??????????????????????????????
     */
    popupContainer: _propTypes2.default.any,
    /**
     * ????????? Popup ???????????????
     */
    popupProps: _propTypes2.default.object,
    /**
     * ??????????????????
     */
    followTrigger: _propTypes2.default.bool,
    /**
     * ??????????????????
     */
    isPreview: _propTypes2.default.bool,
    /**
     * ?????????????????????????????????
     * @param {Array<data>} value ????????? { label: , value:}
     */
    renderPreview: _propTypes2.default.func,
    /**
     * ????????????????????????
     * @version 1.23
     */
    immutable: _propTypes2.default.bool
}, _class.defaultProps = {
    prefix: 'next-',
    pure: false,
    size: 'medium',
    disabled: false,
    hasArrow: true,
    hasBorder: true,
    hasClear: false,
    dataSource: [],
    defaultValue: null,
    expandTriggerType: 'click',
    onExpand: function onExpand() {},
    useVirtual: false,
    multiple: false,
    changeOnSelect: false,
    canOnlyCheckLeaf: false,
    checkStrictly: false,
    showSearch: false,
    filter: function filter(searchValue, path) {
        return path.some(function (item) {
            return String(item.label).toLowerCase().indexOf(String(searchValue).toLowerCase()) > -1;
        });
    },
    resultRender: function resultRender(searchValue, path) {
        var parts = [];
        path.forEach(function (item, i) {
            var reExp = searchValue.replace(/[-.+*?^$()[\]{}|\\]/g, function (v) {
                return '\\' + v;
            });

            var re = new RegExp(reExp, 'gi');
            var others = item.label.split(re);
            var matches = item.label.match(re);

            others.forEach(function (other, j) {
                if (other) {
                    parts.push(other);
                }
                if (j < others.length - 1) {
                    parts.push(_react2.default.createElement(
                        'em',
                        { key: i + '-' + j },
                        matches[j]
                    ));
                }
            });
            if (i < path.length - 1) {
                parts.push(' / ');
            }
        });
        return _react2.default.createElement(
            'span',
            null,
            parts
        );
    },
    resultAutoWidth: true,
    notFoundContent: 'Not Found',
    defaultVisible: false,
    onVisibleChange: function onVisibleChange() {},
    popupProps: {},
    immutable: false
}, _temp);
CascaderSelect.displayName = 'CascaderSelect';
exports.default = (0, _reactLifecyclesCompat.polyfill)(CascaderSelect);
module.exports = exports['default'];
import _typeof from 'babel-runtime/helpers/typeof';
import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

/* eslint-disable valid-jsdoc */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { polyfill } from 'react-lifecycles-compat';

import { func, obj, KEYCODE, env, str } from '../util';
import Tag from '../tag';
import Input from '../input';
import Icon from '../icon';
import zhCN from '../locale/zh-cn';
import Base from './base';
import { isNull, getValueDataSource, valueToSelectKey } from './util';

var bindCtx = func.bindCtx,
    noop = func.noop;

var isIE9 = env.ieVersion === 9;

/**
 * 无障碍化注意事项:
 * 1. Select 无搜索情况下，不应该让 Input 可focus，此时外层wrap必须可focus，并且需要相应focus事件让外边框发生变化
 *
 * TODO: hightLight 后续改造注意点
 * 1. hightLight 跟随点击变化(fixed) 2. 弹窗打开时根据 是否高亮第一个选项的 api开关设置是否hightLight 第一项
 */

// 自定义弹层：1. 不需要关心Menu的点击事件 2. 不需要关心dataSource变化

/**
 * Select
 */
var Select = (_temp = _class = function (_Base) {
    _inherits(Select, _Base);

    function Select(props) {
        _classCallCheck(this, Select);

        // because dataSource maybe updated while select a item, so we should cache choosen value's item
        var _this = _possibleConstructorReturn(this, _Base.call(this, props));

        _this.handleWrapClick = function (e) {
            // ignore click on input to choose text
            if (e.target.nodeName !== 'INPUT') {
                e.preventDefault();
            }
            _this.focusInput();
        };

        _this.handleArrowClick = function (e) {
            e.preventDefault();
            _this.focusInput();

            // because of can not close Popup by click Input while hasSearch.
            // so when Popup open and hasSearch, we should close Popup intentionally
            _this.state.visible && _this.hasSearch() && _this.setVisible(false);
        };

        _this.handleClear = function (e) {
            e.stopPropagation();
            _this.handleChange(undefined, 'clear');
        };

        _this.valueDataSource = {
            valueDS: [], // [{value,label}]
            mapValueDS: {} // {value: {value,label}}
        };

        var searchValue = 'searchValue' in props ? props.searchValue : '';

        _this.dataStore.setOptions({
            key: searchValue,
            addonKey: props.mode === 'tag' // tag 模式手动输入的数据
        });

        _extends(_this.state, {
            searchValue: searchValue,
            dataSource: _this.setDataSource(props)
        });

        // 根据value和计算后的dataSource，更新value对应的详细数据valueDataSource
        if (typeof _this.state.value !== 'undefined') {
            _this.valueDataSource = getValueDataSource(_this.state.value, _this.valueDataSource.mapValueDS, _this.dataStore.getMapDS());
        }

        bindCtx(_this, ['handleMenuSelect', 'handleItemClick', 'handleSearch', 'handleSearchKeyDown', 'handleSelectAll', 'maxTagPlaceholder']);
        return _this;
    }

    Select.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, prevState) {
        var state = {};

        if ('value' in nextProps && nextProps.value !== prevState.value) {
            _extends(state, {
                value: nextProps.value
            });
        }

        if ('highlightKey' in nextProps && nextProps.highlightKey !== prevState.highlightKey) {
            _extends(state, {
                highlightKey: nextProps.highlightKey
            });
        }

        if ('searchValue' in nextProps && nextProps.searchValue !== prevState.searchValue) {
            var searchValue = nextProps.searchValue;
            _extends(state, {
                searchValue: searchValue === undefined || searchValue === null ? '' : searchValue
            });
        }

        if ('visible' in nextProps && nextProps.visible !== prevState.visible) {
            _extends(state, {
                visible: nextProps.visible
            });
        }

        if (Object.keys(state).length) {
            return state;
        }

        return null;
    };

    Select.prototype.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
        var props = this.props;
        if ('searchValue' in props && this.state.searchValue !== prevState.searchValue) {
            this.dataStore.setOptions({ key: this.state.searchValue });
        }

        if (props.mode !== prevProps.mode) {
            this.dataStore.setOptions({
                addonKey: props.mode === 'tag'
            });
        }
        if (props.mode !== prevProps.mode) {
            this.dataStore.setOptions({
                addonKey: props.mode === 'tag'
            });
        }
        if (props.filter !== prevProps.filter) {
            this.dataStore.setOptions({
                filter: props.filter
            });
        }
        if (props.filterLocal !== prevProps.filterLocal) {
            this.dataStore.setOptions({
                filterLocal: props.filterLocal
            });
        }

        if (prevProps.children !== props.children || prevProps.dataSource !== props.dataSource) {
            /* eslint-disable react/no-did-update-set-state */
            this.setState({
                dataSource: this.setDataSource(props)
            });

            if (!props.popupContent) {
                this.setFirstHightLightKeyForMenu();
            }
        }

        if ('value' in props) {
            this.valueDataSource = getValueDataSource(props.value, this.valueDataSource.mapValueDS, this.dataStore.getMapDS());
            this.updateSelectAllYet(this.valueDataSource.value);
        } else if ('defaultValue' in props && props.defaultValue === this.valueDataSource.value && (props.children !== prevProps.children || props.dataSource !== prevProps.dataSource)) {
            // has defaultValue and value not changed and dataSource changed
            // fix: set defaultValue first, then update dataSource.
            this.valueDataSource = getValueDataSource(props.defaultValue, this.valueDataSource.mapValueDS, this.dataStore.getMapDS());
        }

        if (prevProps.label !== this.props.label || prevState.value !== this.state.value || props.searchValue !== this.state.searchValue) {
            this.syncWidth();
        }
    };

    Select.prototype.componentDidMount = function componentDidMount() {
        if (isIE9) {
            this.ie9Hack();
        }
        _Base.prototype.componentDidMount.call(this);
    };

    // ie9 下 table-cell 布局不支持宽度超出隐藏


    Select.prototype.ie9Hack = function ie9Hack() {
        try {
            var width = this.selectDOM.currentStyle.width;
            this.setState({
                fixWidth: width !== 'auto'
            });
        } catch (e) {
            //
        }
    };

    Select.prototype.useDetailValue = function useDetailValue() {
        var _props = this.props,
            popupContent = _props.popupContent,
            useDetailValue = _props.useDetailValue,
            dataSource = _props.dataSource;

        return useDetailValue || popupContent && !dataSource;
    };

    Select.prototype.hasSearch = function hasSearch() {
        var _props2 = this.props,
            showSearch = _props2.showSearch,
            mode = _props2.mode;

        return showSearch || mode === 'tag';
    };

    Select.prototype.getTagSize = function getTagSize() {
        var _props3 = this.props,
            size = _props3.size,
            adjustTagSize = _props3.adjustTagSize;

        if (adjustTagSize) {
            return size;
        }
        return size === 'large' ? 'medium' : 'small';
    };

    /**
     * Menu.Item onSelect
     * @private
     * @param  {Array<string>} keys
     * @
     */


    Select.prototype.handleMenuSelect = function handleMenuSelect(keys, item) {
        var _props4 = this.props,
            mode = _props4.mode,
            readOnly = _props4.readOnly,
            disabled = _props4.disabled;


        if (readOnly || disabled) {
            return false;
        }

        var isSingle = mode === 'single';

        if (isSingle) {
            // 单选
            return this.handleSingleSelect(keys[0], 'itemClick');
        } else {
            // 正常多选
            return this.handleMultipleSelect(keys, 'itemClick', item.props && item.props._key);
        }
    };

    Select.prototype.handleItemClick = function handleItemClick() {
        if (!this.props.popupAutoFocus) {
            this.focusInput();
        }
    };

    /**
     * 单选模式
     */


    Select.prototype.handleSingleSelect = function handleSingleSelect(key, triggerType) {
        // TODO: 这里 cacheValue=false 有问题，dataSource 更新的时候就应该处理
        var cacheValue = this.props.cacheValue;
        // get data only from dataStore while cacheValue=false

        var itemObj = getValueDataSource(key, cacheValue ? this.valueDataSource.mapValueDS : {}, this.dataStore.getMapDS());
        this.valueDataSource = itemObj;

        this.setVisible(false, triggerType);

        if (this.useDetailValue()) {
            return this.handleChange(itemObj.valueDS, triggerType);
        } else {
            this.handleChange(itemObj.value, triggerType, itemObj.valueDS);
        }

        this.setState({
            highlightKey: key
        });

        // 清空搜索
        if (!('searchValue' in this.props) && this.state.searchValue) {
            this.handleSearchClear(triggerType);
        }
    };

    /**
     * 多选模式 multiple/tag
     */


    Select.prototype.handleMultipleSelect = function handleMultipleSelect(keys, triggerType, key, keepSearchValue) {
        var _this2 = this;

        var itemObj = getValueDataSource(keys, this.valueDataSource.mapValueDS, this.dataStore.getMapDS());

        var _props5 = this.props,
            cacheValue = _props5.cacheValue,
            mode = _props5.mode,
            hiddenSelected = _props5.hiddenSelected;

        // cache those value maybe not exists in dataSource

        if (cacheValue || mode === 'tag') {
            this.valueDataSource = itemObj;
        }

        if (hiddenSelected) {
            this.setVisible(false, triggerType);
        }

        // 因为搜索后会设置 hightLight 为第一个item，menu渲染会自动滚动到 hightLight 的元素上面。
        // 所以设置 hightLight 为当前选中项避免滚动
        key && this.state.visible && this.setState({
            highlightKey: key
        });

        if (this.useDetailValue()) {
            this.handleChange(itemObj.valueDS, triggerType);
        } else {
            this.handleChange(itemObj.value, triggerType, itemObj.valueDS);
        }

        this.updateSelectAllYet(itemObj.value);

        // 清空搜索
        if (!('searchValue' in this.props) && this.state.searchValue && !keepSearchValue) {
            // 因为 SearchValue 被 clear 后会重新渲染 Menu，所以在 Overlay 检测 safeNode 的时候 e.target 可能会找不到导致弹窗关闭
            setTimeout(function () {
                _this2.handleSearchClear(triggerType);
            });
        }
    };

    Select.prototype.updateSelectAllYet = function updateSelectAllYet(value) {
        var _this3 = this;

        // multiple mode
        // is current state select all or not
        this.selectAllYet = false;
        if (this.props.hasSelectAll && Array.isArray(value)) {
            var selectAllValues = this.dataStore.getEnableDS().map(function (item) {
                return item.value;
            });

            if (selectAllValues.length <= value.length) {
                this.selectAllYet = true;

                selectAllValues.forEach(function (val) {
                    if (value.indexOf(val) === -1) {
                        _this3.selectAllYet = false;
                        return;
                    }
                });
            }
        }
    };

    Select.prototype.handleSearchValue = function handleSearchValue(value) {
        if (this.state.searchValue === value) {
            return;
        }

        var filterLocal = this.props.filterLocal;


        if (filterLocal) {
            if (!('searchValue' in this.props)) {
                this.setState({
                    searchValue: value,
                    dataSource: this.dataStore.updateByKey(value)
                });
                this.setFirstHightLightKeyForMenu();
            }
        } else if (!('searchValue' in this.props)) {
            this.setState({
                searchValue: value
            });
        }
    };

    /**
     * Handle search input change event
     * @param {String} value search text
     * @param {Event} e change Event
     */


    Select.prototype.handleSearch = function handleSearch(value, e) {
        this.handleSearchValue(value);

        // inputing should trigger popup open
        if (!this.state.visible && value) {
            this.setVisible(true);
        }

        this.props.onSearch(value, e);
    };

    Select.prototype.handleSearchClear = function handleSearchClear(triggerType) {
        this.handleSearchValue('');
        this.props.onSearchClear(triggerType);
    };

    // 搜索框 keyDown 事件


    Select.prototype.handleSearchKeyDown = function handleSearchKeyDown(e) {
        var _props6 = this.props,
            popupContent = _props6.popupContent,
            onKeyDown = _props6.onKeyDown,
            showSearch = _props6.showSearch,
            mode = _props6.mode,
            hasClear = _props6.hasClear,
            onToggleHighlightItem = _props6.onToggleHighlightItem,
            readOnly = _props6.readOnly,
            disabled = _props6.disabled;


        var hasSearch = this.hasSearch();

        if (popupContent) {
            // 搜索的时候不阻止冒泡会无法输入
            if (hasSearch && e.keyCode === KEYCODE.SPACE) {
                e.stopPropagation();
            }
            return onKeyDown(e);
        }

        var proxy = 'search';

        switch (e.keyCode) {
            case KEYCODE.UP:
                e.preventDefault();
                onToggleHighlightItem(this.toggleHighlightItem(-1, e), 'up');
                break;
            case KEYCODE.DOWN:
                e.preventDefault();
                onToggleHighlightItem(this.toggleHighlightItem(1, e), 'down');
                break;
            case KEYCODE.ENTER:
                e.preventDefault();
                if (readOnly || disabled) {
                    break;
                }
                this.chooseHighlightItem(proxy, e);
                break;
            case KEYCODE.ESC:
                e.preventDefault();
                this.state.visible && this.setVisible(false, 'keyDown');
                break;
            case KEYCODE.SPACE:
                e.stopPropagation();
                !hasSearch && e.preventDefault();
                break;
            case KEYCODE.BACKSPACE:
                if (readOnly || disabled) {
                    break;
                }
                if (mode === 'multiple' && showSearch || mode === 'tag') {
                    // 在多选并且有搜索的情况下，删除最后一个 tag
                    var valueDS = this.valueDataSource.valueDS;
                    if (valueDS && valueDS.length && !valueDS[valueDS.length - 1].disabled) {
                        this.handleDeleteTag(e);
                    }
                } else if (mode === 'single' && hasClear && !this.state.visible) {
                    // 单选、非展开、并且可清除的情况，允许按删除键清除
                    this.handleClear(e);
                }
                break;
            default:
                break;
        }

        onKeyDown(e);
    };

    Select.prototype.chooseMultipleItem = function chooseMultipleItem(key) {
        var value = this.state.value || [];
        var keys = value.map(function (v) {
            return valueToSelectKey(v);
        });

        var keepSearchValue = false;

        var index = keys.map(function (v) {
            return '' + v;
        }).indexOf(key);

        if (index > -1) {
            // unselect
            keys.splice(index, 1);
            keepSearchValue = true; // 回车反选保留搜索值
        } else {
            // select
            keys.push(key);
        }

        this.handleMultipleSelect(keys, 'enter', null, keepSearchValue);
    };

    // 回车 选择高亮的 item


    Select.prototype.chooseHighlightItem = function chooseHighlightItem(proxy, e) {
        var mode = this.props.mode;


        if (!this.state.visible) {
            // input tag by itself
            if (mode === 'tag' && this.state.searchValue) {
                this.chooseMultipleItem(this.state.searchValue);
            }
            return false;
        }

        var highlightKey = this.state.highlightKey;

        // 没有高亮选项 或者 没有可选菜单

        if (highlightKey === null || !this.dataStore.getMenuDS().length) {
            return;
        }

        if (mode === 'single') {
            this.handleSingleSelect(highlightKey, 'enter');
        } else {
            this.chooseMultipleItem(highlightKey);
            // 阻止事件冒泡到最外层，让Popup 监听到触发弹层关闭
            e && e.stopPropagation();
        }
    };

    /**
     * Handle Tag close event
     * @param  {Object} item
     * @return {Boolean} false  return false to prevent auto close
     * ----
     * It MUST be multiple mode, needn't additional judgement
     */


    Select.prototype.handleTagClose = function handleTagClose(item) {
        var readOnly = this.props.readOnly;

        if (readOnly) return false;
        if (this.useDetailValue()) {
            var value = this.state.value.filter(function (v) {
                return item.value !== v.value;
            });

            this.handleChange(value, 'tag');
        } else {
            // filter out current item, and then call handleMenuSelect
            var _value = this.state.value.filter(function (v) {
                return item.value !== v;
            });

            this.handleMultipleSelect(_value, 'tag');
        }

        this.props.onRemove(item);

        // prevent tag close
        return false;
    };

    // eslint-disable-next-line valid-jsdoc
    /**
     * Handle BACKSPACE key event
     * @param {Event} e keyDown event
     * ---
     * It MUST be multiple mode
     */


    Select.prototype.handleDeleteTag = function handleDeleteTag(e) {
        var value = this.state.value;
        var searchValue = this.state.searchValue;

        if (searchValue || !value || !value.length) {
            return false;
        }

        e.preventDefault();

        var nextValues = value.slice(0, value.length - 1);
        // 手动调用 handleMenuSelect 时直接传入原生的 value，可以减少 toString 的操作

        if (this.useDetailValue()) {
            this.handleChange(nextValues, 'tag');
        } else {
            this.handleMultipleSelect(nextValues, 'tag');
        }
    };

    /**
     * Handle SelectAll span click event
     * @param {Event} e click event
     */


    Select.prototype.handleSelectAll = function handleSelectAll(e) {
        e && e.preventDefault();
        var nextValues = void 0;

        if (this.selectAllYet) {
            nextValues = [];
        } else {
            nextValues = this.dataStore.getEnableDS().map(function (item) {
                return item.value;
            });
        }

        // 直接传 values，减少 toString 操作
        this.handleMultipleSelect(nextValues, 'selectAll');
    };

    Select.prototype.handleVisibleChange = function handleVisibleChange(visible, type) {
        this.setVisible(visible, type);
    };

    Select.prototype.afterClose = function afterClose() {
        // 关闭的时候清空搜索值
        if (this.hasSearch()) {
            this.handleSearchClear('popupClose');
        }
    };

    Select.prototype.maxTagPlaceholder = function maxTagPlaceholder(selectedValues, totalValues) {
        var locale = this.props.locale;


        return '' + str.template(locale.maxTagPlaceholder, {
            selected: selectedValues.length,
            total: totalValues.length
        });
    };

    /**
     * 如果用户是自定义的弹层，则直接以 value 为准，不再校验 dataSource
     * TODO: 2.0 中 value 接受 string/object{value,label} 两种类型的数据，自动做识别，可以避免用户去转换，也和 date-picker 对齐
     * 此外 onChange 第一个参数根据 api 来控制类型是 [string] 还是 [object{value,label}]
     * @param {object} props
     */


    Select.prototype.renderValues = function renderValues() {
        var _this4 = this;

        var _props7 = this.props,
            prefix = _props7.prefix,
            mode = _props7.mode,
            valueRender = _props7.valueRender,
            fillProps = _props7.fillProps,
            disabled = _props7.disabled,
            maxTagCount = _props7.maxTagCount,
            maxTagPlaceholder = _props7.maxTagPlaceholder,
            tagInline = _props7.tagInline,
            tagClosable = _props7.tagClosable;

        var tagSize = this.getTagSize();
        var value = this.state.value;

        if (isNull(value)) {
            return null;
        }

        // get detail value
        if (!this.useDetailValue()) {
            if (value === this.valueDataSource.value) {
                value = this.valueDataSource.valueDS;
            } else {
                value = getValueDataSource(value, this.valueDataSource.mapValueDS, this.dataStore.getMapDS()).valueDS;
            }
        }

        if (mode === 'single') {
            if (!value) {
                return null;
            }

            var retvalue = fillProps && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && fillProps in value ? value[fillProps] : valueRender(value);
            // 0 => '0'
            return typeof retvalue === 'number' ? retvalue.toString() : retvalue;
        } else if (value) {
            var limitedCountValue = value;
            var maxTagPlaceholderEl = void 0;
            var totalValue = this.dataStore.getFlattenDS();
            var holder = 'maxTagPlaceholder' in this.props ? maxTagPlaceholder : this.maxTagPlaceholder;

            if (maxTagCount !== undefined && value.length > maxTagCount && !tagInline) {
                limitedCountValue = limitedCountValue.slice(0, maxTagCount);
                maxTagPlaceholderEl = React.createElement(
                    Tag,
                    { key: '_count', type: 'primary', size: tagSize, animation: false },
                    holder(value, totalValue)
                );
            }

            if (value.length > 0 && tagInline) {
                maxTagPlaceholderEl = React.createElement(
                    'div',
                    { className: prefix + 'select-tag-compact', key: '_count' },
                    holder(value, totalValue)
                );
            }

            value = limitedCountValue;
            if (!Array.isArray(value)) {
                value = [value];
            }

            var selectedValueNodes = value.map(function (v) {
                if (!v) {
                    return null;
                }
                var labelNode = fillProps ? v[fillProps] : valueRender(v);

                return React.createElement(
                    Tag,
                    {
                        key: v.value,
                        disabled: disabled || v.disabled,
                        type: 'primary',
                        size: tagSize,
                        animation: false,
                        onClose: _this4.handleTagClose.bind(_this4, v),
                        closable: tagClosable
                    },
                    labelNode
                );
            });

            if (maxTagPlaceholderEl) {
                if (tagInline) {
                    selectedValueNodes.unshift(maxTagPlaceholderEl);
                } else {
                    selectedValueNodes.push(maxTagPlaceholderEl);
                }
            }
            return selectedValueNodes;
        }

        return null;
    };
    /**
     * 1. fix flash while click <label/>
     * 2. fix onBlur while has clear
     * @returns
     */


    Select.prototype.hasClear = function hasClear() {
        var _props8 = this.props,
            hasClear = _props8.hasClear,
            readOnly = _props8.readOnly,
            disabled = _props8.disabled,
            showSearch = _props8.showSearch;
        var _state = this.state,
            value = _state.value,
            visible = _state.visible;


        return typeof value !== 'undefined' && value !== null && hasClear && !readOnly && !disabled && !(showSearch && visible);
    };

    /**
     * render arrow
     * @param {object} props
     * @param {function} [clickHandler]
     */


    Select.prototype.renderExtraNode = function renderExtraNode() {
        var _props9 = this.props,
            hasArrow = _props9.hasArrow,
            hasClear = _props9.hasClear,
            prefix = _props9.prefix;


        var ret = [];

        if (hasArrow) {
            ret.push(React.createElement(
                'span',
                { key: 'arrow', 'aria-hidden': true, onClick: this.handleArrowClick, className: prefix + 'select-arrow' },
                React.createElement(Icon, { type: 'arrow-down', className: prefix + 'select-symbol-fold' })
            ));
        }

        // do not use this.hasClear() here, to make sure clear btn always exists, can not influenced by apis like `disabled` `readOnly`
        if (hasClear) {
            ret.push(React.createElement(
                'span',
                { key: 'clear', 'aria-hidden': true, onClick: this.handleClear, className: prefix + 'select-clear' },
                React.createElement(Icon, { type: 'delete-filling' })
            ));
        }

        return ret;
    };

    /**
     * 选择器
     * @override
     * @param {object} props
     */


    Select.prototype.renderSelect = function renderSelect() {
        var _classNames,
            _this5 = this;

        var _props10 = this.props,
            prefix = _props10.prefix,
            showSearch = _props10.showSearch,
            placeholder = _props10.placeholder,
            mode = _props10.mode,
            size = _props10.size,
            className = _props10.className,
            style = _props10.style,
            readOnly = _props10.readOnly,
            disabled = _props10.disabled,
            hasBorder = _props10.hasBorder,
            label = _props10.label,
            locale = _props10.locale,
            state = _props10.state,
            onBlur = _props10.onBlur,
            onFocus = _props10.onFocus,
            onMouseEnter = _props10.onMouseEnter,
            onMouseLeave = _props10.onMouseLeave,
            rtl = _props10.rtl;

        var others = obj.pickOthers(Select.propTypes, this.props);
        var othersData = obj.pickAttrsWith(others, 'data-');

        var visible = this.state.visible;
        var isSingle = mode === 'single';
        var hasSearch = this.hasSearch();
        var valueNodes = this.renderValues();

        // compatible with selectPlaceHolder. TODO: removed in 2.0 version
        var _placeholder = placeholder || locale.selectPlaceholder || locale.selectPlaceHolder;
        if (valueNodes && valueNodes.length) {
            _placeholder = null;
        }

        // 弹窗展开时将当前的值作为 placeholder，这个功能的前提是 valueNode 必须是一个字符串
        if (showSearch && visible && isSingle && typeof valueNodes === 'string') {
            _placeholder = valueNodes;
        }

        // 下拉箭头
        var extra = this.renderExtraNode();

        var triggerClazz = classNames([prefix + 'select', prefix + 'select-trigger', prefix + 'select-' + mode, '' + prefix + size, className], (_classNames = {}, _classNames[prefix + 'active'] = visible, _classNames[prefix + 'inactive'] = !visible, _classNames[prefix + 'no-search'] = !hasSearch, _classNames[prefix + 'has-search'] = hasSearch, _classNames[prefix + 'select-in-ie'] = isIE9, _classNames[prefix + 'select-in-ie-fixwidth'] = this.state.fixWidth, _classNames[prefix + 'has-clear'] = this.hasClear(), _classNames));

        var valuetext = this.valueDataSource.valueDS ? this.valueDataSource.valueDS.label : '';
        return React.createElement(
            'span',
            _extends({}, othersData, {
                className: triggerClazz,
                style: style,
                dir: rtl ? 'rtl' : undefined,
                ref: this.saveSelectRef,
                onClick: this.handleWrapClick,
                onMouseEnter: onMouseEnter,
                onMouseLeave: onMouseLeave,
                onMouseDown: this.handleWrapClick
            }),
            React.createElement(Input, _extends({
                'aria-valuetext': valuetext
            }, obj.pickOthers(othersData, others), {
                role: 'combobox',
                tabIndex: 0,
                'aria-expanded': this.state.visible,
                'aria-disabled': disabled,
                state: state,
                label: label,
                extra: extra,
                value: this.state.searchValue,
                size: size,
                readOnly: !this.hasSearch() || readOnly,
                disabled: disabled,
                placeholder: _placeholder,
                hasBorder: hasBorder,
                hasClear: false,
                htmlSize: '1',
                inputRender: function inputRender(inputEl) {
                    return _this5.renderSearchInput(valueNodes, _placeholder, inputEl);
                },
                onChange: this.handleSearch,
                onKeyDown: this.handleSearchKeyDown,
                onFocus: onFocus,
                onBlur: onBlur,
                className: prefix + 'select-inner',
                ref: this.saveInputRef
            })),
            React.createElement(
                'span',
                { className: prefix + 'sr-only', 'aria-live': 'polite' },
                this.state.srReader
            )
        );
    };

    Select.prototype.renderSearchInput = function renderSearchInput(valueNodes, placeholder, inputEl) {
        var _classNames2;

        var _props11 = this.props,
            prefix = _props11.prefix,
            mode = _props11.mode,
            tagInline = _props11.tagInline;

        var isSingle = mode === 'single';

        var mirrorText = this.state.searchValue;

        var cls = classNames((_classNames2 = {}, _classNames2[prefix + 'select-values'] = true, _classNames2[prefix + 'input-text-field'] = true, _classNames2[prefix + 'select-compact'] = !isSingle && tagInline, _classNames2));
        var title = typeof valueNodes === 'string' ? valueNodes : '';
        var searchInput = [isSingle && valueNodes ? React.createElement(
            'em',
            { title: title, key: 'select-value' },
            valueNodes
        ) : valueNodes];
        var triggerSearch = React.createElement(
            'span',
            { key: 'trigger-search', className: prefix + 'select-trigger-search' },
            inputEl,
            React.createElement(
                'span',
                { 'aria-hidden': true },
                React.createElement(
                    'span',
                    null,
                    mirrorText || placeholder
                ),
                React.createElement(
                    'span',
                    null,
                    '\xA0'
                )
            )
        );

        if (!isSingle && tagInline) {
            searchInput.unshift(triggerSearch);
        } else {
            searchInput.push(triggerSearch);
        }

        return React.createElement(
            'span',
            { className: cls },
            searchInput
        );
    };

    /**
     * 渲染弹层的 header 内容
     * @override
     * @param {object} props
     */


    Select.prototype.renderMenuHeader = function renderMenuHeader() {
        var _classNames3, _classNames4;

        var _props12 = this.props,
            prefix = _props12.prefix,
            hasSelectAll = _props12.hasSelectAll,
            mode = _props12.mode,
            locale = _props12.locale,
            menuProps = _props12.menuProps;


        if (menuProps && 'header' in menuProps) {
            return menuProps.header;
        }

        var sourceCount = this.dataStore.getEnableDS().length;
        // 多选模式下才有全选
        if (!hasSelectAll || mode === 'single' || !sourceCount) {
            return null;
        }

        var text = typeof hasSelectAll === 'boolean' ? locale.selectAll : hasSelectAll;

        var selectAllYet = this.selectAllYet;

        var cls = classNames((_classNames3 = {}, _classNames3[prefix + 'select-all'] = true, _classNames3[prefix + 'selected'] = selectAllYet, _classNames3));

        var clsInner = classNames((_classNames4 = {}, _classNames4[prefix + 'select-all-inner'] = true, _classNames4));

        // remove style={{'lineHeight': 'unset'}} in next Y
        // remove style={{'display': 'none'}} in next Y
        return React.createElement(
            'div',
            { key: 'all', onClick: this.handleSelectAll, className: cls, style: { lineHeight: 'unset' } },
            selectAllYet ? React.createElement(Icon, { className: prefix + 'menu-icon-selected', style: { display: 'none' }, type: 'select' }) : null,
            React.createElement(
                'span',
                { className: clsInner },
                text
            )
        );
    };

    Select.prototype.render = function render() {
        var mode = this.props.mode;

        var props = _extends({}, this.props);

        // forbid to close Popup by click Input while hasSearch
        if (this.hasSearch()) {
            props.canCloseByTrigger = false;
        }
        if (mode === 'single') {
            props.cache = true;
        }
        return _Base.prototype.render.call(this, props);
    };

    return Select;
}(Base), _class.propTypes = _extends({}, Base.propTypes, {
    /**
     * 选择器模式
     */
    mode: PropTypes.oneOf(['single', 'multiple', 'tag']),
    /**
     * 当前值，用于受控模式
     */
    value: PropTypes.any,
    /**
     * 初始的默认值
     */
    defaultValue: PropTypes.any,
    /**
     * Select发生改变时触发的回调
     * @param {*} value 选中的值
     * @param {String} actionType 触发的方式, 'itemClick', 'enter', 'tag'
     * @param {*} item 选中的值的对象数据 (useDetailValue=false有效)
     */
    onChange: PropTypes.func,
    /**
     * 传入的数据源，可以动态渲染子项，详见 [dataSource的使用](#dataSource的使用)
     */
    dataSource: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.shape({
        value: PropTypes.any,
        label: PropTypes.any,
        disabled: PropTypes.bool,
        children: PropTypes.array
    }), PropTypes.bool, PropTypes.number, PropTypes.string])),
    /**
     * 是否有边框
     */
    hasBorder: PropTypes.bool,
    /**
     * 是否有下拉箭头
     */
    hasArrow: PropTypes.bool,
    /**
     * 展开后是否能搜索（tag 模式下固定为true）
     */
    showSearch: PropTypes.bool,
    /**
     * 当搜索框值变化时回调
     * @param {String} value 数据
     */
    onSearch: PropTypes.func,
    /**
     * 当搜索框值被(选择、弹窗关闭)导致清空时候的回调
     * @param {String} actionType 触发的方式, 'select'(选择清空), 'popupClose'(弹窗关闭清空)
     */
    onSearchClear: PropTypes.func,
    /**
     * 多选模式下是否有全选功能
     */
    hasSelectAll: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    /**
     * 填充到选择框里的值的 key
     */
    fillProps: PropTypes.string,
    /**
     * value 使用对象类型 `{value, label}`, 同时 onChange 第一个参数返回也修改为 dataSource 中的对象
     */
    useDetailValue: PropTypes.bool,
    /**
     * dataSource 变化的时是否保留已选的内容
     */
    cacheValue: PropTypes.bool,
    /**
     * 渲染 Select 展现内容的方法
     * @param {Object} item 渲染节点的item
     * @return {ReactNode} 展现内容
     * @default item => `item.label || item.value`
     */
    valueRender: PropTypes.func,
    /**
     * 渲染 MenuItem 内容的方法
     * @param {Object} item 渲染节点的item
     * @param {String} searchValue 搜索关键字（如果开启搜索）
     * @return {ReactNode} item node
     */
    itemRender: PropTypes.func,
    /**
     * 弹层内容为空的文案
     */
    notFoundContent: PropTypes.node,
    style: PropTypes.object,
    /**
     * 受控搜索值，一般不需要设置
     * @type {[type]}
     */
    searchValue: PropTypes.string,
    /**
     * 是否一行显示，仅在 mode 为 multiple 的时候生效
     * @version 1.15
     */
    tagInline: PropTypes.bool,
    /**
     * tag 是否可关闭
     * @version 1.20
     */
    tagClosable: PropTypes.bool,
    /**
     * tag 尺寸是否和 select 保持一致(mode=multiple/tag 模式生效），默认false
     * @version 1.24
     */
    adjustTagSize: PropTypes.bool,
    /**
     * 最多显示多少个 tag
     * @version 1.15
     */
    maxTagCount: PropTypes.number,
    /**
     * 隐藏多余 tag 时显示的内容，在 maxTagCount 生效时起作用
     * @param {object} selectedValues 当前已选中的元素
     * @param {object} totalValues 总待选元素
     * @version 1.15
     */
    maxTagPlaceholder: PropTypes.func,
    /**
     * 选择后是否立即隐藏菜单 (mode=multiple/tag 模式生效)
     */
    hiddenSelected: PropTypes.bool,
    /**
     * tag 删除回调
     * @param {object} item 渲染节点的item
     */
    onRemove: PropTypes.func,
    /**
     * 焦点事件
     */
    onFocus: PropTypes.func,
    /**
     * 是否自动高亮第一个选项
     */
    // highlightFirstItem: PropTypes.bool,
    /**
     * 失去焦点事件
     */
    onBlur: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onKeyDown: PropTypes.func,
    locale: PropTypes.object,
    /**
     * 展开下拉菜单时是否自动焦点到弹层
     */
    popupAutoFocus: PropTypes.bool,
    /**
     * 是否展示 dataSource 中 children
     */
    showDataSourceChildren: PropTypes.bool
}), _class.defaultProps = _extends({}, Base.defaultProps, {
    locale: zhCN.Select,
    mode: 'single',
    showSearch: false,
    cacheValue: true,
    tagInline: false,
    adjustTagSize: false,
    onSearch: noop,
    onSearchClear: noop,
    hasArrow: true,
    onRemove: noop,
    // highlightFirstItem: true,
    valueRender: function valueRender(item) {
        return item.label || item.value;
    },
    onKeyDown: noop,
    onFocus: noop,
    onBlur: noop,
    onMouseEnter: noop,
    onMouseLeave: noop,
    popupAutoFocus: false,
    tagClosable: true
}), _class.displayName = 'Select', _temp);


export default polyfill(Select);
import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Checkbox from '../../checkbox';
import Search from '../../search';
import Menu from '../../menu';
import { func, htmlId } from '../../util';
import TransferItem from './transfer-item';
import VirtualList from '../../virtual-list';

var bindCtx = func.bindCtx;
var TransferPanel = (_temp = _class = function (_Component) {
    _inherits(TransferPanel, _Component);

    function TransferPanel(props, context) {
        _classCallCheck(this, TransferPanel);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

        _this.state = {
            searchedValue: '',
            dragValue: null,
            dragOverValue: null
        };
        _this.footerId = props.baseId ? htmlId.escapeForId(props.baseId + '-panel-footer-' + props.position) : '';
        _this.headerId = props.baseId ? htmlId.escapeForId(props.baseId + '-panel-header-' + props.position) : '';

        bindCtx(_this, ['handleCheck', 'handleAllCheck', 'handleSearch', 'handleItemDragStart', 'handleItemDragOver', 'handleItemDragEnd', 'handleItemDrop', 'getListDOM']);
        _this.firstRender = true;
        return _this;
    }

    TransferPanel.prototype.componentDidMount = function componentDidMount() {
        this.firstRender = false;
    };

    TransferPanel.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
        if (prevProps.dataSource.length !== this.props.dataSource.length && this.list) {
            if (this.list.scrollTop > 0) {
                this.list.scrollTop = 0;
            }
        }

        this.searched = false;
    };

    TransferPanel.prototype.getListDOM = function getListDOM(ref) {
        this.list = ref;
    };

    TransferPanel.prototype.getListData = function getListData(dataSource, disableHighlight) {
        var _this2 = this;

        var _props = this.props,
            prefix = _props.prefix,
            position = _props.position,
            mode = _props.mode,
            value = _props.value,
            onMove = _props.onMove,
            disabled = _props.disabled,
            itemRender = _props.itemRender,
            sortable = _props.sortable;
        var _state = this.state,
            dragPosition = _state.dragPosition,
            dragValue = _state.dragValue,
            dragOverValue = _state.dragOverValue;

        return dataSource.map(function (item) {
            var others = 'title' in item ? {
                title: item.title
            } : {};

            return React.createElement(TransferItem, _extends({
                key: item.value,
                prefix: prefix,
                mode: mode,
                checked: value.indexOf(item.value) > -1,
                disabled: disabled || item.disabled,
                item: item,
                onCheck: _this2.handleCheck,
                onClick: onMove,
                needHighlight: !_this2.firstRender && !_this2.searched && !disableHighlight,
                itemRender: itemRender,
                draggable: sortable,
                onDragStart: _this2.handleItemDragStart,
                onDragOver: _this2.handleItemDragOver,
                onDragEnd: _this2.handleItemDragEnd,
                onDrop: _this2.handleItemDrop,
                dragPosition: dragPosition,
                dragValue: dragValue,
                dragOverValue: dragOverValue,
                panelPosition: position
            }, others));
        });
    };

    TransferPanel.prototype.handleAllCheck = function handleAllCheck(allChecked) {
        var _props2 = this.props,
            position = _props2.position,
            onChange = _props2.onChange,
            filter = _props2.filter;
        var searchedValue = this.state.searchedValue;


        var newValue = void 0;
        if (allChecked) {
            if (searchedValue) {
                newValue = this.enabledDatasource.filter(function (item) {
                    return filter(searchedValue, item);
                }).map(function (item) {
                    return item.value;
                });
            } else {
                newValue = this.enabledDatasource.map(function (item) {
                    return item.value;
                });
            }
        } else {
            newValue = [];
        }

        onChange && onChange(position, newValue);
    };

    TransferPanel.prototype.handleCheck = function handleCheck(itemValue, checked) {
        var _props3 = this.props,
            position = _props3.position,
            value = _props3.value,
            onChange = _props3.onChange;


        var newValue = [].concat(value);
        var index = value.indexOf(itemValue);
        if (checked && index === -1) {
            newValue.push(itemValue);
        } else if (!checked && index > -1) {
            newValue.splice(index, 1);
        }

        onChange && onChange(position, newValue);
    };

    TransferPanel.prototype.handleSearch = function handleSearch(searchedValue) {
        this.setState({
            searchedValue: searchedValue
        });
        this.searched = true;

        var _props4 = this.props,
            onSearch = _props4.onSearch,
            position = _props4.position;

        onSearch(searchedValue, position);
    };

    TransferPanel.prototype.handleItemDragStart = function handleItemDragStart(position, value) {
        this.setState({
            dragPosition: position,
            dragValue: value
        });
    };

    TransferPanel.prototype.handleItemDragOver = function handleItemDragOver(value) {
        this.setState({
            dragOverValue: value
        });
    };

    TransferPanel.prototype.handleItemDragEnd = function handleItemDragEnd() {
        this.setState({
            dragOverValue: null
        });
    };

    TransferPanel.prototype.handleItemDrop = function handleItemDrop() {
        var _props5;

        this.setState({
            dragOverValue: null
        });

        (_props5 = this.props).onSort.apply(_props5, arguments);
    };

    TransferPanel.prototype.renderHeader = function renderHeader() {
        var _props6 = this.props,
            title = _props6.title,
            prefix = _props6.prefix;


        return React.createElement(
            'div',
            { id: this.headerId, className: prefix + 'transfer-panel-header' },
            title
        );
    };

    TransferPanel.prototype.renderSearch = function renderSearch() {
        var _props7 = this.props,
            prefix = _props7.prefix,
            searchPlaceholder = _props7.searchPlaceholder,
            locale = _props7.locale;

        return React.createElement(Search, {
            'aria-labelledby': this.headerId,
            shape: 'simple',
            className: prefix + 'transfer-panel-search',
            placeholder: searchPlaceholder || locale.searchPlaceholder,
            onChange: this.handleSearch
        });
    };

    TransferPanel.prototype.renderList = function renderList(dataSource) {
        var _cx;

        var _props8 = this.props,
            prefix = _props8.prefix,
            listClassName = _props8.listClassName,
            listStyle = _props8.listStyle,
            customerList = _props8.customerList,
            useVirtual = _props8.useVirtual;

        var newClassName = cx((_cx = {}, _cx[prefix + 'transfer-panel-list'] = true, _cx[listClassName] = !!listClassName, _cx));

        var customerPanel = customerList && customerList(this.props);
        if (customerPanel) {
            return React.createElement(
                'div',
                { className: newClassName, style: listStyle, ref: this.getListDOM },
                customerPanel
            );
        }

        if (!dataSource.length) {
            return React.createElement(
                'div',
                { className: newClassName, style: listStyle },
                this.renderNotFoundContent()
            );
        }

        if (useVirtual) {
            return React.createElement(
                'div',
                { className: newClassName, style: _extends({ position: 'relative' }, listStyle) },
                React.createElement(
                    VirtualList,
                    {
                        itemsRenderer: function itemsRenderer(items, ref) {
                            return React.createElement(
                                Menu,
                                { style: { border: 'none' }, ref: ref },
                                items
                            );
                        }
                    },
                    this.getListData(dataSource, true)
                )
            );
        }

        return React.createElement(
            Menu,
            { className: newClassName, style: listStyle, ref: this.getListDOM },
            this.getListData(dataSource)
        );
    };

    TransferPanel.prototype.renderNotFoundContent = function renderNotFoundContent() {
        var _props9 = this.props,
            prefix = _props9.prefix,
            notFoundContent = _props9.notFoundContent;


        return React.createElement(
            'div',
            { className: prefix + 'transfer-panel-not-found-container' },
            React.createElement(
                'div',
                { className: prefix + 'transfer-panel-not-found' },
                notFoundContent
            )
        );
    };

    TransferPanel.prototype.renderFooter = function renderFooter() {
        var _props10 = this.props,
            prefix = _props10.prefix,
            position = _props10.position,
            mode = _props10.mode,
            disabled = _props10.disabled,
            locale = _props10.locale,
            showCheckAll = _props10.showCheckAll;

        if (mode === 'simple') {
            var _cx2;

            var onMoveAll = this.props.onMoveAll;

            var classNames = cx((_cx2 = {}, _cx2[prefix + 'transfer-panel-move-all'] = true, _cx2[prefix + 'disabled'] = disabled, _cx2));
            return React.createElement(
                'div',
                { className: prefix + 'transfer-panel-footer' },
                React.createElement(
                    'a',
                    { className: classNames, onClick: onMoveAll.bind(this, position === 'left' ? 'right' : 'left') },
                    locale.moveAll
                )
            );
        }

        var _props11 = this.props,
            value = _props11.value,
            showSearch = _props11.showSearch,
            filter = _props11.filter,
            dataSource = _props11.dataSource;
        var searchedValue = this.state.searchedValue;

        var totalCount = dataSource.length;
        var _dataSource = dataSource;
        var checkedCount = value.length;
        var _checkedCount = checkedCount;
        if (showSearch && searchedValue) {
            _dataSource = dataSource.filter(function (item) {
                return filter(searchedValue, item);
            });
            totalCount = _dataSource.length;
            _checkedCount = _dataSource.filter(function (item) {
                return value.includes(item.value);
            }).length;
        }
        var totalEnabledCount = Math.min(totalCount, this.enabledDatasource.length);
        var checked = checkedCount > 0 && checkedCount >= totalEnabledCount;
        var indeterminate = checkedCount > 0 && _checkedCount >= 0 && _checkedCount < totalEnabledCount;
        var items = totalCount > 1 ? locale.items : locale.item;
        var countLabel = checkedCount === 0 ? totalCount + ' ' + items : checkedCount + '/' + totalCount + ' ' + items;

        return React.createElement(
            'div',
            { className: prefix + 'transfer-panel-footer' },
            showCheckAll && React.createElement(Checkbox, {
                disabled: disabled,
                checked: checked,
                indeterminate: indeterminate,
                onChange: this.handleAllCheck,
                'aria-labelledby': this.footerId
            }),
            React.createElement(
                'span',
                { className: prefix + 'transfer-panel-count', id: this.footerId },
                countLabel
            )
        );
    };

    TransferPanel.prototype.render = function render() {
        var _props12 = this.props,
            prefix = _props12.prefix,
            title = _props12.title,
            showSearch = _props12.showSearch,
            filter = _props12.filter,
            dataSource = _props12.dataSource;
        var searchedValue = this.state.searchedValue;

        var _dataSource = this.props.dataSource;
        this.enabledDatasource = dataSource.filter(function (item) {
            return !item.disabled;
        });
        if (showSearch && searchedValue) {
            _dataSource = dataSource.filter(function (item) {
                return filter(searchedValue, item);
            });
        }

        return React.createElement(
            'div',
            { className: prefix + 'transfer-panel' },
            title ? this.renderHeader() : null,
            showSearch ? this.renderSearch() : null,
            this.renderList(_dataSource),
            this.renderFooter()
        );
    };

    return TransferPanel;
}(Component), _class.propTypes = {
    prefix: PropTypes.string,
    position: PropTypes.oneOf(['left', 'right']),
    mode: PropTypes.oneOf(['normal', 'simple']),
    dataSource: PropTypes.array,
    value: PropTypes.array,
    onChange: PropTypes.func,
    onMove: PropTypes.func,
    onMoveAll: PropTypes.func,
    disabled: PropTypes.bool,
    locale: PropTypes.object,
    title: PropTypes.node,
    showSearch: PropTypes.bool,
    filter: PropTypes.func,
    onSearch: PropTypes.func,
    searchPlaceholder: PropTypes.string,
    notFoundContent: PropTypes.node,
    listClassName: PropTypes.string,
    listStyle: PropTypes.object,
    itemRender: PropTypes.func,
    sortable: PropTypes.bool,
    onSort: PropTypes.func,
    baseId: PropTypes.string,
    customerList: PropTypes.func,
    useVirtual: PropTypes.bool,
    showCheckAll: PropTypes.bool
}, _temp);
TransferPanel.displayName = 'TransferPanel';
export { TransferPanel as default };
'use strict';

exports.__esModule = true;

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

exports.default = selection;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactLifecyclesCompat = require('react-lifecycles-compat');

var _checkbox = require('../checkbox');

var _checkbox2 = _interopRequireDefault(_checkbox);

var _radio = require('../radio');

var _radio2 = _interopRequireDefault(_radio);

var _util = require('../util');

var _zhCn = require('../locale/zh-cn');

var _zhCn2 = _interopRequireDefault(_zhCn);

var _row = require('./selection/row');

var _row2 = _interopRequireDefault(_row);

var _column = require('./column');

var _column2 = _interopRequireDefault(_column);

var _util2 = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var makeChain = _util.func.makeChain;


var unique = function unique(arr) {
    var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'this';

    var temp = {},
        ret = [];
    arr.forEach(function (item) {
        var value = void 0;
        if (key === 'this') {
            value = item;
        } else {
            value = item[key];
        }
        if (!temp[value]) {
            ret.push(item);
            temp[value] = true;
        }
    });
    return ret;
};

function selection(BaseComponent) {
    var _class, _temp;

    /** Table */
    var SelectionTable = (_temp = _class = function (_React$Component) {
        (0, _inherits3.default)(SelectionTable, _React$Component);

        function SelectionTable(props, context) {
            (0, _classCallCheck3.default)(this, SelectionTable);

            var _this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call(this, props, context));

            _this.addSelection = function (columns) {
                var _this$props = _this.props,
                    prefix = _this$props.prefix,
                    rowSelection = _this$props.rowSelection,
                    size = _this$props.size;

                var attrs = rowSelection.columnProps && rowSelection.columnProps() || {};

                if (!columns.find(function (record) {
                    return record.key === 'selection';
                })) {
                    columns.unshift((0, _extends3.default)({
                        key: 'selection',
                        title: _this.renderSelectionHeader.bind(_this),
                        cell: _this.renderSelectionBody.bind(_this),
                        width: size === 'small' ? 34 : 50,
                        className: prefix + 'table-selection ' + prefix + 'table-prerow',
                        __normalized: true
                    }, attrs));
                }
            };

            _this.renderSelectionHeader = function () {
                var onChange = _this.selectAllRow,
                    attrs = {},
                    _this$props2 = _this.props,
                    rowSelection = _this$props2.rowSelection,
                    primaryKey = _this$props2.primaryKey,
                    dataSource = _this$props2.dataSource,
                    entireDataSource = _this$props2.entireDataSource,
                    locale = _this$props2.locale,
                    selectedRowKeys = _this.state.selectedRowKeys,
                    mode = rowSelection.mode ? rowSelection.mode : 'multiple';


                var checked = !!selectedRowKeys.length;
                var indeterminate = false;

                var source = entireDataSource || dataSource;

                _this.flatDataSource(source).filter(function (record, index) {
                    if (!rowSelection.getProps) {
                        return true;
                    } else {
                        return !(rowSelection.getProps(record, index) || {}).disabled;
                    }
                }).map(function (record) {
                    return record[primaryKey];
                }).forEach(function (id) {
                    if (selectedRowKeys.indexOf(id) === -1) {
                        checked = false;
                    } else {
                        indeterminate = true;
                    }
                });
                attrs.onClick = makeChain(function (e) {
                    e.stopPropagation();
                }, attrs.onClick);

                var userAttrs = rowSelection.titleProps && rowSelection.titleProps() || {};

                if (checked) {
                    indeterminate = false;
                }
                return [mode === 'multiple' ? _react2.default.createElement(_checkbox2.default, (0, _extends3.default)({
                    key: '_total',
                    indeterminate: indeterminate,
                    'aria-label': locale.selectAll,
                    checked: checked,
                    onChange: onChange
                }, attrs, userAttrs)) : null, rowSelection.titleAddons && rowSelection.titleAddons()];
            };

            _this.renderSelectionBody = function (value, index, record) {
                var _this$props3 = _this.props,
                    rowSelection = _this$props3.rowSelection,
                    primaryKey = _this$props3.primaryKey;
                var selectedRowKeys = _this.state.selectedRowKeys;

                var mode = rowSelection.mode ? rowSelection.mode : 'multiple';
                var checked = selectedRowKeys.indexOf(record[primaryKey]) > -1;
                var onChange = _this.selectOneRow.bind(_this, index, record);
                var attrs = rowSelection.getProps ? rowSelection.getProps(record, index) || {} : {};

                attrs.onClick = makeChain(function (e) {
                    e.stopPropagation();
                }, attrs.onClick);
                return mode === 'multiple' ? _react2.default.createElement(_checkbox2.default, (0, _extends3.default)({ checked: checked, onChange: onChange }, attrs)) : _react2.default.createElement(_radio2.default, (0, _extends3.default)({ checked: checked, onChange: onChange }, attrs));
            };

            _this.selectAllRow = function (checked, e) {
                var ret = [].concat(_this.state.selectedRowKeys),
                    _this$props4 = _this.props,
                    rowSelection = _this$props4.rowSelection,
                    primaryKey = _this$props4.primaryKey,
                    dataSource = _this$props4.dataSource,
                    entireDataSource = _this$props4.entireDataSource,
                    selectedRowKeys = _this.state.selectedRowKeys,
                    getProps = rowSelection.getProps;

                var attrs = {},
                    records = [];

                var source = entireDataSource ? entireDataSource : dataSource;

                _this.flatDataSource(source).forEach(function (record, index) {
                    var id = record[primaryKey];
                    if (getProps) {
                        attrs = getProps(record, index) || {};
                    }
                    // ????????????????????????????????????????????????????????????
                    if (checked && (!attrs.disabled || selectedRowKeys.indexOf(id) > -1)) {
                        ret.push(id);
                        records.push(record);
                    } else if (attrs.disabled && selectedRowKeys.indexOf(id) > -1) {
                        ret.push(id);
                        records.push(record);
                    } else {
                        var i = ret.indexOf(id);
                        i > -1 && ret.splice(i, 1);
                    }
                });

                records = unique(records, primaryKey);
                if (typeof rowSelection.onSelectAll === 'function') {
                    rowSelection.onSelectAll(checked, records);
                }
                _this.triggerSelection(rowSelection, unique(ret), records);
                e.stopPropagation();
            };

            _this.state = {
                selectedRowKeys: props.rowSelection && 'selectedRowKeys' in props.rowSelection ? props.rowSelection.selectedRowKeys || [] : []
            };
            return _this;
        }

        SelectionTable.prototype.getChildContext = function getChildContext() {
            return {
                rowSelection: this.props.rowSelection,
                selectedRowKeys: this.state.selectedRowKeys
            };
        };

        SelectionTable.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps) {
            if (nextProps.rowSelection && 'selectedRowKeys' in nextProps.rowSelection) {
                var selectedRowKeys = nextProps.rowSelection.selectedRowKeys || [];
                return {
                    selectedRowKeys: selectedRowKeys
                };
            }

            return null;
        };

        SelectionTable.prototype.normalizeChildren = function normalizeChildren(children) {
            var _props = this.props,
                prefix = _props.prefix,
                rowSelection = _props.rowSelection,
                size = _props.size;

            if (rowSelection) {
                children = _react.Children.map(children, function (child, index) {
                    return _react2.default.cloneElement(child, {
                        key: index
                    });
                });

                var attrs = rowSelection.columnProps && rowSelection.columnProps() || {};

                children.unshift(_react2.default.createElement(_column2.default, (0, _extends3.default)({
                    key: 'selection',
                    title: this.renderSelectionHeader.bind(this),
                    cell: this.renderSelectionBody.bind(this),
                    width: size === 'small' ? 34 : 50,
                    className: prefix + 'table-selection ' + prefix + 'table-prerow',
                    __normalized: true
                }, attrs)));
                return children;
            }
            return children;
        };

        SelectionTable.prototype.selectOneRow = function selectOneRow(index, record, checked, e) {
            var selectedRowKeys = [].concat(this.state.selectedRowKeys),
                i = void 0;
            var _props2 = this.props,
                primaryKey = _props2.primaryKey,
                rowSelection = _props2.rowSelection,
                dataSource = _props2.dataSource,
                mode = rowSelection.mode ? rowSelection.mode : 'multiple',
                id = record[primaryKey];

            if (!id) {
                _util.log.warning('Can\'t get value from record using given ' + primaryKey + ' as primaryKey.');
            }
            if (mode === 'multiple') {
                if (checked) {
                    selectedRowKeys.push(id);
                } else {
                    i = selectedRowKeys.indexOf(id);
                    selectedRowKeys.splice(i, 1);
                }
            } else if (checked) {
                selectedRowKeys = [id];
            }
            var records = unique(dataSource.filter(function (item) {
                return selectedRowKeys.indexOf(item[primaryKey]) > -1;
            }), primaryKey);
            if (typeof rowSelection.onSelect === 'function') {
                rowSelection.onSelect(checked, record, records);
            }

            this.triggerSelection(rowSelection, selectedRowKeys, records);

            e.stopPropagation();
        };

        SelectionTable.prototype.triggerSelection = function triggerSelection(rowSelection, selectedRowKeys, records) {
            if (!('selectedRowKeys' in rowSelection)) {
                this.setState({
                    selectedRowKeys: selectedRowKeys
                });
            }
            if (typeof rowSelection.onChange === 'function') {
                rowSelection.onChange(selectedRowKeys, records);
            }
        };

        SelectionTable.prototype.flatDataSource = function flatDataSource(dataSource) {
            var ret = dataSource;
            var listHeader = this.context.listHeader;


            if (listHeader) {
                ret = [];
                var hasChildrenSelection = listHeader.hasChildrenSelection,
                    hasSelection = listHeader.hasSelection;

                dataSource.forEach(function (item) {
                    var children = item.children;
                    // ??????????????????selection???????????????????????????dataSource
                    // ????????????????????????
                    if (hasSelection) {
                        ret.push(item);
                    }
                    if (children && hasChildrenSelection) {
                        ret = ret.concat(children);
                    }
                });
            }
            return ret;
        };

        SelectionTable.prototype.render = function render() {
            /* eslint-disable prefer-const */
            var _props3 = this.props,
                rowSelection = _props3.rowSelection,
                components = _props3.components,
                children = _props3.children,
                columns = _props3.columns,
                others = (0, _objectWithoutProperties3.default)(_props3, ['rowSelection', 'components', 'children', 'columns']);

            var useColumns = columns && !children;

            if (rowSelection) {
                if (useColumns) {
                    this.addSelection(columns);
                } else {
                    children = this.normalizeChildren(children || []);
                }
                components = (0, _extends3.default)({}, components);
                components.Row = components.Row || _row2.default;
            }
            return _react2.default.createElement(BaseComponent, (0, _extends3.default)({}, others, { columns: columns, components: components, children: children }));
        };

        return SelectionTable;
    }(_react2.default.Component), _class.SelectionRow = _row2.default, _class.propTypes = (0, _extends3.default)({
        /**
         * ????????????????????????
         * @property {Function} getProps `Function(record, index)=>Object` ??????selection???????????????
         * @property {Function} onChange `Function(selectedRowKeys:Array, records:Array)` ???????????????????????????????????????**??????:** ??????records??????????????????dataSource??????????????????????????????selectedRowKeys????????????
         * @property {Function} onSelect `Function(selected:Boolean, record:Object, records:Array)` ??????????????????/???????????????????????????
         * @property {Function} onSelectAll `Function(selected:Boolean, records:Array)` ??????????????????/??????????????????????????????
         * @property {Array} selectedRowKeys ??????????????????,???rowSelection??????????????????,???????????????????????????primaryKey??????
         * @property {String} mode ??????selection?????????, ????????????`single`, `multiple`????????????`multiple`
         * @property {Function} columnProps `Function()=>Object` ????????? ???props???????????????????????????????????????`Table.Column` ???????????????
         * @property {Function} titleProps `Function()=>Object` ????????? ?????????props????????? `multiple` ???????????????
         */
        rowSelection: _propTypes2.default.object,
        primaryKey: _propTypes2.default.oneOfType([_propTypes2.default.symbol, _propTypes2.default.string]),
        dataSource: _propTypes2.default.array,
        entireDataSource: _propTypes2.default.array
    }, BaseComponent.propTypes), _class.defaultProps = (0, _extends3.default)({}, BaseComponent.defaultProps, {
        locale: _zhCn2.default.Table,
        primaryKey: 'id',
        prefix: 'next-'
    }), _class.contextTypes = {
        listHeader: _propTypes2.default.any
    }, _class.childContextTypes = {
        rowSelection: _propTypes2.default.object,
        selectedRowKeys: _propTypes2.default.array
    }, _temp);
    SelectionTable.displayName = 'SelectionTable';

    (0, _util2.statics)(SelectionTable, BaseComponent);
    return (0, _reactLifecyclesCompat.polyfill)(SelectionTable);
}
module.exports = exports['default'];
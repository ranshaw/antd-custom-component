import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { Children } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { polyfill } from 'react-lifecycles-compat';
import Icon from '../icon';
import { KEYCODE, dom, events } from '../util';
import RowComponent from './expanded/row';
import Col from './column';
import { statics } from './util';

var noop = function noop() {};

export default function expanded(BaseComponent, stickyLock) {
    var _class, _temp2;

    /** Table */
    var ExpandedTable = (_temp2 = _class = function (_React$Component) {
        _inherits(ExpandedTable, _React$Component);

        function ExpandedTable() {
            var _temp, _this, _ret;

            _classCallCheck(this, ExpandedTable);

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
                openRowKeys: _this.props.openRowKeys || _this.props.defaultOpenRowKeys || []
            }, _this.saveExpandedRowRef = function (key, rowRef) {
                if (!_this.expandedRowRefs) {
                    _this.expandedRowRefs = {};
                }
                _this.expandedRowRefs[key] = rowRef;
            }, _this.setExpandedWidth = function () {
                var prefix = _this.props.prefix;

                var tableEl = _this.getTableNode();
                var totalWidth = +(tableEl && tableEl.clientWidth) - 1 || '100%';
                var bodyNode = tableEl && tableEl.querySelector('.' + prefix + 'table-body');

                Object.keys(_this.expandedRowRefs || {}).forEach(function (key) {
                    dom.setStyle(_this.expandedRowRefs[key], { width: bodyNode && bodyNode.clientWidth || totalWidth });
                });
            }, _this.getTableInstance = function (instance) {
                _this.tableInc = instance;
            }, _this.expandedKeydown = function (value, record, index, e) {
                e.preventDefault();
                e.stopPropagation();

                if (e.keyCode === KEYCODE.ENTER) {
                    _this.onExpandedClick(value, record, index, e);
                }
            }, _this.renderExpandedCell = function (value, index, record) {
                var _classnames;

                var _this$props = _this.props,
                    getExpandedColProps = _this$props.getExpandedColProps,
                    prefix = _this$props.prefix,
                    locale = _this$props.locale,
                    rowExpandable = _this$props.rowExpandable;


                if (typeof rowExpandable === 'function' && !rowExpandable(record, index)) {
                    return '';
                }

                var openRowKeys = _this.state.openRowKeys,
                    primaryKey = _this.props.primaryKey,
                    hasExpanded = openRowKeys.indexOf(record[primaryKey]) > -1,
                    switchNode = hasExpanded ? React.createElement(Icon, { type: 'minus', size: 'xs', className: prefix + 'table-expand-unfold' }) : React.createElement(Icon, { type: 'add', size: 'xs', className: prefix + 'table-expand-fold' }),
                    attrs = getExpandedColProps(record, index) || {};

                var cls = classnames((_classnames = {}, _classnames[prefix + 'table-expanded-ctrl'] = true, _classnames.disabled = attrs.disabled, _classnames[attrs.className] = attrs.className, _classnames));

                if (!attrs.disabled) {
                    attrs.onClick = _this.onExpandedClick.bind(_this, value, record, index);
                }
                return React.createElement(
                    'span',
                    _extends({}, attrs, {
                        role: 'button',
                        tabIndex: '0',
                        onKeyDown: _this.expandedKeydown.bind(_this, value, record, index),
                        'aria-label': hasExpanded ? locale.expanded : locale.folded,
                        'aria-expanded': hasExpanded,
                        className: cls
                    }),
                    switchNode
                );
            }, _this.addExpandCtrl = function (columns) {
                var _this$props2 = _this.props,
                    prefix = _this$props2.prefix,
                    size = _this$props2.size;


                if (!columns.find(function (record) {
                    return record.key === 'expanded';
                })) {
                    columns.unshift({
                        key: 'expanded',
                        title: '',
                        cell: _this.renderExpandedCell.bind(_this),
                        width: size === 'small' ? 34 : 50,
                        className: prefix + 'table-expanded ' + prefix + 'table-prerow',
                        __normalized: true
                    });
                }
            }, _temp), _possibleConstructorReturn(_this, _ret);
        }

        ExpandedTable.prototype.getChildContext = function getChildContext() {
            return {
                openRowKeys: this.state.openRowKeys,
                expandedRowRender: this.props.expandedRowRender,
                expandedIndexSimulate: this.props.expandedIndexSimulate,
                expandedRowWidthEquals2Table: stickyLock,
                getExpandedRowRef: this.saveExpandedRowRef,
                getTableInstanceForExpand: this.getTableInstance,
                expandedRowIndent: stickyLock ? [0, 0] : this.props.expandedRowIndent
            };
        };

        ExpandedTable.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps) {
            if ('openRowKeys' in nextProps) {
                return {
                    openRowKeys: nextProps.openRowKeys || []
                };
            }

            return null;
        };

        ExpandedTable.prototype.componentDidMount = function componentDidMount() {
            this.setExpandedWidth();
            events.on(window, 'resize', this.setExpandedWidth);
        };

        ExpandedTable.prototype.componentDidUpdate = function componentDidUpdate() {
            this.setExpandedWidth();
        };

        ExpandedTable.prototype.componentWillUnmount = function componentWillUnmount() {
            events.off(window, 'resize', this.setExpandedWidth);
        };

        ExpandedTable.prototype.getTableNode = function getTableNode() {
            var table = this.tableInc;
            try {
                // in case of finding an unmounted component due to cached data
                // need to clear refs of table when dataSource Changed
                // use try catch for temporary
                return findDOMNode(table.tableEl);
            } catch (error) {
                return null;
            }
        };

        ExpandedTable.prototype.onExpandedClick = function onExpandedClick(value, record, i, e) {
            var openRowKeys = [].concat(this.state.openRowKeys),
                primaryKey = this.props.primaryKey,
                id = record[primaryKey],
                index = openRowKeys.indexOf(id);

            if (index > -1) {
                openRowKeys.splice(index, 1);
            } else {
                openRowKeys.push(id);
            }
            if (!('openRowKeys' in this.props)) {
                this.setState({
                    openRowKeys: openRowKeys
                });
            }
            this.props.onRowOpen(openRowKeys, id, index === -1, record);
            e.stopPropagation();
        };

        ExpandedTable.prototype.normalizeChildren = function normalizeChildren(children) {
            var _props = this.props,
                prefix = _props.prefix,
                size = _props.size;

            var toArrayChildren = Children.map(children, function (child, index) {
                return React.cloneElement(child, {
                    key: index
                });
            });
            toArrayChildren.unshift(React.createElement(Col, {
                title: '',
                key: 'expanded',
                cell: this.renderExpandedCell.bind(this),
                width: size === 'small' ? 34 : 50,
                className: prefix + 'table-expanded ' + prefix + 'table-prerow',
                __normalized: true
            }));
            return toArrayChildren;
        };

        ExpandedTable.prototype.normalizeDataSource = function normalizeDataSource(ds) {
            var ret = [];
            ds.forEach(function (item) {
                var itemCopy = _extends({}, item);
                itemCopy.__expanded = true;
                ret.push(item, itemCopy);
            });
            return ret;
        };

        ExpandedTable.prototype.render = function render() {
            /* eslint-disable no-unused-vars, prefer-const */
            var _props2 = this.props,
                components = _props2.components,
                openRowKeys = _props2.openRowKeys,
                expandedRowRender = _props2.expandedRowRender,
                rowExpandable = _props2.rowExpandable,
                hasExpandedRowCtrl = _props2.hasExpandedRowCtrl,
                children = _props2.children,
                columns = _props2.columns,
                dataSource = _props2.dataSource,
                entireDataSource = _props2.entireDataSource,
                getExpandedColProps = _props2.getExpandedColProps,
                expandedRowIndent = _props2.expandedRowIndent,
                onRowOpen = _props2.onRowOpen,
                onExpandedRowClick = _props2.onExpandedRowClick,
                others = _objectWithoutProperties(_props2, ['components', 'openRowKeys', 'expandedRowRender', 'rowExpandable', 'hasExpandedRowCtrl', 'children', 'columns', 'dataSource', 'entireDataSource', 'getExpandedColProps', 'expandedRowIndent', 'onRowOpen', 'onExpandedRowClick']);

            if (expandedRowRender && !components.Row) {
                components = _extends({}, components);
                components.Row = RowComponent;
                dataSource = this.normalizeDataSource(dataSource);
                entireDataSource = this.normalizeDataSource(entireDataSource);
            }
            if (expandedRowRender && hasExpandedRowCtrl) {
                var useColumns = columns && !children;

                if (useColumns) {
                    this.addExpandCtrl(columns);
                } else {
                    children = this.normalizeChildren(children || []);
                }
            }

            return React.createElement(
                BaseComponent,
                _extends({}, others, {
                    columns: columns,
                    dataSource: dataSource,
                    entireDataSource: entireDataSource,
                    components: components
                }),
                children
            );
        };

        return ExpandedTable;
    }(React.Component), _class.ExpandedRow = RowComponent, _class.propTypes = _extends({
        /**
         * ??????????????????????????????
         * @param {Object} record ????????????????????????
         * @param {Number} index ????????????????????????
         * @returns {Element}
         */
        expandedRowRender: PropTypes.func,
        /**
         * ????????????????????????????????? false ???????????????
         * @param {Object} record ????????????????????????
         * @param {Number} index ????????????????????????
         * @returns {Boolean} ???????????????
         * @version 1.21
         */
        rowExpandable: PropTypes.func,
        /**
         * ????????????????????????
         */
        expandedRowIndent: PropTypes.array,
        /**
         * ???????????????????????????????????????Tree, ??????????????????????????????
         */
        openRowKeys: PropTypes.array,
        /**
         * ???????????????????????? Expand??? ?????? Tree?????????????????????
         * @version 1.23.22
         */
        defaultOpenRowKeys: PropTypes.array,
        /**
         * ??????????????????????????????????????????+?????????
         */
        hasExpandedRowCtrl: PropTypes.bool,
        /**
         * ??????????????????????????????
         */
        getExpandedColProps: PropTypes.func,
        /**
         * ????????????????????????Tree??????????????????????????????????????????
         * @param {Array} openRowKeys ?????????????????????key
         * @param {String} currentRowKey ???????????????????????????key
         * @param {Boolean} expanded ?????????????????????????????????
         * @param {Object} currentRecord ????????????????????????????????????
         */
        onRowOpen: PropTypes.func,
        onExpandedRowClick: PropTypes.func,
        locale: PropTypes.object
    }, BaseComponent.propTypes), _class.defaultProps = _extends({}, BaseComponent.defaultProps, {
        getExpandedColProps: noop,
        onRowOpen: noop,
        hasExpandedRowCtrl: true,
        components: {},
        expandedRowIndent: stickyLock ? [0, 0] : [1, 0],
        prefix: 'next-'
    }), _class.childContextTypes = {
        openRowKeys: PropTypes.array,
        expandedRowRender: PropTypes.func,
        expandedIndexSimulate: PropTypes.bool,
        expandedRowWidthEquals2Table: PropTypes.bool,
        expandedRowIndent: PropTypes.array,
        getExpandedRowRef: PropTypes.func,
        getTableInstanceForExpand: PropTypes.func
    }, _temp2);
    ExpandedTable.displayName = 'ExpandedTable';

    statics(ExpandedTable, BaseComponent);
    return polyfill(ExpandedTable);
}
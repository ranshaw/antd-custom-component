import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';
import RowComponent from './tree/row';
import CellComponent from './tree/cell';
import { statics } from './util';

var noop = function noop() {};

export default function tree(BaseComponent) {
    var _class, _temp;

    var TreeTable = (_temp = _class = function (_React$Component) {
        _inherits(TreeTable, _React$Component);

        function TreeTable(props, context) {
            _classCallCheck(this, TreeTable);

            var _this = _possibleConstructorReturn(this, _React$Component.call(this, props, context));

            _this.onTreeNodeClick = function (record) {
                var primaryKey = _this.props.primaryKey,
                    id = record[primaryKey],
                    dataSource = _this.ds,
                    openRowKeys = [].concat(_this.state.openRowKeys),
                    index = openRowKeys.indexOf(id),
                    getChildrenKeyById = function getChildrenKeyById(id) {
                    var ret = [id];
                    var loop = function loop(data) {
                        data.forEach(function (item) {
                            ret.push(item[primaryKey]);
                            if (item.children) {
                                loop(item.children);
                            }
                        });
                    };
                    dataSource.forEach(function (item) {
                        if (item[primaryKey] === id) {
                            if (item.children) {
                                loop(item.children);
                            }
                        }
                    });
                    return ret;
                };


                if (index > -1) {
                    // ????????????????????????openRowKey????????????????????????????????????openRowKey
                    var ids = getChildrenKeyById(id);
                    ids.forEach(function (id) {
                        var i = openRowKeys.indexOf(id);
                        if (i > -1) {
                            openRowKeys.splice(i, 1);
                        }
                    });
                } else {
                    openRowKeys.push(id);
                }

                if (!('openRowKeys' in _this.props)) {
                    _this.setState({
                        openRowKeys: openRowKeys
                    });
                }
                _this.props.onRowOpen(openRowKeys, id, index === -1, record);
            };

            _this.state = {
                openRowKeys: props.openRowKeys || props.defaultOpenRowKeys || []
            };
            return _this;
        }

        TreeTable.prototype.getChildContext = function getChildContext() {
            return {
                openTreeRowKeys: this.state.openRowKeys,
                indent: this.props.indent,
                treeStatus: this.getTreeNodeStatus(this.ds),
                onTreeNodeClick: this.onTreeNodeClick,
                isTree: this.props.isTree
            };
        };

        TreeTable.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps) {
            if ('openRowKeys' in nextProps) {
                return {
                    openRowKeys: nextProps.openRowKeys || []
                };
            }

            return null;
        };

        TreeTable.prototype.normalizeDataSource = function normalizeDataSource(dataSource) {
            var ret = [],
                loop = function loop(dataSource, level) {
                dataSource.forEach(function (item) {
                    item.__level = level;
                    ret.push(item);
                    if (item.children) {
                        loop(item.children, level + 1);
                    }
                });
            };
            loop(dataSource, 0);
            this.ds = ret;
            return ret;
        };

        TreeTable.prototype.getTreeNodeStatus = function getTreeNodeStatus() {
            var dataSource = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
            var openRowKeys = this.state.openRowKeys,
                primaryKey = this.props.primaryKey,
                ret = [];


            openRowKeys.forEach(function (openKey) {
                dataSource.forEach(function (item) {
                    if (item[primaryKey] === openKey) {
                        if (item.children) {
                            item.children.forEach(function (child) {
                                ret.push(child[primaryKey]);
                            });
                        }
                    }
                });
            });
            return ret;
        };

        TreeTable.prototype.render = function render() {
            /* eslint-disable no-unused-vars, prefer-const */
            var _props = this.props,
                components = _props.components,
                isTree = _props.isTree,
                dataSource = _props.dataSource,
                indent = _props.indent,
                others = _objectWithoutProperties(_props, ['components', 'isTree', 'dataSource', 'indent']);

            if (isTree) {
                components = _extends({}, components);
                if (!components.Row) {
                    components.Row = RowComponent;
                }
                if (!components.Cell) {
                    components.Cell = CellComponent;
                }

                dataSource = this.normalizeDataSource(dataSource);
            }
            return React.createElement(BaseComponent, _extends({}, others, { dataSource: dataSource, components: components }));
        };

        return TreeTable;
    }(React.Component), _class.TreeRow = RowComponent, _class.TreeCell = CellComponent, _class.propTypes = _extends({
        /**
         * ???????????????????????????????????????????????????????????????tree????????????????????????
         */
        openRowKeys: PropTypes.array,
        /**
         * ???????????????????????? Expand??? ?????? Tree?????????????????????
         * @version 1.23.22
         */
        defaultOpenRowKeys: PropTypes.array,
        /**
         * ??????tree??????????????????????????????????????????
         * @param {Array} openRowKeys tree??????????????????key
         * @param {String} currentRowKey ??????????????????key
         * @param {Boolean} opened ?????????????????????????????????
         * @param {Object} currentRecord ????????????????????????
         */
        onRowOpen: PropTypes.func,
        /**
         * dataSource??????????????????????????????????????????????????????????????????????????????????????????????????????????????????
         */
        primaryKey: PropTypes.oneOfType([PropTypes.symbol, PropTypes.string]),
        /**
         * ???tree??????????????????????????? ??????isTree???true????????????
         */
        indent: PropTypes.number,
        /**
         * ??????Table???tree??????, ??????????????????????????????children????????????tree table
         */
        isTree: PropTypes.bool,
        locale: PropTypes.object
    }, BaseComponent.propTypes), _class.defaultProps = _extends({}, BaseComponent.defaultProps, {
        primaryKey: 'id',
        onRowOpen: noop,
        components: {},
        indent: 12
    }), _class.childContextTypes = {
        openTreeRowKeys: PropTypes.array,
        indent: PropTypes.number,
        treeStatus: PropTypes.array,
        onTreeNodeClick: PropTypes.func,
        isTree: PropTypes.bool
    }, _temp);
    TreeTable.displayName = 'TreeTable';

    statics(TreeTable, BaseComponent);
    return polyfill(TreeTable);
}
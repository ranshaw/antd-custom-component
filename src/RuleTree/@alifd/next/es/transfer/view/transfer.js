import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';

import Icon from '../../icon';
import Button from '../../button';
import zhCN from '../../locale/zh-cn';
import { func, obj } from '../../util';
import ConfigProvider from '../../config-provider';
import TransferPanel from '../view/transfer-panel';

var config = ConfigProvider.config;
var bindCtx = func.bindCtx;
var pickOthers = obj.pickOthers;


var getLeftValue = function getLeftValue(dataSource, rightValue) {
    return dataSource.map(function (item) {
        return item.value;
    }).filter(function (itemValue) {
        return rightValue.indexOf(itemValue) === -1;
    });
};

var filterCheckedValue = function filterCheckedValue(left, right, dataSource) {
    var result = {
        left: [],
        right: []
    };

    if (left.length || right.length) {
        var value = dataSource.map(function (item) {
            return item.value;
        });
        value.forEach(function (itemValue) {
            if (left.indexOf(itemValue) > -1) {
                result.left.push(itemValue);
            } else if (right.indexOf(itemValue) > -1) {
                result.right.push(itemValue);
            }
        });
    }

    return result;
};

/**
 * Transfer
 */
var Transfer = (_temp = _class = function (_Component) {
    _inherits(Transfer, _Component);

    Transfer.normalizeValue = function normalizeValue(value) {
        if (value) {
            if (Array.isArray(value)) {
                return value;
            }
            /* istanbul ignore next */
            return [value];
        }

        return [];
    };

    Transfer.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, prevState) {
        var innerUpdate = prevState.innerUpdate,
            value = prevState.value,
            leftValue = prevState.leftValue;

        if (innerUpdate) {
            return {
                innerUpdate: false,
                value: value,
                leftValue: leftValue
            };
        }
        var st = {};

        var newValue = void 0;
        if ('value' in nextProps) {
            var _value = Transfer.normalizeValue(nextProps.value);
            st.value = _value;
            newValue = _value;
        } else {
            /* istanbul ignore next */
            newValue = prevState.value;
        }
        st.leftValue = getLeftValue(nextProps.dataSource, newValue);

        var _filterCheckedValue = filterCheckedValue(prevState.leftCheckedValue, prevState.rightCheckedValue, nextProps.dataSource),
            left = _filterCheckedValue.left,
            right = _filterCheckedValue.right;

        st.leftCheckedValue = left;
        st.rightCheckedValue = right;

        return st;
    };

    function Transfer(props, context) {
        _classCallCheck(this, Transfer);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

        var value = props.value,
            defaultValue = props.defaultValue,
            defaultLeftChecked = props.defaultLeftChecked,
            defaultRightChecked = props.defaultRightChecked,
            dataSource = props.dataSource,
            rtl = props.rtl,
            operations = props.operations;

        if (operations.length === 0) {
            operations.push(React.createElement(Icon, { rtl: rtl, type: 'arrow-right' }));
            operations.push(React.createElement(Icon, { rtl: rtl, type: 'arrow-left' }));
        }

        var _filterCheckedValue2 = filterCheckedValue(Transfer.normalizeValue(defaultLeftChecked), Transfer.normalizeValue(defaultRightChecked), dataSource),
            left = _filterCheckedValue2.left,
            right = _filterCheckedValue2.right;

        var stValue = Transfer.normalizeValue('value' in props ? value : defaultValue);
        _this.state = {
            value: stValue,
            leftCheckedValue: left,
            rightCheckedValue: right,
            leftValue: getLeftValue(dataSource, stValue)
        };

        bindCtx(_this, ['handlePanelChange', 'handlePanelSort', 'handleMoveItem', 'handleSimpleMove', 'handleSimpleMoveAll']);
        return _this;
    }

    Transfer.prototype.groupDatasource = function groupDatasource(value, itemValues, dataSource) {
        return value.reduce(function (ret, itemValue) {
            var index = itemValues.indexOf(itemValue);
            if (index > -1) {
                ret.push(dataSource[index]);
            }
            return ret;
        }, []);
    };

    Transfer.prototype.handlePanelChange = function handlePanelChange(position, value) {
        var _setState;

        var _state = this.state,
            leftCheckedValue = _state.leftCheckedValue,
            rightCheckedValue = _state.rightCheckedValue;
        var onSelect = this.props.onSelect;

        var valuePropName = position === 'left' ? 'leftCheckedValue' : 'rightCheckedValue';
        // inner state changed
        this.setState((_setState = {
            innerUpdate: true
        }, _setState[valuePropName] = value, _setState));
        onSelect && onSelect(position === 'left' ? value : leftCheckedValue, position === 'left' ? rightCheckedValue : value, position === 'left' ? 'source' : 'target');
    };

    Transfer.prototype.handlePanelSort = function handlePanelSort(position, dragValue, referenceValue, dragGap) {
        var _this2 = this;

        var _state2 = this.state,
            value = _state2.value,
            leftValue = _state2.leftValue;

        var newValue = position === 'right' ? value : leftValue;
        var currentIndex = newValue.indexOf(dragValue);
        var referenceIndex = newValue.indexOf(referenceValue);
        var expectIndex = dragGap === 'before' ? referenceIndex : referenceIndex + 1;
        if (currentIndex === expectIndex) {
            return;
        }

        newValue.splice(currentIndex, 1);
        if (currentIndex < expectIndex) {
            expectIndex = expectIndex - 1;
        }
        newValue.splice(expectIndex, 0, dragValue);
        this.setState({
            innerUpdate: true,
            value: value,
            leftValue: leftValue
        }, function () {
            _this2.props.onSort(newValue, position);
        });
    };

    Transfer.prototype.handleMoveItem = function handleMoveItem(direction) {
        var _st;

        var rightValue = void 0;
        var newLeftValue = void 0;
        var movedValue = void 0;
        var valuePropName = void 0;

        var _state3 = this.state,
            value = _state3.value,
            leftValue = _state3.leftValue,
            leftCheckedValue = _state3.leftCheckedValue,
            rightCheckedValue = _state3.rightCheckedValue;


        if (direction === 'right') {
            rightValue = leftCheckedValue.concat(value);
            newLeftValue = leftValue.filter(function (itemValue) {
                return leftCheckedValue.indexOf(itemValue) === -1;
            });
            movedValue = leftCheckedValue;
            valuePropName = 'leftCheckedValue';
        } else {
            rightValue = value.filter(function (itemValue) {
                return rightCheckedValue.indexOf(itemValue) === -1;
            });
            newLeftValue = rightCheckedValue.concat(leftValue);
            movedValue = rightCheckedValue;
            valuePropName = 'rightCheckedValue';
        }

        var st = (_st = {}, _st[valuePropName] = [], _st);

        this.setValueState(st, rightValue, newLeftValue, movedValue, direction);
    };

    Transfer.prototype.handleSimpleMove = function handleSimpleMove(direction, v) {
        var rightValue = void 0;
        var newLeftValue = void 0;

        var _state4 = this.state,
            value = _state4.value,
            leftValue = _state4.leftValue;


        if (direction === 'right') {
            rightValue = [v].concat(value);
            newLeftValue = leftValue.filter(function (itemValue) {
                return itemValue !== v;
            });
        } else {
            rightValue = value.filter(function (itemValue) {
                return itemValue !== v;
            });
            newLeftValue = [v].concat(leftValue);
        }

        this.setValueState({}, rightValue, newLeftValue, [v], direction);
    };

    Transfer.prototype.handleSimpleMoveAll = function handleSimpleMoveAll(direction) {
        var rightValue = void 0;
        var newLeftValue = void 0;
        var movedValue = void 0;

        var dataSource = this.props.dataSource;
        var _state5 = this.state,
            value = _state5.value,
            leftValue = _state5.leftValue;

        var disabledValue = dataSource.reduce(function (ret, item) {
            if (item.disabled) {
                ret.push(item.value);
            }

            return ret;
        }, []);

        if (direction === 'right') {
            movedValue = leftValue.filter(function (itemValue) {
                return disabledValue.indexOf(itemValue) === -1;
            });
            rightValue = movedValue.concat(value);
            newLeftValue = leftValue.filter(function (itemValue) {
                return disabledValue.indexOf(itemValue) > -1;
            });
        } else {
            movedValue = value.filter(function (itemValue) {
                return disabledValue.indexOf(itemValue) === -1;
            });
            rightValue = value.filter(function (itemValue) {
                return disabledValue.indexOf(itemValue) > -1;
            });
            newLeftValue = movedValue.concat(leftValue);
        }

        this.setValueState({}, rightValue, newLeftValue, movedValue, direction);
    };

    // eslint-disable-next-line max-params


    Transfer.prototype.setValueState = function setValueState(st, rightValue, leftValue, movedValue, direction) {
        var _this3 = this;

        var dataSource = this.props.dataSource;

        var callback = function callback() {
            if ('onChange' in _this3.props) {
                var itemValues = dataSource.map(function (item) {
                    return item.value;
                });
                var rightData = _this3.groupDatasource(rightValue, itemValues, dataSource);
                var leftData = _this3.groupDatasource(leftValue, itemValues, dataSource);
                var movedData = _this3.groupDatasource(movedValue, itemValues, dataSource);

                _this3.props.onChange(rightValue, rightData, {
                    leftValue: leftValue,
                    leftData: leftData,
                    movedValue: movedValue,
                    movedData: movedData,
                    direction: direction
                });
            }
        };

        if (!('value' in this.props)) {
            st.value = rightValue;
            st.leftValue = leftValue;
        }

        if (Object.keys(st).length) {
            this.setState(st, callback);
        } else {
            // eslint-disable-next-line callback-return
            callback();
        }
    };

    Transfer.prototype.renderCenter = function renderCenter() {
        var _props = this.props,
            prefix = _props.prefix,
            mode = _props.mode,
            operations = _props.operations,
            disabled = _props.disabled,
            leftDisabled = _props.leftDisabled,
            rightDisabled = _props.rightDisabled,
            locale = _props.locale;
        var _state6 = this.state,
            leftCheckedValue = _state6.leftCheckedValue,
            rightCheckedValue = _state6.rightCheckedValue;

        return React.createElement(
            'div',
            { className: prefix + 'transfer-operations' },
            mode === 'simple' ? React.createElement(Icon, { className: prefix + 'transfer-move', size: 'large', type: 'switch' }) : [React.createElement(
                Button,
                {
                    'aria-label': locale.moveToRight,
                    key: 'l2r',
                    className: prefix + 'transfer-operation',
                    type: leftCheckedValue.length ? 'primary' : 'normal',
                    disabled: leftDisabled || disabled || !leftCheckedValue.length,
                    onClick: this.handleMoveItem.bind(this, 'right')
                },
                operations[0]
            ), React.createElement(
                Button,
                {
                    'aria-label': locale.moveToLeft,
                    key: 'r2l',
                    className: prefix + 'transfer-operation',
                    type: rightCheckedValue.length ? 'primary' : 'normal',
                    disabled: rightDisabled || disabled || !rightCheckedValue.length,
                    onClick: this.handleMoveItem.bind(this, 'left')
                },
                operations[1]
            )]
        );
    };

    Transfer.prototype.render = function render() {
        var _props2 = this.props,
            prefix = _props2.prefix,
            mode = _props2.mode,
            disabled = _props2.disabled,
            className = _props2.className,
            dataSource = _props2.dataSource,
            locale = _props2.locale,
            showSearch = _props2.showSearch,
            filter = _props2.filter,
            onSearch = _props2.onSearch,
            leftDisabled = _props2.leftDisabled,
            rightDisabled = _props2.rightDisabled,
            searchPlaceholder = _props2.searchPlaceholder,
            notFoundContent = _props2.notFoundContent,
            titles = _props2.titles,
            listClassName = _props2.listClassName,
            listStyle = _props2.listStyle,
            itemRender = _props2.itemRender,
            sortable = _props2.sortable,
            useVirtual = _props2.useVirtual,
            rtl = _props2.rtl,
            id = _props2.id,
            children = _props2.children,
            showCheckAll = _props2.showCheckAll;
        var _state7 = this.state,
            value = _state7.value,
            leftValue = _state7.leftValue,
            leftCheckedValue = _state7.leftCheckedValue,
            rightCheckedValue = _state7.rightCheckedValue;

        var itemValues = dataSource.map(function (item) {
            return item.value;
        });
        var leftDatasource = this.groupDatasource(leftValue, itemValues, dataSource);
        var rightDatasource = this.groupDatasource(value, itemValues, dataSource);
        var panelProps = {
            prefix: prefix,
            mode: mode,
            locale: locale,
            showSearch: showSearch,
            filter: filter,
            onSearch: onSearch,
            searchPlaceholder: searchPlaceholder,
            notFoundContent: notFoundContent,
            listClassName: listClassName,
            listStyle: listStyle,
            itemRender: itemRender,
            onMove: this.handleSimpleMove,
            onMoveAll: this.handleSimpleMoveAll,
            onChange: this.handlePanelChange,
            sortable: sortable,
            useVirtual: useVirtual,
            onSort: this.handlePanelSort,
            baseId: id,
            customerList: children,
            showCheckAll: showCheckAll
        };
        var others = pickOthers(Object.keys(Transfer.propTypes), this.props);

        if (rtl) {
            others.dir = 'rtl';
        }
        return React.createElement(
            'div',
            _extends({ className: cx(prefix + 'transfer', className), id: id }, others),
            React.createElement(TransferPanel, _extends({}, panelProps, {
                position: 'left',
                dataSource: leftDatasource,
                disabled: leftDisabled || disabled,
                value: leftCheckedValue,
                title: titles[0]
            })),
            this.renderCenter(),
            React.createElement(TransferPanel, _extends({}, panelProps, {
                position: 'right',
                dataSource: rightDatasource,
                disabled: rightDisabled || disabled,
                value: rightCheckedValue,
                title: titles[1]
            }))
        );
    };

    return Transfer;
}(Component), _class.contextTypes = {
    prefix: PropTypes.string
}, _class.propTypes = _extends({}, ConfigProvider.propTypes, {
    prefix: PropTypes.string,
    pure: PropTypes.bool,
    rtl: PropTypes.bool,
    className: PropTypes.string,
    /**
     * ??????????????????
     */
    mode: PropTypes.oneOf(['normal', 'simple']),
    /**
     * ?????????
     */
    dataSource: PropTypes.arrayOf(PropTypes.object),
    /**
     * ???????????????????????????
     */
    value: PropTypes.arrayOf(PropTypes.string),
    /**
     * ??????????????????????????????
     */
    defaultValue: PropTypes.arrayOf(PropTypes.string),
    /**
     * ?????????????????????????????????????????????
     * @param {Array} value ????????????
     * @param {Array} data ???????????????
     * @param {Object} extra ????????????
     * @param {Array} extra.leftValue ????????????
     * @param {Array} extra.leftData ???????????????
     * @param {Array} extra.movedValue ??????????????????
     * @param {Object} extra.movedData ?????????????????????
     * @param {String} extra.direction ????????????????????????'left'???'right'
     */
    onChange: PropTypes.func,
    /**
     * Item ???????????????????????????????????????
     * @param {Array} sourceSelectedValue ?????????????????? Item ??????
     * @param {Array} targetSelectedValue ????????????????????? Item ??????
     * @param {String} trigger ?????????????????????'source'???'target'
     */
    onSelect: PropTypes.func,
    /**
     * ????????????
     */
    disabled: PropTypes.bool,
    /**
     * ????????????????????????
     */
    leftDisabled: PropTypes.bool,
    /**
     * ????????????????????????
     */
    rightDisabled: PropTypes.bool,
    /**
     * ?????????????????????
     * @param {Object} data ??????
     * @return {ReactNode} ???????????????
     */
    itemRender: PropTypes.func,
    /**
     * ?????????????????????
     */
    showSearch: PropTypes.bool,
    /**
     * ?????????????????????
     * @param {String} searchedValue ???????????????
     * @param {Object} data ??????
     * @return {Boolean} ???????????????
     * @default ?????? label ????????????
     */
    filter: PropTypes.func,
    /**
     * ???????????????????????????????????????
     * @param {String} searchedValue ???????????????
     * @param {String} position ?????????????????????
     */
    onSearch: PropTypes.func,
    /**
     * ??????????????????
     */
    searchPlaceholder: PropTypes.string,
    /**
     * ????????????????????????
     */
    notFoundContent: PropTypes.node,
    /**
     * ??????????????????
     */
    titles: PropTypes.arrayOf(PropTypes.node),
    /**
     * ????????????????????????????????????
     * @default [<Icon type="arrow-right" />, <Icon type="arrow-left" />]
     */
    operations: PropTypes.arrayOf(PropTypes.node),
    /**
     * ????????????????????????
     */
    defaultLeftChecked: PropTypes.arrayOf(PropTypes.string),
    /**
     * ????????????????????????
     */
    defaultRightChecked: PropTypes.arrayOf(PropTypes.string),
    /**
     * ???????????????????????????????????????
     */
    listClassName: PropTypes.string,
    /**
     * ???????????????????????????????????????
     */
    listStyle: PropTypes.object,
    /**
     * ????????????????????????
     */
    sortable: PropTypes.bool,
    /**
     * ????????????????????????????????????
     * @param {Array} value ???????????????
     * @param {String} position ?????????????????????????????????left ??? right
     */
    onSort: PropTypes.func,
    /**
     * ??????????????????????????????
     */
    locale: PropTypes.object,
    /**
     * ????????? id ?????????transfer???????????????
     */
    id: PropTypes.string,
    /**
     * ?????? children ?????????????????????
     */
    children: PropTypes.func,
    /**
     * ????????????????????????
     */
    useVirtual: PropTypes.bool,
    /**
     * ???????????????????????? checkbox
     */
    showCheckAll: PropTypes.bool
}), _class.defaultProps = {
    prefix: 'next-',
    pure: false,
    mode: 'normal',
    dataSource: [],
    defaultValue: [],
    disabled: false,
    leftDisabled: false,
    rightDisabled: false,
    showCheckAll: true,
    itemRender: function itemRender(data) {
        return data.label;
    },
    showSearch: false,
    filter: function filter(searchedValue, data) {
        var labelString = '';
        var loop = function loop(arg) {
            if (React.isValidElement(arg) && arg.props.children) {
                React.Children.forEach(arg.props.children, loop);
            } else if (typeof arg === 'string') {
                labelString += arg;
            }
        };
        loop(data.label);

        return labelString.length >= searchedValue.length && labelString.indexOf(searchedValue) > -1;
    },
    onSearch: function onSearch() {},
    notFoundContent: 'Not Found',
    titles: [],
    operations: [],
    defaultLeftChecked: [],
    defaultRightChecked: [],
    sortable: false,
    onSort: function onSort() {},
    locale: zhCN.Transfer
}, _temp);
Transfer.displayName = 'Transfer';


export default config(polyfill(Transfer));
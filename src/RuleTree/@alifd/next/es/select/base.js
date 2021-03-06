import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Children } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { func, dom, events } from '../util';
import Menu from '../menu';
import Overlay from '../overlay';
import Input from '../input';

import zhCN from '../locale/zh-cn';
import DataStore from './data-store';
import VirtualList from '../virtual-list';
import { isSingle, filter, isNull, valueToSelectKey, getValueDataSource } from './util';

var Popup = Overlay.Popup;
var MenuItem = Menu.Item,
    MenuGroup = Menu.Group;
var noop = func.noop,
    bindCtx = func.bindCtx,
    makeChain = func.makeChain;


function preventDefault(e) {
    e.preventDefault();
}

var Base = (_temp = _class = function (_React$Component) {
    _inherits(Base, _React$Component);

    function Base(props) {
        _classCallCheck(this, Base);

        var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

        _this.handleMouseDown = function (e) {
            if (!_this.props.popupAutoFocus) {
                preventDefault(e);
            }
        };

        _this.saveSelectRef = function (ref) {
            _this.selectDOM = findDOMNode(ref);
        };

        _this.saveInputRef = function (ref) {
            if (ref && ref.getInstance()) {
                _this.inputRef = ref.getInstance();
            }
        };

        _this.savePopupRef = function (ref) {
            _this.popupRef = ref;
            if (_this.props.popupProps && typeof _this.props.popupProps.ref === 'function') {
                _this.props.popupProps.ref(ref);
            }
        };

        _this.dataStore = new DataStore({
            filter: props.filter,
            filterLocal: props.filterLocal,
            showDataSourceChildren: props.showDataSourceChildren
        });

        var mode = props.mode;

        var value = 'value' in props ? props.value : props.defaultValue;

        // ?????????????????? value ????????????
        if (props.mode !== 'single' && value && !Array.isArray(value)) {
            value = [value];
        }

        _this.state = {
            dataStore: _this.dataStore,
            value: value,
            visible: 'visible' in props ? props.visible : props.defaultVisible,
            dataSource: _this.setDataSource(_this.props),
            width: 100,
            highlightKey: 'highlightKey' in props ? props.highlightKey : props.defaultHighlightKey,
            srReader: ''
        };

        bindCtx(_this, ['handleMenuBodyClick', 'handleVisibleChange', 'focusInput', 'beforeOpen', 'beforeClose', 'afterClose', 'handleResize']);
        return _this;
    }

    Base.prototype.componentDidMount = function componentDidMount() {
        var _this2 = this;

        // overlay ??????????????? mount?????????????????????????????????
        setTimeout(function () {
            return _this2.syncWidth();
        }, 0);

        events.on(window, 'resize', this.handleResize);
    };

    Base.prototype.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
        if (prevProps.label !== this.props.label || prevState.value !== this.state.value) {
            this.syncWidth();
        }
    };

    Base.prototype.componentWillUnmount = function componentWillUnmount() {
        events.off(window, 'resize', this.handleResize);
        clearTimeout(this.resizeTimeout);
    };

    /**
     * Calculate and set width of popup menu
     * @protected
     */


    Base.prototype.syncWidth = function syncWidth() {
        var _this3 = this;

        var _props2 = this.props,
            popupStyle = _props2.popupStyle,
            popupProps = _props2.popupProps;

        if (popupStyle && 'width' in popupStyle || popupProps && popupProps.style && 'width' in popupProps.style) {
            return;
        }

        var width = dom.getStyle(this.selectDOM, 'width');
        if (width && this.width !== width) {
            this.width = width;

            if (this.popupRef && this.shouldAutoWidth()) {
                // overy ??? node ?????????????????????????????????????????????????????????
                setTimeout(function () {
                    if (_this3.popupRef && _this3.popupRef.getInstance().overlay) {
                        dom.setStyle(_this3.popupRef.getInstance().overlay.getInstance().getContentNode(), 'width', _this3.width);
                    }
                }, 0);
            }
        }
    };

    Base.prototype.handleResize = function handleResize() {
        var _this4 = this;

        clearTimeout(this.resizeTimeout);
        if (this.state.visible) {
            this.resizeTimeout = setTimeout(function () {
                _this4.syncWidth();
            }, 200);
        }
    };

    /**
     * Get structured dataSource, for cache
     * @protected
     * @param  {Object} [props=this.props]
     * @return {Array}
     */


    Base.prototype.setDataSource = function setDataSource(props) {
        var dataSource = props.dataSource,
            children = props.children;

        // children is higher priority then dataSource

        if (Children.count(children)) {
            return this.dataStore.updateByDS(children, true);
        } else if (Array.isArray(dataSource)) {
            return this.dataStore.updateByDS(dataSource, false);
        }
        return [];
    };

    /**
     * Set popup visible
     * @protected
     * @param {boolean} visible
     * @param {string} type trigger type
     */


    Base.prototype.setVisible = function setVisible(visible, type) {
        // disabled ???????????????????????????????????????
        if (this.props.disabled && visible || this.state.visible === visible) {
            return;
        }

        if (!('visible' in this.props)) {
            this.setState({
                visible: visible
            });
        }

        this.props.onVisibleChange(visible, type);
    };

    Base.prototype.setFirstHightLightKeyForMenu = function setFirstHightLightKeyForMenu() {
        if (!this.props.autoHighlightFirstItem) {
            return;
        }

        // ???????????? item key
        if (this.dataStore.getMenuDS().length && this.dataStore.getEnableDS().length) {
            var highlightKey = '' + this.dataStore.getEnableDS()[0].value;
            this.setState({
                highlightKey: highlightKey
            });
            this.props.onToggleHighlightItem(highlightKey, 'autoFirstItem');
        }
    };

    Base.prototype.handleChange = function handleChange(value) {
        var _props3;

        // ?????????????????????????????????
        if (!('value' in this.props)) {
            this.setState({
                value: value
            });
        }

        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        (_props3 = this.props).onChange.apply(_props3, [value].concat(args));
    };

    /**
     * Handle Menu body click
     * @param {Event} e click event
     */


    Base.prototype.handleMenuBodyClick = function handleMenuBodyClick(e) {
        if (!this.props.popupAutoFocus) {
            this.focusInput(e);
        }
    };

    /**
     * Toggle highlight MenuItem
     * @private
     * @param {number} dir -1: up, 1: down
     */


    Base.prototype.toggleHighlightItem = function toggleHighlightItem(dir) {
        if (!this.state.visible) {
            this.setVisible(true, 'enter');
            return;
        }

        var maxCount = this.dataStore.getEnableDS().length;
        // When there is no enabled item
        if (!maxCount) {
            return false;
        }

        var highlightKey = this.state.highlightKey;

        var highlightIndex = -1;

        // find previous highlight index
        highlightKey !== null && this.dataStore.getEnableDS().some(function (item, index) {
            if ('' + item.value === highlightKey) {
                highlightIndex = index;
            }
            return highlightIndex > -1;
        });

        // toggle highlight index
        highlightIndex += dir;
        if (highlightIndex < 0) {
            highlightIndex = maxCount - 1;
        }
        if (highlightIndex >= maxCount) {
            highlightIndex = 0;
        }

        // get highlight key
        var highlightItem = this.dataStore.getEnableDS()[highlightIndex];
        highlightKey = highlightItem ? '' + highlightItem.value : null;

        this.setState({ highlightKey: highlightKey, srReader: highlightItem.label });

        this.scrollMenuIntoView();

        return highlightItem;
    };

    // scroll into focus item


    Base.prototype.scrollMenuIntoView = function scrollMenuIntoView() {
        var _this5 = this;

        var prefix = this.props.prefix;


        clearTimeout(this.highlightTimer);
        this.highlightTimer = setTimeout(function () {
            try {
                var menuNode = findDOMNode(_this5.menuRef);
                var itemNode = menuNode.querySelector('.' + prefix + 'select-menu-item.' + prefix + 'focused');
                itemNode && itemNode.scrollIntoViewIfNeeded && itemNode.scrollIntoViewIfNeeded();
            } catch (ex) {
                // I don't care...
            }
        });
    };

    /**
     * render popup menu header
     * @abstract
     */


    Base.prototype.renderMenuHeader = function renderMenuHeader() {
        var menuProps = this.props.menuProps;


        if (menuProps && 'header' in menuProps) {
            return menuProps.header;
        }

        return null;
    };

    Base.prototype.handleSelect = function handleSelect() {};

    /**
     * ?????? onBlur/onFocus ??????
     */

    /**
     * render popup children
     * @protected
     * @param {object} props
     */
    Base.prototype.renderMenu = function renderMenu() {
        var _classNames,
            _this6 = this;

        var _props4 = this.props,
            prefix = _props4.prefix,
            mode = _props4.mode,
            locale = _props4.locale,
            notFoundContent = _props4.notFoundContent,
            useVirtual = _props4.useVirtual,
            menuProps = _props4.menuProps;
        var _state = this.state,
            dataSource = _state.dataSource,
            highlightKey = _state.highlightKey;

        var value = this.state.value;
        var selectedKeys = void 0;

        if (isNull(value) || value.length === 0 || this.isAutoComplete) {
            selectedKeys = [];
        } else if (isSingle(mode)) {
            selectedKeys = [valueToSelectKey(value)];
        } else {
            selectedKeys = [].concat(value).map(function (n) {
                return valueToSelectKey(n);
            });
        }

        var children = this.renderMenuItem(dataSource);

        var menuClassName = classNames((_classNames = {}, _classNames[prefix + 'select-menu'] = true, _classNames[prefix + 'select-menu-empty'] = !children || !children.length, _classNames));

        if (!children || !children.length) {
            children = React.createElement(
                'span',
                { className: prefix + 'select-menu-empty-content' },
                notFoundContent || locale.notFoundContent
            );
        }

        var customProps = _extends({}, menuProps, {
            children: children,
            role: 'listbox',
            selectedKeys: selectedKeys,
            focusedKey: highlightKey,
            focusable: false,
            selectMode: isSingle(mode) ? 'single' : 'multiple',
            onSelect: this.handleMenuSelect,
            onItemClick: this.handleItemClick,
            header: this.renderMenuHeader(),
            onClick: this.handleMenuBodyClick,
            onMouseDown: this.handleMouseDown,
            className: menuClassName
        });
        var menuStyle = this.shouldAutoWidth() ? { width: this.width } : { minWidth: this.width };

        return useVirtual && children.length > 10 ? React.createElement(
            'div',
            { className: prefix + 'select-menu-wrapper', style: _extends({ position: 'relative' }, menuStyle) },
            React.createElement(
                VirtualList,
                {
                    itemsRenderer: function itemsRenderer(items, _ref) {
                        return React.createElement(
                            Menu,
                            _extends({
                                ref: function ref(c) {
                                    _ref(c);
                                    _this6.menuRef = c;
                                },
                                flatenContent: true
                            }, customProps),
                            items
                        );
                    }
                },
                children
            )
        ) : React.createElement(Menu, _extends({}, customProps, { style: menuStyle }));
    };

    /**
     * render menu item
     * @protected
     * @param {Array} dataSource
     */


    Base.prototype.renderMenuItem = function renderMenuItem(dataSource) {
        var _this7 = this;

        var _props5 = this.props,
            prefix = _props5.prefix,
            itemRender = _props5.itemRender,
            showDataSourceChildren = _props5.showDataSourceChildren;
        // If it has.

        var searchKey = void 0;
        if (this.isAutoComplete) {
            // In AutoComplete, value is the searchKey
            searchKey = this.state.value;
        } else {
            searchKey = this.state.searchValue;
        }

        return dataSource.map(function (item, index) {
            if (!item) {
                return null;
            }
            if (Array.isArray(item.children) && showDataSourceChildren) {
                return React.createElement(
                    MenuGroup,
                    { key: index, label: item.label },
                    _this7.renderMenuItem(item.children)
                );
            } else {
                var itemProps = {
                    role: 'option',
                    key: item.value,
                    className: prefix + 'select-menu-item',
                    disabled: item.disabled
                };

                if ('title' in item) {
                    itemProps.title = item.title;
                }

                return React.createElement(
                    MenuItem,
                    itemProps,
                    itemRender(item, searchKey)
                );
            }
        });
    };

    /**
     * ?????? arrow ??? label ????????????????????? input ???
     * @override
     */
    Base.prototype.focusInput = function focusInput() {
        this.inputRef.focus();
    };

    Base.prototype.focus = function focus() {
        var _inputRef;

        (_inputRef = this.inputRef).focus.apply(_inputRef, arguments);
    };

    Base.prototype.beforeOpen = function beforeOpen() {
        var _state2 = this.state,
            value = _state2.value,
            highlightKey = _state2.highlightKey;

        if (this.props.mode === 'single' && !value && !highlightKey) {
            this.setFirstHightLightKeyForMenu();
        }
        this.syncWidth();
    };

    Base.prototype.beforeClose = function beforeClose() {};

    Base.prototype.afterClose = function afterClose() {};

    Base.prototype.shouldAutoWidth = function shouldAutoWidth() {
        if (this.props.popupComponent) {
            return false;
        }

        return this.props.autoWidth;
    };

    Base.prototype.render = function render(props) {
        var _classNames2;

        var prefix = props.prefix,
            mode = props.mode,
            popupProps = props.popupProps,
            popupContainer = props.popupContainer,
            popupClassName = props.popupClassName,
            popupStyle = props.popupStyle,
            popupContent = props.popupContent,
            canCloseByTrigger = props.canCloseByTrigger,
            followTrigger = props.followTrigger,
            cache = props.cache,
            popupComponent = props.popupComponent,
            isPreview = props.isPreview,
            renderPreview = props.renderPreview,
            style = props.style,
            className = props.className;


        var cls = classNames((_classNames2 = {}, _classNames2[prefix + 'select-auto-complete-menu'] = !popupContent && this.isAutoComplete, _classNames2[prefix + 'select-' + mode + '-menu'] = !popupContent && !!mode, _classNames2), popupClassName || popupProps.className);

        if (isPreview) {
            if (this.isAutoComplete) {
                return React.createElement(Input, {
                    style: style,
                    className: className,
                    isPreview: isPreview,
                    renderPreview: renderPreview,
                    value: this.state.value
                });
            } else {
                var value = this.state.value;
                var valueDS = this.state.value;

                if (!this.useDetailValue()) {
                    if (value === this.valueDataSource.value) {
                        valueDS = this.valueDataSource.valueDS;
                    } else {
                        valueDS = getValueDataSource(value, this.valueDataSource.mapValueDS, this.dataStore.getMapDS()).valueDS;
                    }
                }

                if (typeof renderPreview === 'function') {
                    var _classNames3;

                    var previewCls = classNames((_classNames3 = {}, _classNames3[prefix + 'form-preview'] = true, _classNames3[className] = !!className, _classNames3));
                    return React.createElement(
                        'div',
                        { style: style, className: previewCls },
                        renderPreview(valueDS, this.props)
                    );
                } else {
                    var fillProps = this.props.fillProps;

                    if (mode === 'single') {
                        return React.createElement(Input, {
                            style: style,
                            className: className,
                            isPreview: isPreview,
                            value: valueDS ? fillProps ? valueDS[fillProps] : valueDS.label : ''
                        });
                    } else {
                        return React.createElement(Input, {
                            style: style,
                            className: className,
                            isPreview: isPreview,
                            value: (valueDS || []).map(function (i) {
                                return i.label;
                            }).join(', ')
                        });
                    }
                }
            }
        }

        var _props = _extends({
            triggerType: 'click',
            autoFocus: !!this.props.popupAutoFocus,
            cache: cache
        }, popupProps, {
            //beforeOpen node not mount, afterOpen too slow.
            // from display:none to block, we may need to recompute width
            beforeOpen: makeChain(this.beforeOpen, popupProps.beforeOpen),
            beforeClose: makeChain(this.beforeClose, popupProps.beforeClose),
            afterClose: makeChain(this.afterClose, popupProps.afterClose),
            canCloseByTrigger: canCloseByTrigger,
            followTrigger: followTrigger,
            visible: this.state.visible,
            onVisibleChange: this.handleVisibleChange,
            shouldUpdatePosition: true,
            container: popupContainer || popupProps.container,
            className: cls,
            style: popupStyle || popupProps.style
        });

        var Tag = popupComponent ? popupComponent : Popup;

        return React.createElement(
            Tag,
            _extends({}, _props, { trigger: this.renderSelect(), ref: this.savePopupRef }),
            popupContent ? React.createElement(
                'div',
                {
                    className: prefix + 'select-popup-wrap',
                    style: this.shouldAutoWidth() ? { width: this.width } : {}
                },
                popupContent
            ) : React.createElement(
                'div',
                { className: prefix + 'select-spacing-tb' },
                this.renderMenu()
            )
        );
    };

    return Base;
}(React.Component), _class.propTypes = {
    prefix: PropTypes.string,
    /**
     * ???????????????
     */
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    // ??????????????????????????????
    value: PropTypes.any, // to be override
    // ?????????????????????
    defaultValue: PropTypes.any, // to be override
    /**
     * ??????????????????????????????
     */
    placeholder: PropTypes.string,
    /**
     * ????????????????????????????????????
     */
    autoWidth: PropTypes.bool,
    /**
     * ??????????????? label
     */
    label: PropTypes.node,
    /**
     * ?????????????????????????????????????????????
     */
    hasClear: PropTypes.bool,
    /**
     * ????????????
     */
    state: PropTypes.oneOf(['error', 'loading', 'success', 'warning']),
    /**
     * ????????????????????????????????????????????????????????????
     */
    readOnly: PropTypes.bool,
    /**
     * ?????????????????????
     */
    disabled: PropTypes.bool,
    /**
     * ????????????????????????
     */
    visible: PropTypes.bool,
    /**
     * ???????????????????????????
     */
    defaultVisible: PropTypes.bool,
    /**
     * ???????????????????????????????????????
     * @param {Boolean} visible ??????????????????
     * @param {String} type ???????????????????????????????????? fromContent ?????????Dropdown??????????????? fromTrigger ?????????trigger?????????????????? docClick ?????????document???????????????
     */
    onVisibleChange: PropTypes.func,
    /**
     * ???????????????????????????
     */
    popupContainer: PropTypes.any,
    /**
     * ????????? className
     */
    popupClassName: PropTypes.any,
    /**
     * ?????????????????????
     */
    popupStyle: PropTypes.object,
    /**
     * ???????????????????????????
     */
    popupProps: PropTypes.object,
    /**
     * ??????????????????
     */
    followTrigger: PropTypes.bool,
    /**
     * ????????????????????????
     */
    popupContent: PropTypes.node,
    /**
     * ???????????????????????????
     * @version 1.18
     */
    menuProps: PropTypes.object,
    /**
     * ???????????????????????????????????????????????????????????????????????????
     */
    filterLocal: PropTypes.bool,
    /**
     * ????????????????????????????????? Boolean ?????????????????????
     * @param {String} key ???????????????
     * @param {Object} item ???????????????item
     * @return {Boolean} ????????????
     */
    filter: PropTypes.func,
    /**
     * ??????????????? key???????????? autoHighlightFirstItem ????????????
     */
    defaultHighlightKey: PropTypes.string,
    /**
     * ?????? key???????????? autoHighlightFirstItem ?????????????????????????????????
     */
    highlightKey: PropTypes.string,
    /**
     * ????????????????????????????????????????????????
     */
    onToggleHighlightItem: PropTypes.func,
    /**
     * ???????????????????????????
     */
    autoHighlightFirstItem: PropTypes.bool,
    /**
     * ??????????????????????????????
     */
    useVirtual: PropTypes.bool,
    // ???????????????
    className: PropTypes.any,
    children: PropTypes.any,
    dataSource: PropTypes.array,
    itemRender: PropTypes.func,
    mode: PropTypes.string,
    notFoundContent: PropTypes.node,
    locale: PropTypes.object,
    rtl: PropTypes.bool,
    popupComponent: PropTypes.any,
    /**
     * ??????????????????
     */
    isPreview: PropTypes.bool,
    /**
     * ?????????????????????????????????
     * @param {number} value ?????????
     */
    renderPreview: PropTypes.func,
    showDataSourceChildren: PropTypes.bool
}, _class.defaultProps = {
    prefix: 'next-',
    size: 'medium',
    autoWidth: true,
    onChange: noop,
    onVisibleChange: noop,
    onToggleHighlightItem: noop,
    popupProps: {},
    filterLocal: true,
    filter: filter,
    itemRender: function itemRender(item) {
        return item.label || item.value;
    },
    locale: zhCN.Select,
    autoHighlightFirstItem: true,
    showDataSourceChildren: true,
    defaultHighlightKey: null
}, _temp);
Base.displayName = 'Base';
export { Base as default };
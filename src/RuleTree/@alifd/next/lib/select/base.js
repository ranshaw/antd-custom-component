'use strict';

exports.__esModule = true;
exports.default = undefined;

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

var _reactDom = require('react-dom');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _util = require('../util');

var _menu = require('../menu');

var _menu2 = _interopRequireDefault(_menu);

var _overlay = require('../overlay');

var _overlay2 = _interopRequireDefault(_overlay);

var _input = require('../input');

var _input2 = _interopRequireDefault(_input);

var _zhCn = require('../locale/zh-cn');

var _zhCn2 = _interopRequireDefault(_zhCn);

var _dataStore = require('./data-store');

var _dataStore2 = _interopRequireDefault(_dataStore);

var _virtualList = require('../virtual-list');

var _virtualList2 = _interopRequireDefault(_virtualList);

var _util2 = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Popup = _overlay2.default.Popup;
var MenuItem = _menu2.default.Item,
    MenuGroup = _menu2.default.Group;
var noop = _util.func.noop,
    bindCtx = _util.func.bindCtx,
    makeChain = _util.func.makeChain;


function preventDefault(e) {
    e.preventDefault();
}

var Base = (_temp = _class = function (_React$Component) {
    (0, _inherits3.default)(Base, _React$Component);

    function Base(props) {
        (0, _classCallCheck3.default)(this, Base);

        var _this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call(this, props));

        _this.handleMouseDown = function (e) {
            if (!_this.props.popupAutoFocus) {
                preventDefault(e);
            }
        };

        _this.saveSelectRef = function (ref) {
            _this.selectDOM = (0, _reactDom.findDOMNode)(ref);
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

        _this.dataStore = new _dataStore2.default({
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

        _util.events.on(window, 'resize', this.handleResize);
    };

    Base.prototype.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
        if (prevProps.label !== this.props.label || prevState.value !== this.state.value) {
            this.syncWidth();
        }
    };

    Base.prototype.componentWillUnmount = function componentWillUnmount() {
        _util.events.off(window, 'resize', this.handleResize);
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

        var width = _util.dom.getStyle(this.selectDOM, 'width');
        if (width && this.width !== width) {
            this.width = width;

            if (this.popupRef && this.shouldAutoWidth()) {
                // overy ??? node ?????????????????????????????????????????????????????????
                setTimeout(function () {
                    if (_this3.popupRef && _this3.popupRef.getInstance().overlay) {
                        _util.dom.setStyle(_this3.popupRef.getInstance().overlay.getInstance().getContentNode(), 'width', _this3.width);
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

        if (_react.Children.count(children)) {
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
                var menuNode = (0, _reactDom.findDOMNode)(_this5.menuRef);
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

        if ((0, _util2.isNull)(value) || value.length === 0 || this.isAutoComplete) {
            selectedKeys = [];
        } else if ((0, _util2.isSingle)(mode)) {
            selectedKeys = [(0, _util2.valueToSelectKey)(value)];
        } else {
            selectedKeys = [].concat(value).map(function (n) {
                return (0, _util2.valueToSelectKey)(n);
            });
        }

        var children = this.renderMenuItem(dataSource);

        var menuClassName = (0, _classnames2.default)((_classNames = {}, _classNames[prefix + 'select-menu'] = true, _classNames[prefix + 'select-menu-empty'] = !children || !children.length, _classNames));

        if (!children || !children.length) {
            children = _react2.default.createElement(
                'span',
                { className: prefix + 'select-menu-empty-content' },
                notFoundContent || locale.notFoundContent
            );
        }

        var customProps = (0, _extends3.default)({}, menuProps, {
            children: children,
            role: 'listbox',
            selectedKeys: selectedKeys,
            focusedKey: highlightKey,
            focusable: false,
            selectMode: (0, _util2.isSingle)(mode) ? 'single' : 'multiple',
            onSelect: this.handleMenuSelect,
            onItemClick: this.handleItemClick,
            header: this.renderMenuHeader(),
            onClick: this.handleMenuBodyClick,
            onMouseDown: this.handleMouseDown,
            className: menuClassName
        });
        var menuStyle = this.shouldAutoWidth() ? { width: this.width } : { minWidth: this.width };

        return useVirtual && children.length > 10 ? _react2.default.createElement(
            'div',
            { className: prefix + 'select-menu-wrapper', style: (0, _extends3.default)({ position: 'relative' }, menuStyle) },
            _react2.default.createElement(
                _virtualList2.default,
                {
                    itemsRenderer: function itemsRenderer(items, _ref) {
                        return _react2.default.createElement(
                            _menu2.default,
                            (0, _extends3.default)({
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
        ) : _react2.default.createElement(_menu2.default, (0, _extends3.default)({}, customProps, { style: menuStyle }));
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
                return _react2.default.createElement(
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

                return _react2.default.createElement(
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


        var cls = (0, _classnames2.default)((_classNames2 = {}, _classNames2[prefix + 'select-auto-complete-menu'] = !popupContent && this.isAutoComplete, _classNames2[prefix + 'select-' + mode + '-menu'] = !popupContent && !!mode, _classNames2), popupClassName || popupProps.className);

        if (isPreview) {
            if (this.isAutoComplete) {
                return _react2.default.createElement(_input2.default, {
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
                        valueDS = (0, _util2.getValueDataSource)(value, this.valueDataSource.mapValueDS, this.dataStore.getMapDS()).valueDS;
                    }
                }

                if (typeof renderPreview === 'function') {
                    var _classNames3;

                    var previewCls = (0, _classnames2.default)((_classNames3 = {}, _classNames3[prefix + 'form-preview'] = true, _classNames3[className] = !!className, _classNames3));
                    return _react2.default.createElement(
                        'div',
                        { style: style, className: previewCls },
                        renderPreview(valueDS, this.props)
                    );
                } else {
                    var fillProps = this.props.fillProps;

                    if (mode === 'single') {
                        return _react2.default.createElement(_input2.default, {
                            style: style,
                            className: className,
                            isPreview: isPreview,
                            value: valueDS ? fillProps ? valueDS[fillProps] : valueDS.label : ''
                        });
                    } else {
                        return _react2.default.createElement(_input2.default, {
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

        var _props = (0, _extends3.default)({
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

        return _react2.default.createElement(
            Tag,
            (0, _extends3.default)({}, _props, { trigger: this.renderSelect(), ref: this.savePopupRef }),
            popupContent ? _react2.default.createElement(
                'div',
                {
                    className: prefix + 'select-popup-wrap',
                    style: this.shouldAutoWidth() ? { width: this.width } : {}
                },
                popupContent
            ) : _react2.default.createElement(
                'div',
                { className: prefix + 'select-spacing-tb' },
                this.renderMenu()
            )
        );
    };

    return Base;
}(_react2.default.Component), _class.propTypes = {
    prefix: _propTypes2.default.string,
    /**
     * ???????????????
     */
    size: _propTypes2.default.oneOf(['small', 'medium', 'large']),
    // ??????????????????????????????
    value: _propTypes2.default.any, // to be override
    // ?????????????????????
    defaultValue: _propTypes2.default.any, // to be override
    /**
     * ??????????????????????????????
     */
    placeholder: _propTypes2.default.string,
    /**
     * ????????????????????????????????????
     */
    autoWidth: _propTypes2.default.bool,
    /**
     * ??????????????? label
     */
    label: _propTypes2.default.node,
    /**
     * ?????????????????????????????????????????????
     */
    hasClear: _propTypes2.default.bool,
    /**
     * ????????????
     */
    state: _propTypes2.default.oneOf(['error', 'loading', 'success', 'warning']),
    /**
     * ????????????????????????????????????????????????????????????
     */
    readOnly: _propTypes2.default.bool,
    /**
     * ?????????????????????
     */
    disabled: _propTypes2.default.bool,
    /**
     * ????????????????????????
     */
    visible: _propTypes2.default.bool,
    /**
     * ???????????????????????????
     */
    defaultVisible: _propTypes2.default.bool,
    /**
     * ???????????????????????????????????????
     * @param {Boolean} visible ??????????????????
     * @param {String} type ???????????????????????????????????? fromContent ?????????Dropdown??????????????? fromTrigger ?????????trigger?????????????????? docClick ?????????document???????????????
     */
    onVisibleChange: _propTypes2.default.func,
    /**
     * ???????????????????????????
     */
    popupContainer: _propTypes2.default.any,
    /**
     * ????????? className
     */
    popupClassName: _propTypes2.default.any,
    /**
     * ?????????????????????
     */
    popupStyle: _propTypes2.default.object,
    /**
     * ???????????????????????????
     */
    popupProps: _propTypes2.default.object,
    /**
     * ??????????????????
     */
    followTrigger: _propTypes2.default.bool,
    /**
     * ????????????????????????
     */
    popupContent: _propTypes2.default.node,
    /**
     * ???????????????????????????
     * @version 1.18
     */
    menuProps: _propTypes2.default.object,
    /**
     * ???????????????????????????????????????????????????????????????????????????
     */
    filterLocal: _propTypes2.default.bool,
    /**
     * ????????????????????????????????? Boolean ?????????????????????
     * @param {String} key ???????????????
     * @param {Object} item ???????????????item
     * @return {Boolean} ????????????
     */
    filter: _propTypes2.default.func,
    /**
     * ??????????????? key???????????? autoHighlightFirstItem ????????????
     */
    defaultHighlightKey: _propTypes2.default.string,
    /**
     * ?????? key???????????? autoHighlightFirstItem ?????????????????????????????????
     */
    highlightKey: _propTypes2.default.string,
    /**
     * ????????????????????????????????????????????????
     */
    onToggleHighlightItem: _propTypes2.default.func,
    /**
     * ???????????????????????????
     */
    autoHighlightFirstItem: _propTypes2.default.bool,
    /**
     * ??????????????????????????????
     */
    useVirtual: _propTypes2.default.bool,
    // ???????????????
    className: _propTypes2.default.any,
    children: _propTypes2.default.any,
    dataSource: _propTypes2.default.array,
    itemRender: _propTypes2.default.func,
    mode: _propTypes2.default.string,
    notFoundContent: _propTypes2.default.node,
    locale: _propTypes2.default.object,
    rtl: _propTypes2.default.bool,
    popupComponent: _propTypes2.default.any,
    /**
     * ??????????????????
     */
    isPreview: _propTypes2.default.bool,
    /**
     * ?????????????????????????????????
     * @param {number} value ?????????
     */
    renderPreview: _propTypes2.default.func,
    showDataSourceChildren: _propTypes2.default.bool
}, _class.defaultProps = {
    prefix: 'next-',
    size: 'medium',
    autoWidth: true,
    onChange: noop,
    onVisibleChange: noop,
    onToggleHighlightItem: noop,
    popupProps: {},
    filterLocal: true,
    filter: _util2.filter,
    itemRender: function itemRender(item) {
        return item.label || item.value;
    },
    locale: _zhCn2.default.Select,
    autoHighlightFirstItem: true,
    showDataSourceChildren: true,
    defaultHighlightKey: null
}, _temp);
Base.displayName = 'Base';
exports.default = Base;
module.exports = exports['default'];
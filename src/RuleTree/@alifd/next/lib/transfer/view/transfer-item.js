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

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _menu = require('../../menu');

var _menu2 = _interopRequireDefault(_menu);

var _util = require('../../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Item = _menu2.default.Item,
    CheckboxItem = _menu2.default.CheckboxItem;
var bindCtx = _util.func.bindCtx;
var pickOthers = _util.obj.pickOthers;
var getOffset = _util.dom.getOffset;
var TransferItem = (_temp = _class = function (_Component) {
    (0, _inherits3.default)(TransferItem, _Component);

    function TransferItem(props) {
        (0, _classCallCheck3.default)(this, TransferItem);

        var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call(this, props));

        _this.state = {
            highlight: false
        };

        bindCtx(_this, ['getItemDOM', 'handleClick', 'handleDragStart', 'handleDragOver', 'handleDragEnd', 'handleDrop']);
        return _this;
    }

    TransferItem.prototype.componentDidMount = function componentDidMount() {
        var _this2 = this;

        if (this.props.needHighlight) {
            this.addHighlightTimer = setTimeout(function () {
                _this2.setState({
                    highlight: true
                });
            }, 1);
            this.removeHighlightTimer = setTimeout(function () {
                _this2.setState({
                    highlight: false
                });
            }, 201);
        }
    };

    TransferItem.prototype.componentWillUnmount = function componentWillUnmount() {
        clearTimeout(this.addHighlightTimer);
        clearTimeout(this.removeHighlightTimer);
    };

    TransferItem.prototype.getItemDOM = function getItemDOM(ref) {
        this.item = ref;
    };

    TransferItem.prototype.handleClick = function handleClick() {
        var _props = this.props,
            onClick = _props.onClick,
            panelPosition = _props.panelPosition,
            item = _props.item;

        onClick(panelPosition === 'left' ? 'right' : 'left', item.value);
    };

    TransferItem.prototype.handleDragStart = function handleDragStart(ev) {
        ev && ev.dataTransfer && typeof ev.dataTransfer.setData === 'function' && ev.dataTransfer.setData('text/plain', ev.target.id);
        var _props2 = this.props,
            onDragStart = _props2.onDragStart,
            panelPosition = _props2.panelPosition,
            item = _props2.item;

        onDragStart(panelPosition, item.value);
    };

    TransferItem.prototype.getDragGap = function getDragGap(e) {
        var referenceTop = getOffset(e.currentTarget).top;
        var referenceHeight = e.currentTarget.offsetHeight;
        return e.pageY <= referenceTop + referenceHeight / 2 ? 'before' : 'after';
    };

    TransferItem.prototype.handleDragOver = function handleDragOver(e) {
        var _props3 = this.props,
            panelPosition = _props3.panelPosition,
            dragPosition = _props3.dragPosition,
            onDragOver = _props3.onDragOver,
            item = _props3.item;

        if (panelPosition === dragPosition) {
            e.preventDefault();

            var dragGap = this.getDragGap(e);
            if (this.dragGap !== dragGap) {
                this.dragGap = dragGap;
                onDragOver(item.value);
            }
        }
    };

    TransferItem.prototype.handleDragEnd = function handleDragEnd() {
        var onDragEnd = this.props.onDragEnd;

        onDragEnd();
    };

    TransferItem.prototype.handleDrop = function handleDrop(e) {
        e.preventDefault();

        var _props4 = this.props,
            onDrop = _props4.onDrop,
            item = _props4.item,
            panelPosition = _props4.panelPosition,
            dragValue = _props4.dragValue;

        onDrop(panelPosition, dragValue, item.value, this.dragGap);
    };

    TransferItem.prototype.render = function render() {
        var _cx;

        var _props5 = this.props,
            prefix = _props5.prefix,
            mode = _props5.mode,
            checked = _props5.checked,
            disabled = _props5.disabled,
            item = _props5.item,
            onCheck = _props5.onCheck,
            itemRender = _props5.itemRender,
            draggable = _props5.draggable,
            dragOverValue = _props5.dragOverValue,
            panelPosition = _props5.panelPosition,
            dragPosition = _props5.dragPosition;

        var others = pickOthers(Object.keys(TransferItem.propTypes), this.props);
        var highlight = this.state.highlight;

        var isSimple = mode === 'simple';

        var classNames = (0, _classnames2.default)((_cx = {}, _cx[prefix + 'transfer-panel-item'] = true, _cx[prefix + 'insert-' + this.dragGap] = dragOverValue === item.value && panelPosition === dragPosition, _cx[prefix + 'focused'] = highlight, _cx[prefix + 'simple'] = isSimple, _cx));

        var children = itemRender(item);
        var itemProps = (0, _extends3.default)({
            ref: this.getItemDOM,
            className: classNames,
            children: children,
            disabled: disabled,
            draggable: draggable && !disabled,
            onDragStart: this.handleDragStart,
            onDragOver: this.handleDragOver,
            onDragEnd: this.handleDragEnd,
            onDrop: this.handleDrop
        }, others);
        var title = void 0;
        if (typeof children === 'string') {
            title = children;
        }
        if (isSimple) {
            if (!itemProps.disabled) {
                itemProps.onClick = this.handleClick;
            }

            return _react2.default.createElement(Item, (0, _extends3.default)({ title: title }, itemProps));
        }

        return _react2.default.createElement(CheckboxItem, (0, _extends3.default)({
            checked: checked,
            onChange: onCheck.bind(this, item.value),
            title: title
        }, itemProps));
    };

    return TransferItem;
}(_react.Component), _class.menuChildType = CheckboxItem.menuChildType, _class.propTypes = {
    prefix: _propTypes2.default.string,
    mode: _propTypes2.default.oneOf(['normal', 'simple']),
    value: _propTypes2.default.array,
    disabled: _propTypes2.default.bool,
    item: _propTypes2.default.object,
    onCheck: _propTypes2.default.func,
    onClick: _propTypes2.default.func,
    needHighlight: _propTypes2.default.bool,
    itemRender: _propTypes2.default.func,
    draggable: _propTypes2.default.bool,
    onDragStart: _propTypes2.default.func,
    onDragOver: _propTypes2.default.func,
    onDragEnd: _propTypes2.default.func,
    onDrop: _propTypes2.default.func,
    dragPosition: _propTypes2.default.oneOf(['left', 'right']),
    dragValue: _propTypes2.default.string,
    dragOverValue: _propTypes2.default.string,
    panelPosition: _propTypes2.default.oneOf(['left', 'right'])
}, _temp);
TransferItem.displayName = 'TransferItem';
exports.default = TransferItem;
module.exports = exports['default'];
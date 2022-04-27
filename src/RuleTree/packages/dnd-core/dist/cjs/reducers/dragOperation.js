"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = dragOperation;

var _dragDrop = require("../actions/dragDrop");

var _registry = require("../actions/registry");

var _js_utils = require("../utils/js_utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var initialState = {
  itemType: null,
  item: null,
  sourceId: null,
  targetIds: [],
  dropResult: null,
  didDrop: false,
  isSourcePublic: null
};

function dragOperation() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var payload = action.payload;

  switch (action.type) {
    case _dragDrop.BEGIN_DRAG:
      return _objectSpread({}, state, {
        itemType: payload.itemType,
        item: payload.item,
        sourceId: payload.sourceId,
        isSourcePublic: payload.isSourcePublic,
        dropResult: null,
        didDrop: false
      });

    case _dragDrop.PUBLISH_DRAG_SOURCE:
      return _objectSpread({}, state, {
        isSourcePublic: true
      });

    case _dragDrop.HOVER:
      return _objectSpread({}, state, {
        targetIds: payload.targetIds
      });

    case _registry.REMOVE_TARGET:
      if (state.targetIds.indexOf(payload.targetId) === -1) {
        return state;
      }

      return _objectSpread({}, state, {
        targetIds: (0, _js_utils.without)(state.targetIds, payload.targetId)
      });

    case _dragDrop.DROP:
      return _objectSpread({}, state, {
        dropResult: payload.dropResult,
        didDrop: true,
        targetIds: []
      });

    case _dragDrop.END_DRAG:
      return _objectSpread({}, state, {
        itemType: null,
        item: null,
        sourceId: null,
        dropResult: null,
        didDrop: false,
        isSourcePublic: null,
        targetIds: []
      });

    default:
      return state;
  }
}
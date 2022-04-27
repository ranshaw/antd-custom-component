import _extends from "@babel/runtime/helpers/extends";
import React from 'react';
import { DragSource } from 'react-dnd';
import constants from './constants';
import GovIcon from '@aligov/icon';
var ALIGN_CENTER = constants.ALIGN_CENTER;

var handleStyle = _extends({
  cursor: 'move',
  marginRight: 6
}, ALIGN_CENTER);

var Drag = function Drag(_ref) {
  var isDragging = _ref.isDragging,
      connectDragSource = _ref.connectDragSource,
      connectDragPreview = _ref.connectDragPreview,
      x = _ref.x,
      y = _ref.y,
      children = _ref.children;
  var opacity = isDragging ? 0.4 : 1;
  var dragHandler = /*#__PURE__*/React.createElement("span", {
    style: handleStyle
  }, /*#__PURE__*/React.createElement(GovIcon, {
    className: "icon",
    custom: true,
    type: "tuodong"
  }));
  return connectDragPreview( /*#__PURE__*/React.createElement("div", {
    style: {
      opacity: opacity,
      left: x,
      top: y
    },
    className: "drag"
  }, connectDragSource(dragHandler), /*#__PURE__*/React.createElement("span", {
    style: _extends({
      display: 'flex'
    }, ALIGN_CENTER)
  }, children)));
};

export default DragSource(function (_ref2) {
  var type = _ref2.type;
  return type;
}, {
  beginDrag: function beginDrag(props) {
    return props;
  }
}, function (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
})(Drag);
export var UnDrag = function UnDrag(_ref3) {
  var children = _ref3.children,
      x = _ref3.x,
      y = _ref3.y;
  return /*#__PURE__*/React.createElement("div", {
    style: _extends({
      position: 'absolute',
      left: x,
      top: y,
      display: 'flex'
    }, ALIGN_CENTER)
  }, children);
};
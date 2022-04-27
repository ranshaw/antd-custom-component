"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sArrowUp = sArrowUp;
exports.sArrowDown = sArrowDown;
exports.sArrowRight = sArrowRight;
exports.sArrowLeft = sArrowLeft;

function sArrowUp() {
  var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '5px';
  var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'black';
  return {
    width: 0,
    height: 0,
    borderLeft: "".concat(width, " solid transparent"),
    borderRight: "".concat(width, " solid transparent"),
    borderBottom: "".concat(width, " solid ").concat(color)
  };
}

function sArrowDown() {
  var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '5px';
  var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'black';
  return {
    width: 0,
    height: 0,
    borderLeft: "".concat(width, " solid transparent"),
    borderRight: "".concat(width, " solid transparent"),
    borderTop: "".concat(width, " solid ").concat(color)
  };
}

function sArrowRight() {
  var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '5px';
  var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'black';
  return {
    width: 0,
    height: 0,
    borderTop: "".concat(width, " solid transparent"),
    borderBottom: "".concat(width, " solid transparent"),
    borderLeft: "".concat(width, " solid ").concat(color)
  };
}

function sArrowLeft() {
  var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '5px';
  var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'black';
  return {
    width: 0,
    height: 0,
    borderTop: "".concat(width, " solid transparent"),
    borderBottom: "".concat(width, " solid transparent"),
    borderRight: "".concat(width, " solid ").concat(color)
  };
}
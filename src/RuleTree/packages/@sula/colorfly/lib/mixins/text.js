"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sTextEllipsis = sTextEllipsis;

function sTextEllipsis() {
  var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 150;
  return {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'inline-block',
    width: width
  };
}
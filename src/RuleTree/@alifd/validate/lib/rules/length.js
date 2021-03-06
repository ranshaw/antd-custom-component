"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var util = _interopRequireWildcard(require("../util"));

/**
 *  Rule for validating minimum and maximum allowed values.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param errors An array of errors that this rule may add
 *  validation errors to.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */
function length(rule, value, errors, options) {
  var key = null;
  var isNum = typeof value === 'number';
  var isStr = typeof value === 'string';
  var isArr = Array.isArray(value);

  if (isNum) {
    key = 'number';
  } else if (isStr) {
    key = 'string';
  } else if (isArr) {
    key = 'array';
  }

  if (!key) {
    return false;
  }

  var val = value;
  var length = Number(rule.length);
  var maxLength = Number(rule.maxLength);
  var minLength = Number(rule.minLength);

  if (minLength || maxLength || length) {
    if (isNum) {
      val = "".concat(val);
    }

    val = val.length;

    if (length && val !== rule.length) {
      errors.push(util.format(options.messages[key].length, rule.aliasName || rule.field, rule.length));
    } else if (val < minLength) {
      errors.push(util.format(options.messages[key].minLength, rule.aliasName || rule.field, rule.minLength));
    } else if (val > maxLength) {
      errors.push(util.format(options.messages[key].maxLength, rule.aliasName || rule.field, rule.maxLength));
    }
  }
}

var _default = length;
exports.default = _default;
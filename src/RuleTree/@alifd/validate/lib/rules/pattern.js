"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var util = _interopRequireWildcard(require("../util"));

/**
 *  Rule for validating a regular expression pattern.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param errors An array of errors that this rule may add
 *  validation errors to.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */
function pattern(rule, value, errors, options) {
  if (rule.pattern) {
    if (rule.pattern instanceof RegExp) {
      if (!rule.pattern.test(value)) {
        errors.push(util.format(options.messages.pattern, rule.aliasName || rule.field, value, rule.pattern));
      }
    } else if (typeof rule.pattern === 'string') {
      var _pattern = new RegExp(rule.pattern);

      if (!_pattern.test(value)) {
        errors.push(util.format(options.messages.pattern, rule.aliasName || rule.field, value, rule.pattern));
      }
    }
  }
}

var _default = pattern;
exports.default = _default;
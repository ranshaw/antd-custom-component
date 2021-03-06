"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _util = require("./util");

var _messages2 = _interopRequireDefault(require("./messages"));

var _validator = require("./validator");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function noop() {}

function serializeRules(source, rules) {
  // serialize rules
  var arr;
  var value;
  var series = {};
  var names = Object.keys(rules);
  names.forEach(function (name) {
    arr = rules[name];
    value = source[name];

    if (!Array.isArray(arr)) {
      arr = [arr];
    }

    arr.forEach(function (rule) {
      rule.validator = (0, _validator.getValidationMethod)(rule);
      rule.field = name;

      if (!rule.validator) {
        return;
      }

      series[name] = series[name] || [];
      series[name].push({
        rule: rule,
        value: value,
        source: source,
        field: name
      });
    });
  });
  return series;
}

var Schema = /*#__PURE__*/function () {
  function Schema(rules) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck2.default)(this, Schema);
    this._rules = rules;
    this._options = _objectSpread(_objectSpread({}, options), {}, {
      messages: _objectSpread(_objectSpread({}, _messages2.default), options.messages)
    });
    this.complete = [];
  }

  (0, _createClass2.default)(Schema, [{
    key: "abort",
    value: function abort() {
      for (var i = 0; i < this.complete.length; i++) {
        this.complete[i] = noop;
      }
    }
  }, {
    key: "messages",
    value: function messages(_messages) {
      this._options.messages = Object.assign({}, this._options.messages, _messages);
    }
    /**
     *
     * @param {Object} source - map of field names and values to use in validation
     * @param {Function} callback - OPTIONAL - callback to run after all
     * @returns {null | Promise}
     *          - { null } - if using callbacks
     *          - { Promise }
     *              - { errors: null } - if no rules or no errors
     *              - { errors: Array, fields: Object } - errors from validation and fields that have errors
     */

  }, {
    key: "validate",
    value: function validate(source, callback) {
      var _this = this;

      if (!callback) {
        return this.validatePromise(source);
      }

      if (!this._rules || Object.keys(this._rules).length === 0) {
        if (callback) {
          callback(null);
        }

        return;
      }

      var series = serializeRules(source, this._rules);

      if (Object.keys(series).length === 0) {
        callback(null);
      } // callback function for all rules return


      function complete(results) {
        var i;
        var field;
        var errors = [];
        var fields = {};

        function add(e) {
          if (Array.isArray(e)) {
            errors = errors.concat(e);
          } else {
            errors.push(e);
          }
        }

        for (i = 0; i < results.length; i++) {
          add(results[i]);
        }

        if (!errors.length) {
          errors = null;
          fields = null;
        } else {
          for (i = 0; i < errors.length; i++) {
            field = errors[i].field;
            fields[field] = fields[field] || [];
            fields[field].push(errors[i]);
          }
        }

        callback(errors, fields);
      }

      this.complete.push(complete);
      var idx = this.complete.length; // async validate

      (0, _util.asyncMap)(series, this._options, function (data, doIt) {
        var rule = data.rule;
        rule.field = data.field;

        function cb(e) {
          var errors = e; // fix e=/""/null/undefiend.
          // ignore e=true/false;

          if (typeof errors !== 'boolean' && !errors) {
            errors = [];
          }

          if (!Array.isArray(errors)) {
            errors = [errors];
          } // ???????????????


          if (errors.length && rule.message) {
            errors = [].concat(rule.message);
          }

          errors = errors.map((0, _util.complementError)(rule));
          doIt(errors);
        }

        var res = rule.validator(rule, data.value, cb, _this._options);

        if (res && res.then) {
          res.then(function () {
            return cb();
          }, function (e) {
            return cb(e);
          });
        }
      }, function (results) {
        _this.complete[idx - 1](results);
      });
    }
    /**
     *
     * @param {Object} source - map of field names and values to use in validation
     * @returns {Promise}
     *          - { errors: null } if no rules or no errors
     *          - { errors: Array, fields: Object } - errors from validation and fields that have errors
     */

  }, {
    key: "validatePromise",
    value: function () {
      var _validatePromise = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(source) {
        var _this2 = this;

        var series, results;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(!this._rules || Object.keys(this._rules).length === 0)) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt("return", Promise.resolve({
                  errors: null
                }));

              case 2:
                series = serializeRules(source, this._rules);

                if (!(Object.keys(series).length === 0)) {
                  _context2.next = 5;
                  break;
                }

                return _context2.abrupt("return", Promise.resolve({
                  errors: null
                }));

              case 5:
                _context2.next = 7;
                return (0, _util.asyncMapPromise)(series, this._options, /*#__PURE__*/function () {
                  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(data) {
                    var rule, errors;
                    return _regenerator.default.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            rule = data.rule;
                            rule.field = data.field;
                            _context.prev = 2;
                            _context.next = 5;
                            return rule.validator(rule, data.value, null, _this2._options);

                          case 5:
                            errors = _context.sent;
                            _context.next = 11;
                            break;

                          case 8:
                            _context.prev = 8;
                            _context.t0 = _context["catch"](2);
                            errors = _context.t0;

                          case 11:
                            if (!errors) {
                              _context.next = 17;
                              break;
                            }

                            if (!Array.isArray(errors)) {
                              errors = [errors];
                            } // ???????????????


                            if (errors.length && rule.message) {
                              errors = [].concat(rule.message);
                            }

                            return _context.abrupt("return", errors.map((0, _util.complementError)(rule)));

                          case 17:
                            return _context.abrupt("return", []);

                          case 18:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee, null, [[2, 8]]);
                  }));

                  return function (_x2) {
                    return _ref.apply(this, arguments);
                  };
                }());

              case 7:
                results = _context2.sent;
                return _context2.abrupt("return", (0, _util.processErrorResults)(results));

              case 9:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function validatePromise(_x) {
        return _validatePromise.apply(this, arguments);
      }

      return validatePromise;
    }()
  }]);
  return Schema;
}();

var _default = Schema;
exports.default = _default;
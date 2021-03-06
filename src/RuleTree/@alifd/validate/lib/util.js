"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.format = format;
exports.asyncMap = asyncMap;
exports.asyncMapPromise = asyncMapPromise;
exports.complementError = complementError;
exports.processErrorResults = processErrorResults;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var formatRegExp = /%[sdj%]/g;

function format() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var i = 1;
  var f = args[0];
  var len = args.length;

  if (typeof f === 'function') {
    return f(args.slice(1));
  }

  if (typeof f === 'string') {
    var str = String(f).replace(formatRegExp, function (x) {
      if (x === '%%') {
        return '%';
      }

      if (i >= len) {
        return x;
      }

      switch (x) {
        case '%s':
          return String(args[i++]);

        case '%d':
          return Number(args[i++]);

        case '%j':
          try {
            return JSON.stringify(args[i++]);
          } catch (_) {
            return '[Circular]';
          }

        default:
          return x;
      }
    });
    return str;
  }

  return f;
}

function asyncSerialArray(arr, func, callback) {
  var index = 0;
  var arrLength = arr.length;

  function next(errors) {
    if (errors && errors.length) {
      callback(errors);
      return;
    }

    var original = index;
    index = index + 1;

    if (original < arrLength) {
      func(arr[original], next);
    } else {
      return callback([]);
    }
  }

  next([]);
}
/**
 * 平铺规则
 * @param  {object} objArr [description]
 * @return {Array}        [description]
 */


function flattenObjArr(objArr) {
  var ret = [];
  Object.keys(objArr).forEach(function (k) {
    Object.keys(objArr[k]).forEach(function (r) {
      ret.push(objArr[k][r]);
    });
  });
  return ret;
}
/**
 * 异步调用
 * @param  {map}   objArr   校验规则对象列表
 * @param  {object}   option   配置项
 * @param  {Function} func     每个校验规则
 * @param  {Function} callback 全部完成后的执行
 */


function asyncMap(objArr, option, func, callback) {
  // 发现第一个错误即返回
  if (option.first) {
    var flattenArr = flattenObjArr(objArr);
    return asyncSerialArray(flattenArr, func, callback);
  }

  var objArrKeys = Object.keys(objArr);
  var objArrLength = objArrKeys.length;
  var total = 0;
  var results = [];

  var next = function next(errors) {
    results.push(errors);
    total++;

    if (total === objArrLength) {
      return callback(results);
    }
  };

  objArrKeys.forEach(function (key) {
    var arr = objArr[key];
    asyncSerialArray(arr, func, next);
  });
}

function resolveErrorPromiseInSeries(_x, _x2) {
  return _resolveErrorPromiseInSeries.apply(this, arguments);
}

function _resolveErrorPromiseInSeries() {
  _resolveErrorPromiseInSeries = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(arr, func) {
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", arr.reduce( /*#__PURE__*/function () {
              var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(prevPromise, next) {
                var errors;
                return _regenerator.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return prevPromise;

                      case 3:
                        errors = _context.sent;
                        _context.next = 9;
                        break;

                      case 6:
                        _context.prev = 6;
                        _context.t0 = _context["catch"](0);
                        errors = _context.t0;

                      case 9:
                        if (!(errors && errors.length)) {
                          _context.next = 11;
                          break;
                        }

                        return _context.abrupt("return", errors);

                      case 11:
                        return _context.abrupt("return", func(next));

                      case 12:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[0, 6]]);
              }));

              return function (_x6, _x7) {
                return _ref.apply(this, arguments);
              };
            }(), Promise.resolve()));

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _resolveErrorPromiseInSeries.apply(this, arguments);
}

function asyncMapPromise(_x3, _x4, _x5) {
  return _asyncMapPromise.apply(this, arguments);
}

function _asyncMapPromise() {
  _asyncMapPromise = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(objArr, option, func) {
    var flatObjArr, objArrValues;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (!option.first) {
              _context3.next = 3;
              break;
            }

            flatObjArr = flattenObjArr(objArr);
            return _context3.abrupt("return", resolveErrorPromiseInSeries(flatObjArr, func));

          case 3:
            objArrValues = Object.values(objArr);
            return _context3.abrupt("return", Promise.all(objArrValues.map(function (val) {
              return resolveErrorPromiseInSeries(val, func);
            })));

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _asyncMapPromise.apply(this, arguments);
}

function complementError(rule) {
  return function (oe) {
    if (oe && oe.message) {
      oe.field = rule.field;
      return oe;
    }

    return {
      message: oe,
      field: rule.field
    };
  };
}
/**
 *
 * @param {Array} results errors from running validation
 * @returns {Object} { errors: Array, fields: Object }
 */


function processErrorResults() {
  var results = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var errors = [];
  var fields = {};

  function add(e) {
    if (Array.isArray(e)) {
      errors = errors.concat(e);
    } else {
      errors.push(e);
    }
  }

  for (var i = 0; i < results.length; i++) {
    add(results[i]);
  }

  if (!errors.length) {
    errors = null;
    fields = null;
  } else {
    for (var _i = 0; _i < errors.length; _i++) {
      var field = errors[_i].field;

      if (field) {
        fields[field] = fields[field] || [];
        fields[field].push(errors[_i]);
      }
    }
  }

  return {
    errors: errors,
    fields: fields
  };
}
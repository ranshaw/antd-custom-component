"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIn = getIn;
exports.setIn = setIn;
exports.deleteIn = deleteIn;
exports.getErrorStrs = getErrorStrs;
exports.getParams = getParams;
exports.getValueFromEvent = getValueFromEvent;
exports.mapValidateRules = mapValidateRules;
exports.warning = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _extends3 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

function getIn(state, name) {
  if (!state) {
    return state;
  }

  var path = typeof name === 'string' ? name.replace(/\[/, '.').replace(/\]/, '').split('.') : '';
  var length = path.length;

  if (!length) {
    return undefined;
  }

  var result = state;

  for (var i = 0; i < length && !!result; ++i) {
    result = result[path[i]];
  }

  return result;
}

var setInWithPath = function setInWithPath(state, value, path, pathIndex) {
  if (pathIndex >= path.length) {
    return value;
  }

  var first = path[pathIndex];
  var next = setInWithPath(state && state[first], value, path, pathIndex + 1);

  if (!state) {
    var initialized = isNaN(first) ? {} : [];
    initialized[first] = next;
    return initialized;
  }

  if (Array.isArray(state)) {
    var copy = [].concat(state);
    copy[first] = next;
    return copy;
  }

  return (0, _extends3.default)({}, state, (0, _defineProperty2.default)({}, first, next));
};

function setIn(state, name, value) {
  return setInWithPath(state, value, typeof name === 'string' ? name.replace(/\[/, '.').replace(/\]/, '').split('.') : '', 0);
}

function deleteIn(state, name) {
  if (!state) {
    return;
  }

  var path = typeof name === 'string' ? name.replace(/\[/, '.').replace(/\]/, '').split('.') : '';
  var length = path.length;

  if (!length) {
    return state;
  }

  var result = state;

  for (var i = 0; i < length && !!result; ++i) {
    if (i === length - 1) {
      delete result[path[i]];
    } else {
      result = result[path[i]];
    }
  }

  return state;
}

function getErrorStrs(errors, processErrorMessage) {
  if (errors) {
    return errors.map(function (e) {
      var message = typeof e.message !== 'undefined' ? e.message : e;

      if (typeof processErrorMessage === 'function') {
        return processErrorMessage(message);
      }

      return message;
    });
  }

  return errors;
}

function getParams(ns, cb) {
  var names = typeof ns === 'string' ? [ns] : ns;
  var callback = cb;

  if (cb === undefined && typeof names === 'function') {
    callback = names;
    names = undefined;
  }

  return {
    names: names,
    callback: callback
  };
}
/**
 * ??????????????????????????????
 * @param e Event??????value
 * @returns value
 */


function getValueFromEvent(e) {
  // support custom element
  if (!e || !e.target) {
    return e;
  }

  var target = e.target;

  if (target.type === 'checkbox') {
    return target.checked;
  } else if (target.type === 'radio') {
    //????????????radioGroup
    if (target.value) {
      return target.value;
    } else {
      return target.checked;
    }
  }

  return target.value;
}

function validateMap(rulesMap, rule, defaultTrigger) {
  var nrule = (0, _extends3.default)({}, rule);

  if (!nrule.trigger) {
    nrule.trigger = [defaultTrigger];
  }

  if (typeof nrule.trigger === 'string') {
    nrule.trigger = [nrule.trigger];
  }

  for (var i = 0; i < nrule.trigger.length; i++) {
    var trigger = nrule.trigger[i];

    if (trigger in rulesMap) {
      rulesMap[trigger].push(nrule);
    } else {
      rulesMap[trigger] = [nrule];
    }
  }

  delete nrule.trigger;
}
/**
 * ??????rule?????????trigger???????????????
 * @param  {Array} rules   ??????
 * @param  {String} defaultTrigger ????????????
 * @return {Object} {onChange:rule1, onBlur: rule2}
 */


function mapValidateRules(rules, defaultTrigger) {
  var rulesMap = {};
  rules.forEach(function (rule) {
    validateMap(rulesMap, rule, defaultTrigger);
  });
  return rulesMap;
}

var warn = function warn() {};

if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'production' && typeof window !== 'undefined' && typeof document !== 'undefined') {
  warn = function warn() {
    /* eslint-disable no-console */
    if (typeof console !== 'undefined' && console.error) {
      var _console;

      (_console = console).error.apply(_console, arguments);
    }
  };
}

var warning = warn;
exports.warning = warning;
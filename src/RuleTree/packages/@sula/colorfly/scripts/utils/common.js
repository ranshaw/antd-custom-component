/**
 * a-b => aB
 * 由于js中变量不支持a-b这样的变量标识，因此a-b全部转换为a_b
 */
exports.camelize = function (str) {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toLowerCase() : ''));
};

/**
 * a-b => a_b
 * 由于js中变量不支持a-b这样的变量标识，因此a-b全部转换为a_b
 */
exports.underline = function (str) {
  return str.replace(/-/g, '_');
};

/**
 * a_b => a-b
 * js变量名向CSS变量名转换
 */
exports.hyphenate = function (str) {
  return str.replace(/_/g, '-');
};

const variablePrefix = exports.variablePrefix = function (obj) {
  if (typeof obj === 'string') {
    return `s-${obj}`;
  }
    return Object.keys(obj).reduce((memo, key) => {
      memo[`s-${key}`] = obj[key];
      return memo;
    }, {});
};

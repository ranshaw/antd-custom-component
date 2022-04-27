const { join } = require('path');

exports.jsTpl = function (path) {
  return join(__dirname, '../templates/js', path);
};

exports.lessTpl = function (path) {
  return join(__dirname, '../templates/less', path);
};

exports.jsDest = function (path = '') {
  return join(__dirname, '../../src/variables', path);
};

exports.lessDest = function (path = '') {
  return join(__dirname, '../../style/variables', path);
};

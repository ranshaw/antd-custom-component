const tinycolor = require('tinycolor2');

module.exports = function fade(color, percent) {
  return tinycolor(color).setAlpha(percent).toString();
};

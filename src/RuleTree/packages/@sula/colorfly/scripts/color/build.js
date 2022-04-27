const colorPalette = require('../utils/colorPalette');
const { variablePrefix } = require('../utils/common');

const allLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const levels = [2, 4, 6, 8, 10];
const levelMap = { 2: 'lter', 4: 'lt', 6: 'base', 8: 'dk', 10: 'dker' };

function buildColor(standards) {
  const colors = {};
  let colorVars = '';

  standards.forEach(({ color, value }) => {
    // 2, 4, 6, 8, 10 色号：lter, lt, base, dk, dker
    levels.forEach((level) => {
      const varname = +level === 6 ? variablePrefix(`${color}`) : variablePrefix(`${color}-${levelMap[level]}`);
      const varvalue = +level === 6 ? value : colorPalette(value, level);
      colors[varname] = varvalue;
      colorVars += `@${varname} : ${varvalue}; \n`;
    });
    // 全部色号
    allLevels.forEach((level) => {
      const varname = variablePrefix(`${color}-${level}`);
      const varvalue = +level === 6 ? value : colorPalette(value, level);
      colors[varname] = varvalue;
      colorVars += `@${varname} : ${varvalue}; \n`;
    });
  });

  // 灰色 & 黑色不支持配置
  colors['s-light-lter'] = '#fafafa';
  colors['s-light-lt'] = '#f5f5f5';
  colors['s-light'] = '#e8e8e8';
  colors['s-light-dk'] = '#d9d9d9';
  colors['s-light-dker'] = '#bfbfbf';

  colors['s-dark-lter'] = '#535b7c';
  colors['s-dark-lt'] = '#3e445e';
  colors['s-dark'] = '#2A2E3F';
  colors['s-dark-dk'] = '#161820';
  colors['s-dark-dker'] = '#010102';

  colorVars += '@s-light-lter : #fafafa;\n';
  colorVars += '@s-light-lt : #f5f5f5;\n';
  colorVars += '@s-light : #e8e8e8;\n';
  colorVars += '@s-light-dk : #d9d9d9;\n';
  colorVars += '@s-light-dker : #bfbfbf;\n';

  colorVars += '@s-dark-lter : #535b7c;\n';
  colorVars += '@s-dark-lt : #3e445e;\n';
  colorVars += '@s-dark : #2A2E3F;\n';
  colorVars += '@s-dark-dk : #161820;\n';
  colorVars += '@s-dark-dker : #010102;\n';

  // 灰色全部色号不支持配置
  colors['s-light-1'] = '#ffffff';
  colors['s-light-2'] = '#fafafa';
  colors['s-light-3'] = '#f5f5f5';
  colors['s-light-4'] = '#e8e8e8';
  colors['s-light-5'] = '#d9d9d9';
  colors['s-light-6'] = '#bfbfbf';
  colors['s-light-7'] = '#8c8c8c';
  colors['s-light-8'] = '#595959';
  colors['s-light-9'] = '#262626';
  colors['s-light-10'] = '#000000';

  colorVars += '@s-light-1 : #ffffff;\n';
  colorVars += '@s-light-2 : #fafafa;\n';
  colorVars += '@s-light-3 : #f5f5f5;\n';
  colorVars += '@s-light-4 : #e8e8e8;\n';
  colorVars += '@s-light-5 : #d9d9d9;\n';
  colorVars += '@s-light-6 : #bfbfbf;\n';
  colorVars += '@s-light-7 : #8c8c8c;\n';
  colorVars += '@s-light-8 : #595959;\n';
  colorVars += '@s-light-9 : #262626;\n';
  colorVars += '@s-light-10 : #000000;\n';

  return { colors, colorVars };
}

exports.buildColor = buildColor;

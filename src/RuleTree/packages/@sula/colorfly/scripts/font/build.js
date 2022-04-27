const { variablePrefix } = require('../utils/common');

function buildFont(standards) {
  const texts = {};
  let textVars = '';

  standards.forEach(({ name, value }) => {
    const varname = variablePrefix(name);
    const varvalue = value;
    texts[varname] = varvalue;
    textVars += `@${varname} : ${varvalue};\n`;
  });

  return { texts, textVars };
}

exports.buildFont = buildFont;

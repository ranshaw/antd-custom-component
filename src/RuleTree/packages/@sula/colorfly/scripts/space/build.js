const { variablePrefix } = require('../utils/common');

function buildSpace(standards) {
  const spaces = {};
  let spaceVars = '';

  standards.forEach(({ name, value }) => {
    const varname = variablePrefix(name);
    const varvalue = value;
    spaces[varname] = varvalue;
    spaceVars += `@${varname} : ${varvalue};\n`;
  });

  return { spaces, spaceVars };
}

exports.buildSpace = buildSpace;

const { variablePrefix } = require('../utils/common');

function buildOther(standards) {
  const others = {};
  let otherVars = '';

  standards.forEach(({ name, value }) => {
    const varname = variablePrefix(name);
    const varvalue = value;
    others[varname] = varvalue;
    otherVars += `@${varname} : ${varvalue};\n`;
  });

  return { others, otherVars };
}

exports.buildOther = buildOther;

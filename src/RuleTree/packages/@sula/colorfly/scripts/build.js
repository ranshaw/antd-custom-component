const { jsTpl, lessTpl, jsDest, lessDest } = require('./utils/path');
// build color
const { standards: colorStandards } = require('./color/standards');
const { buildColor } = require('./color/build');
const { writeColor } = require('./color/write');

const { colors, colorVars } = buildColor(colorStandards);
writeColor(jsTpl('color.js'), jsDest(), lessTpl('color.less'), lessDest(), colors, colorVars);

// build font
const { standards: fontStandards } = require('./font/standards');
const { buildFont } = require('./font/build');
const { writeFont } = require('./font/write');

const { texts, textVars } = buildFont(fontStandards);
writeFont(jsTpl('font.js'), jsDest(), lessTpl('font.less'), lessDest(), texts, textVars);

// build space
const { standards: spaceStandards } = require('./space/standards');
const { buildSpace } = require('./space/build');
const { writeSpace } = require('./space/write');

const { spaces, spaceVars } = buildSpace(spaceStandards);
writeSpace(jsTpl('space.js'), jsDest(), lessTpl('space.less'), lessDest(), spaces, spaceVars);

// build other
const { standards: otherStandards } = require('./other/standards');
const { buildOther } = require('./other/build');
const { writeOther } = require('./other/write');

const { others, otherVars } = buildOther(otherStandards);
writeOther(jsTpl('other.js'), jsDest(), lessTpl('other.less'), lessDest(), others, otherVars);

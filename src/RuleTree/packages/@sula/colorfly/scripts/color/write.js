const placeholder = require('replace-holder');

function writeColor(srcJs, targetJs, srcLess, targetLess, colors, colorVars) {
  // 写入文件
  placeholder.fileSync(
    srcJs,
    { color: JSON.stringify(colors, null, 2) },
    targetJs,
  );
  placeholder.fileSync(
    srcLess,
    { color: colorVars },
    targetLess,
  );
}

exports.writeColor = writeColor;

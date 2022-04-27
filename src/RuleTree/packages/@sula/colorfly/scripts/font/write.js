const placeholder = require('replace-holder');

function writeFont(srcJs, targetJs, srcLess, targetLess, texts, textVars) {
  // 写入文件
  placeholder.fileSync(
    srcJs,
    { font: JSON.stringify(texts, null, 2) },
    targetJs,
  );
  placeholder.fileSync(
    srcLess,
    { font: textVars },
    targetLess,
  );
}

exports.writeFont = writeFont;

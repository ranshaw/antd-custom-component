const placeholder = require('replace-holder');

function writeOther(srcJs, targetJs, srcLess, targetLess, others, otherVars) {
  // 写入文件
  placeholder.fileSync(
    srcJs,
    { other: JSON.stringify(others, null, 2) },
    targetJs,
  );
  placeholder.fileSync(
    srcLess,
    { other: otherVars },
    targetLess,
  );
}

exports.writeOther = writeOther;

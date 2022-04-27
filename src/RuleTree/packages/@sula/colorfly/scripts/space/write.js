const placeholder = require('replace-holder');

function writeSpace(srcJs, targetJs, srcLess, targetLess, spaces, spaceVars) {
  // 写入文件
  placeholder.fileSync(
    srcJs,
    { space: JSON.stringify(spaces, null, 2) },
    targetJs,
  );
  placeholder.fileSync(
    srcLess,
    { space: spaceVars },
    targetLess,
  );
}

exports.writeSpace = writeSpace;

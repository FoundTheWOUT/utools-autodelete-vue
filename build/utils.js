const rmdir = require("rimraf");
const { join } = require("path");

// 删除arr数组中与rmValue数组重合内容
function removeValue(arr, rmValue) {
  rmValue.forEach(v => {
    arr.splice(arr.indexOf(v), 1);
  });
  return arr;
}

function deleteFilePromise(path) {
  return new Promise(resolve => {
    rmdir(path, () => {
      console.log("rmdir");
      resolve();
    });
  });
}

async function getFolderSize(rootItemPath, options = {}, returnType = {}) {
  const fs = options.fs || (await import("fs/promises"));

  const fileSizes = new Map();
  const errors = [];

  await processItem(rootItemPath);

  async function processItem(itemPath) {
    if (options.ignore?.test(itemPath)) return;

    const stats = returnType.strict
      ? await fs.lstat(itemPath)
      : await fs.lstat(itemPath).catch(error => errors.push(error));
    if (typeof stats !== "object") return;
    fileSizes.set(stats.ino, stats.size);

    if (stats.isDirectory()) {
      const directoryItems = returnType.strict
        ? await fs.readdir(itemPath)
        : await fs.readdir(itemPath).catch(error => errors.push(error));
      if (typeof directoryItems !== "object") return;
      await Promise.all(
        directoryItems.map(directoryItem =>
          processItem(join(itemPath, directoryItem))
        )
      );
    }
  }

  const folderSize = Array.from(fileSizes.values()).reduce(
    (total, fileSize) => total + fileSize,
    0
  );

  if (returnType.errors) {
    return {
      size: folderSize,
      errors: errors.length > 0 ? errors : null,
    };
  } else {
    return folderSize;
  }
}

module.exports = {
  removeValue,
  deleteFilePromise,
  getFolderSize,
};

/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const rmdir = require("rimraf");
const getFolderSizeCore = require("get-folder-size");

// // 删除arr数组中与rmValue数组重合内容
function removeValue(arr, rmValue) {
  rmValue.forEach((v) => {
    // if the value which need to remove is not in arr, then pass
    arr.indexOf(v) !== -1 ? arr.splice(arr.indexOf(v), 1) : "";
  });
  return arr;
}

function deleteFilePromise(path) {
  if (!fs.existsSync(path)) return;
  return new Promise((resolve, reject) => {
    rmdir(path, (err) => {
      if (err) reject(`rmdir Error: ${err}`);
      resolve();
    });
  });
}

function getFolderSize(pathArr) {
  let _promise = [];
  if (pathArr.length !== 0) {
    for (const pathItem of pathArr) {
      if (!fs.existsSync(pathItem)) continue;
      let _reject;
      _promise.push({
        promise: new Promise((resolve, reject) => {
          _reject = reject;
          getFolderSizeCore(pathItem, (err, size) => {
            if (err) reject(err);
            resolve(size);
          });
        }),
        cancel: () => {
          _reject("promise have been cancelled");
        },
      });
    }
  }
  return _promise;
}

module.exports = {
  removeValue,
  deleteFilePromise,
  getFolderSize,
};

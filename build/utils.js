/* eslint-disable @typescript-eslint/no-var-requires */
const rmdir = require("rimraf");
const getFolderSizeCore = require("get-folder-size");

// 删除arr数组中与rmValue数组重合内容
function removeValue(arr, rmValue) {
  rmValue.forEach(v => {
    // if the value which need to remove is not in arr, then pass
    arr.indexOf(v) !== -1 ? arr.splice(arr.indexOf(v), 1) : "";
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

function getFolderSize(pathArr) {
  let _promise = [];
  if (pathArr.length !== 0) {
    for (const pathItem of pathArr) {
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
          _reject("cancel");
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

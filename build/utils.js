const rmdir = require("rimraf");

// 删除arr数组中与rmvalue数组重合内容
function removeValue(arr, rmvalue) {
  let newarr = arr;
  for (let index = 0; index < rmvalue.length; index++) {
    newarr = newarr.filter(value => value !== rmvalue[index]);
  }
  return newarr;
}

function deleteFilePromise(path) {
  return new Promise(resolve => {
    rmdir(path, () => {
      console.log("rmdir");
      resolve();
    });
  });
}

module.exports = {
  removeValue,
  deleteFilePromise,
};

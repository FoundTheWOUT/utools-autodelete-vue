import fs from "fs";
import rmdir from "rimraf";
import getItemSize from "get-folder-size";

// // 删除arr数组中与rmValue数组重合内容
export function removeValue<T>(arr: T[], rmValue: T[]): T[] {
  rmValue.forEach((v) => {
    // if the value which need to remove is not in arr, then pass
    arr.indexOf(v) !== -1 ? arr.splice(arr.indexOf(v), 1) : "";
  });
  return arr;
}

export function deleteFilePromise(path: string): Promise<void> | undefined {
  if (!fs.existsSync(path)) return;
  return new Promise<void>((resolve, reject) => {
    rmdir(path, (err: any) => {
      if (err) reject(`rmdir Error: ${err}`);
      resolve();
    });
  });
}



// save promise to class
export function getFolderSize(pathArr: string[]): ICancelablePromise<number>[] {
  const _promise = [] as ICancelablePromise<number>[];
  if (pathArr.length !== 0) {
    for (const pathItem of pathArr) {
      if (!fs.existsSync(pathItem)) continue;
      let _reject: any;
      _promise.push({
        promise: new Promise((resolve, reject) => {
          _reject = reject;
          // getItemSize
          //   .loose(pathItem)
          //   .then((size) => resolve(size))
          //   .catch((res) => reject(res));
          getItemSize(pathItem, (err: unknown, size: number) => {
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

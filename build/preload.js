/* eslint-disable @typescript-eslint/no-var-requires */
const os = require("os");
const path = require("path");
const fs = require("fs");
const utils = require("./utils");
const USER = os.userInfo().username;
const dir = {
  WeChat: {
    forwin10: ` C:\\Users\\${USER}\\AppData\\Local\\Packages\\TencentWeChatLimited.forWindows10_sdtnhv12zgd7a\\LocalCache\\Roaming\\Tencent\\WeChatAppStore\\WeChatAppStore Files`,

    pc: `C:\\Users\\${USER}\\Documents\\WeChat Files`,
    foruwp: `C:\\Users\\${USER}\\AppData\\Local\\Packages\\TencentWeChatLimited.WeChatUWP_sdtnhv12zgd7a\\LocalCache\\Roaming\\Tencent\\WeChatAppStore\\WeChatAppStore Files`,
  },
  QQ: {
    pc: `C:\\Users\\${USER}\\Documents\\Tencent Files`,
  },
};

const removeV = ["All Users", "Applet", "config"];

function getAccountName(app, accountRootPath) {
  let accountName;
  switch (app) {
    case "WeChat":
      accountName = fs.readdirSync(path.join(accountRootPath))[0];
      return accountName ? accountName.substr(8) : "";
    case "QQ":
      return path.basename(accountRootPath);
    default:
      return;
  }
  // fs.readdirSync(path.join(AllWeChat[key], value))[0].substr(8)
}

/**
 *
 * @param {string} app
 * @param {string} accountRootPath
 * @param {array} FolderNeedToCleanSuffix - example ["File","Image"]
 * @returns
 */
function getWaitingPath(app, accountRootPath) {
  let _mid = "";
  let _waitingPath = [];
  let _folderPath = [];

  switch (app) {
    case "WeChat":
      _mid = ["FileStorage"];
      _folderPath = ["Cache", "File", "Video", "Image"];
      break;
    case "QQ":
      _mid = [""];
      _folderPath = [
        "AppWebCache",
        "Audio",
        "FileRecv",
        "Image",
        "ScreenRecorder",
        "Video",
      ];
      break;
    default:
      return [];
  }

  _mid.forEach((_mid) => {
    _waitingPath.push(
      _folderPath.map((i) => {
        return { status: true, path: path.join(accountRootPath, _mid, i) };
      })
    );
  });

  return _waitingPath.flat().filter((v) => fs.existsSync(v.path));
}

/**
 *
 * @param {String} app
 * @returns {Array}
 */
function getFile(app, callback) {
  console.log("getFileFunc call");
  let accountsList = [];
  // find Account
  for (const systemType in dir[app]) {
    if (!fs.existsSync(dir[app][systemType])) continue;
    utils
      .removeValue(
        Array.from(new Set(fs.readdirSync(dir[app][systemType]))),
        removeV
      )
      .forEach((i) => {
        accountsList.push(path.join(dir[app][systemType], i));
      });
  }

  let Accounts;

  if (accountsList.length === 0) {
    window.utools.showNotification(`没有安装${app}`);
    // return undefined
    return;
  }

  // 遍历 accountsList ，填充 waitingFolderList
  Accounts = accountsList.map((accountRootPath) => {
    return {
      account: getAccountName(app, accountRootPath),
      rootPath: accountRootPath,
      waitingFolderList: getWaitingPath(app, accountRootPath),
    };
  });
  callback.call(null, Accounts);
}

async function cleanUpSubItem(List, callback) {
  let delFile = [];

  if (!Array.isArray(List)) {
    let _path = String(List);
    if (!fs.existsSync(_path)) return;
    await utils.deleteFilePromise(_path);
    callback.call();
    return;
  }
  List.forEach((filepath) => {
    // if no this file path
    if (!fs.existsSync(filepath)) return;
    fs.readdirSync(filepath).forEach((value) => {
      delFile.push(path.join(filepath, value));
    });
  });

  if (delFile.length === 0) {
    window.utools.showNotification("没有可清理内容");
    callback.call();
    return;
  }

  for (let index = 0; index < delFile.length; index++) {
    await utils.deleteFilePromise(delFile[index]);
  }
  window.utools.showNotification("清理完成");
  callback.call();
}

window.exports = {
  getFile,
  cleanUpSubItem,
  getFolderSize: utils.getFolderSize,
};

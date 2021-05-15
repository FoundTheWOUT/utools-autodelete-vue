/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const os = require("os");
const path = require("path");
const fs = require("fs");
const utils = require("./utils");
const child_process = require("child_process");
const USER = os.userInfo().username;

const appName = {
  WeChat: "WeChat",
  QQ: "QQ",
};
const dir = {
  window: {
    [appName.WeChat]: {
      forwin10: ` C:\\Users\\${USER}\\AppData\\Local\\Packages\\TencentWeChatLimited.forWindows10_sdtnhv12zgd7a\\LocalCache\\Roaming\\Tencent\\WeChatAppStore\\WeChatAppStore Files`,

      pc: `C:\\Users\\${USER}\\Documents\\WeChat Files`,
      foruwp: `C:\\Users\\${USER}\\AppData\\Local\\Packages\\TencentWeChatLimited.WeChatUWP_sdtnhv12zgd7a\\LocalCache\\Roaming\\Tencent\\WeChatAppStore\\WeChatAppStore Files`,
    },
    [appName.QQ]: {
      pc: `C:\\Users\\${USER}\\Documents\\Tencent Files`,
    },
  },
  macOs: {
    [appName.WeChat]: {
      macStore: `/Users/${USER}/Library/Containers/com.tencent.xinWeChat/Data/Library/Application Support/com.tencent.xinWeChat/2.0b4.0.9`,
    },
  },
};

const removeV = ["All Users", "Applet", "config"];

function getAccountName(app, accountRootPath) {
  let defaultName = "没找到名字哦";
  if (window.utools.isWindows()) {
    switch (app) {
      case "WeChat": {
        let accountName = fs.readdirSync(path.join(accountRootPath))[0];
        return accountName ? accountName.substr(8) : defaultName;
      }
      case "QQ":
        return path.basename(accountRootPath);
      default:
        return defaultName;
    }
  } else if (window.utools.isMacOs()) {
    switch (app) {
      case "WeChat": {
        let filePath = path.join(accountRootPath, "Account", "userinfo.data");
        let str = child_process
          .execSync(`strings '${filePath}' |  sed -n 6p`)
          .toString();
        return str || defaultName;
      }
      case "QQ":
        return path.basename(accountRootPath);
      default:
        return defaultName;
    }
  }
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

  if (utools.isWindows()) {
    switch (app) {
      case appName.WeChat:
        _mid = ["FileStorage"];
        _folderPath = ["Cache", "File", "Video", "Image"];
        break;
      case appName.QQ:
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
          return {
            status: true,
            name: i,
            path: path.join(accountRootPath, _mid, i),
          };
        })
      );
    });
  } else if (utools.isMacOs()) {
    switch (app) {
      case appName.WeChat: {
        // fs.readdirSync(path.join(accountRootPath, "Message", "MessageTemp"));
        const MessageTempDir = path.join(
          accountRootPath,
          "Message",
          "MessageTemp"
        );
        if (!fs.existsSync(MessageTempDir)) return;
        // Mac中MessageTemp中的全部文件夹
        _mid = fs.readdirSync(MessageTempDir);
        _folderPath = ["Audio", "File", "Image", "OpenData", "Video"];
        _folderPath.forEach((i) => {
          _waitingPath.push({
            status: true,
            name: i,
            // 返回_folderPath对应名字下的待清理数组
            path: _mid
              .map((_mid) => {
                if (!fs.existsSync(path.join(MessageTempDir, _mid, i))) return;
                return path.join(MessageTempDir, _mid, i);
              })
              .filter((i) => i !== undefined),
          });
        });
        break;
      }
    }
  }

  // return _waitingPath.flat().filter((v) => fs.existsSync(v.path));
  return _waitingPath;
}

/**
 *
 * @param {String} app
 * @returns {Array}
 */
function getFile(app, callback) {
  let accountsList = [];
  let _dir;
  // find Account
  if (utools.isWindows()) {
    _dir = dir.window;
    for (const systemType in _dir[app]) {
      if (!fs.existsSync(_dir[app][systemType])) continue;
      utils
        .removeValue(
          Array.from(new Set(fs.readdirSync(_dir[app][systemType]))),
          removeV
        )
        .forEach((i) => {
          accountsList.push(path.join(_dir[app][systemType], i));
        });
    }
  } else if (utools.isMacOs()) {
    _dir = dir.macOs;
    for (const systemType in _dir[app]) {
      if (!fs.existsSync(_dir[app][systemType])) continue;
      Array.from(new Set(fs.readdirSync(_dir[app][systemType])))
        .filter((i) => i.length === 32)
        .forEach((i) => accountsList.push(path.join(_dir[app][systemType], i)));
    }
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
      username: getAccountName(app, accountRootPath),
      rootPath: accountRootPath,
      waitingFolderList: getWaitingPath(app, accountRootPath),
    };
  });
  callback(Accounts);
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

  // forEach can't choke a promise
  for (let index = 0; index < delFile.length; index++) {
    await utils.deleteFilePromise(delFile[index]);
  }
  window.utools.showNotification("清理完成");
  callback.call();
}

window.api = {
  getFile,
  cleanUpSubItem,
  deleteFilePromise: utils.deleteFilePromise,
  getFolderSize: utils.getFolderSize,
};

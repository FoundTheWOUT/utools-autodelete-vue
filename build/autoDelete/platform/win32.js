/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const fs = require("fs");
const { AutoDelete, appName } = require("..");
const { removeValue } = require("../../utils");

const config = {
  dir: {
    [appName.WeChat]: {
      forwin10: ` C:\\Users\\${USER}\\AppData\\Local\\Packages\\TencentWeChatLimited.forWindows10_sdtnhv12zgd7a\\LocalCache\\Roaming\\Tencent\\WeChatAppStore\\WeChatAppStore Files`,

      pc: `C:\\Users\\${USER}\\Documents\\WeChat Files`,
      foruwp: `C:\\Users\\${USER}\\AppData\\Local\\Packages\\TencentWeChatLimited.WeChatUWP_sdtnhv12zgd7a\\LocalCache\\Roaming\\Tencent\\WeChatAppStore\\WeChatAppStore Files`,
    },
    [appName.QQ]: {
      pc: `C:\\Users\\${USER}\\Documents\\Tencent Files`,
    },
  },
  removeV: ["All Users", "Applet", "config"],
};

class AutoDeleteWin extends AutoDelete {
  getAccountsList = (app) => {
    const accountsList = [];
    for (const appStorePath in Object.values(config.dir[app])) {
      if (!fs.existsSync(appStorePath)) continue;
      Array.from(new Set(fs.readdirSync(appStorePath)))
        .filter((i) => i.length === 32)
        .forEach((i) => accountsList.push(path.join(appStorePath, i)));
    }
    return removeValue(accountsList, config.removeV);
  };

  getWaitingPath = (app, accountRootPath) => {
    let _mid;
    let _waitingPath = [];
    let _folderPath = [];
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
    return _waitingPath;
  };

  getAccountName = (app, accountRootPath) => {
    const defaultName = "没找到名字";
    switch (app) {
      case appName.WeChat: {
        let accountName = fs.readdirSync(path.join(accountRootPath))[0];
        return accountName ? accountName.substr(8) : defaultName;
      }
      case appName.QQ:
        return path.basename(accountRootPath);
      default:
        return defaultName;
    }
  };
}

module.exports = AutoDeleteWin;

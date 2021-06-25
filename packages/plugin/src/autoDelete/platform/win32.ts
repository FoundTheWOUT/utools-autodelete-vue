import path from "path";
import fs from "fs";
import AutoDelete, { appName, appNameType, USER } from "..";
import { removeValue } from "../../utils";
import Account from "../account";

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

export default class AutoDeleteWin extends AutoDelete {
  getAccountsList = (app: appNameType): void => {
    const accountsList = [] as string[];
    for (const appStorePath in Object.values(config.dir[app])) {
      if (!fs.existsSync(appStorePath)) continue;
      Array.from(new Set(fs.readdirSync(appStorePath))).forEach((i) =>
        accountsList.push(path.join(appStorePath, i))
      );
    }
    this.appMapAccounts[app] = removeValue(accountsList, config.removeV).map(
      (i) => {
        return new Account(
          this.getAccountName(app, i),
          i,
          this.getWaitingPath(app, i)
        );
      }
    );
  };

  getWaitingPath = (
    app: appNameType,
    accountRootPath: string
  ): IWaitingFolder[] => {
    let _mid;
    const _waitingPath = [] as any;
    let _folderPath = [] as string[];
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

  getAccountName = (app: appNameType, accountRootPath: string): string => {
    const defaultName = "没找到名字";
    switch (app) {
      case appName.WeChat: {
        const accountName = fs.readdirSync(path.join(accountRootPath))[0];
        return accountName ? accountName.substr(8) : defaultName;
      }
      case appName.QQ:
        return path.basename(accountRootPath);
      default:
        return defaultName;
    }
  };
}

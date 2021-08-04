import path from "path";
import fs from "fs";
import AutoDelete, { appName, appNameType, USER } from "..";
import { IConfig } from "../types";

export default class AutoDeleteWin extends AutoDelete {
  config: IConfig;
  constructor() {
    super();
    this.config = {
      [appName.WeChat]: {
        dir: [
          ` C:\\Users\\${USER}\\AppData\\Local\\Packages\\TencentWeChatLimited.forWindows10_sdtnhv12zgd7a\\LocalCache\\Roaming\\Tencent\\WeChatAppStore\\WeChatAppStore Files`,

          `C:\\Users\\${USER}\\Documents\\WeChat Files`,
          `C:\\Users\\${USER}\\AppData\\Local\\Packages\\TencentWeChatLimited.WeChatUWP_sdtnhv12zgd7a\\LocalCache\\Roaming\\Tencent\\WeChatAppStore\\WeChatAppStore Files`,
        ],
        mid: ["FileStorage"],
        waitingFolderPath: ["Cache", "File", "Video", "Image"],
        removeV: ["All Users", "Applet", "config"],
        accountPaths: [],
      },
      [appName.QQ]: {
        dir: [`C:\\Users\\${USER}\\Documents\\Tencent Files`],
        mid: [],
        waitingFolderPath: [
          "AppWebCache",
          "Audio",
          "FileRecv",
          "Image",
          "ScreenRecorder",
          "Video",
        ],
        removeV: ["All Users"],
      },
    };
  }

  getAccountsList = (app: appNameType): void => {
    const appConfig = this.config[app];
    appConfig.accountPaths = [];

    this.mergeConfig(this.getOwnConfig(app), this.config[app]);

    for (const appStorePath of appConfig.dir) {
      if (!fs.existsSync(appStorePath)) continue;
      Array.from(new Set(fs.readdirSync(appStorePath))).forEach((i) => {
        if (appConfig.removeV.indexOf(i) === -1) {
          this.config[app].accountPaths.push(i);
        }
      });
    }
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

import path from "path";
import fs from "fs";
import AutoDelete, { appName, appNameType, USER } from "..";
import Account from "../account";

const config = {
  [appName.WeChat]: {
    dir: {
      forwin10: ` C:\\Users\\${USER}\\AppData\\Local\\Packages\\TencentWeChatLimited.forWindows10_sdtnhv12zgd7a\\LocalCache\\Roaming\\Tencent\\WeChatAppStore\\WeChatAppStore Files`,

      pc: `C:\\Users\\${USER}\\Documents\\WeChat Files`,
      foruwp: `C:\\Users\\${USER}\\AppData\\Local\\Packages\\TencentWeChatLimited.WeChatUWP_sdtnhv12zgd7a\\LocalCache\\Roaming\\Tencent\\WeChatAppStore\\WeChatAppStore Files`,
    },
    mid: ["FileStorage"],
    waitingFolderPath: ["Cache", "File", "Video", "Image"],
    removeV: ["All Users", "Applet", "config"],
  },
  [appName.QQ]: {
    dir: {
      pc: `C:\\Users\\${USER}\\Documents\\Tencent Files`,
    },
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

export default class AutoDeleteWin extends AutoDelete {
  constructor() {
    super();
    this.config = config;
  }

  getAccountsList = (app: appNameType): void => {
    const accountsList = [] as string[];
    const appConfig = config[app];
    for (const appStorePath of Object.values(appConfig.dir)) {
      if (!fs.existsSync(appStorePath)) continue;
      Array.from(new Set(fs.readdirSync(appStorePath))).forEach((i) => {
        if (appConfig.removeV.indexOf(i) === -1)
          accountsList.push(path.join(appStorePath, i));
      });
    }
    this.appMapAccounts[app] = accountsList.map((i) => {
      return new Account(
        this.getAccountName(app, i),
        i,
        super.getWaitingPath(app, i)
      );
    });
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

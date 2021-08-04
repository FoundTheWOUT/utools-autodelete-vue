import path from "path";
import fs from "fs";
import AutoDelete, { USER, appName, appNameType } from "..";
import { IConfig } from "../types";

const rawConfig: IConfig = {
  [appName.WeChat]: {
    dir: [
      `/Users/${USER}/Library/Containers/com.tencent.xinWeChat/Data/Library/Application Support/com.tencent.xinWeChat/2.0b4.0.9`,
    ],
    waitingFolderPath: ["Audio", "File", "Image", "OpenData", "Video"],
    accountPaths: [],
  },
  [appName.QQ]: {
    dir: [],
    accountPaths: [],
  },
};

export default class AutoDeleteMac extends AutoDelete {
  config: IConfig;
  constructor() {
    super();
    this.config = Object.create(rawConfig);
  }

  getAccountsList = (app: appNameType): void => {
    // TODO: reset config
    this.config[app].accountPaths = [];
    // merge config
    this.mergeConfig(this.getOwnConfig(app), this.config[app]);

    // find all account paths
    for (const appStorePath of this.config[app].dir) {
      if (!fs.existsSync(appStorePath)) continue;
      Array.from(fs.readdirSync(appStorePath))
        .filter((i) => i.length === 32)
        .forEach((i) =>
          this.config[app].accountPaths.push(path.join(appStorePath, i))
        );
    }
  };

  getWaitingFolderList(
    app: appNameType,
    accountRootPath: string
  ): IWaitingFolder[] {
    switch (app) {
      case appName.WeChat: {
        // fs.readdirSync(path.join(accountRootPath, "Message", "MessageTemp"));
        const MessageTempDir = path.join(
          accountRootPath,
          "Message",
          "MessageTemp"
        );
        if (!fs.existsSync(MessageTempDir)) return [];
        // Mac中MessageTemp中的全部文件夹
        const _mid = fs.readdirSync(MessageTempDir);
        // mutate the config
        this.config[app].mid = _mid;
        return super.getWaitingPath(app, MessageTempDir);
      }
      // TODO: Macos QQ
      case appName.QQ: {
        return [];
      }
      default:
        return [];
    }
  }

  getUserName(app: appNameType, accountRootPath: string): string {
    return path.basename(accountRootPath);
  }
}

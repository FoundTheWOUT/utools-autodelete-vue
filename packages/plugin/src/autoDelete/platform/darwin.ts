import path from "path";
import fs from "fs";
import AutoDelete, { USER, appName, appNameType } from "..";
import Account from "../account";

const config = {
  [appName.WeChat]: {
    dir: {
      macStore: `/Users/${USER}/Library/Containers/com.tencent.xinWeChat/Data/Library/Application Support/com.tencent.xinWeChat/2.0b4.0.9`,
    },
    waitingFolderPath: ["Audio", "File", "Image", "OpenData", "Video"],
  },
  [appName.QQ]: {
    dir: {},
  },
};

export default class AutoDeleteMac extends AutoDelete {
  constructor() {
    super();
    this.config = config;
  }

  getAccountsList = (app: appNameType): void => {
    const accountsList = [] as IAccount[];

    for (const appStorePath of Object.values(config[app].dir)) {
      if (!fs.existsSync(appStorePath)) continue;
      Array.from(fs.readdirSync(appStorePath))
        .filter((i) => i.length === 32)
        .forEach((i) =>
          accountsList.push(
            new Account(
              this.getAccountName(app, i),
              path.join(appStorePath, i),
              this.getWaitingPath(app, path.join(appStorePath, i))
            )
          )
        );
    }
    this.appMapAccounts[app] = accountsList;
    console.debug("accounts list updated: ", accountsList);
  };

  getWaitingPath = (
    app: appNameType,
    accountRootPath: string
  ): IWaitingFolder[] => {
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

        // const folderList = ["Audio", "File", "Image", "OpenData", "Video"];
        // return folderList.map((folder) => {
        //   return {
        //     status: true,
        //     name: folder,
        //     path: _mid
        //       .map((_mid) => {
        //         const folderPath = path.join(MessageTempDir, _mid, folder);
        //         return fs.existsSync(folderPath) ? folderPath : "";
        //       })
        //       .filter((i) => i !== ""),
        //   };
        // });
      }
      // TODO: Macos QQ
      case appName.QQ: {
        return [];
      }
      default:
        return [];
    }
  };

  private getAccountName = (
    app: appNameType,
    accountRootPath: string
  ): string => {
    return path.basename(accountRootPath);
  };
}

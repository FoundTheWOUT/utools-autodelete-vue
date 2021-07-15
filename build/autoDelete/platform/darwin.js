/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const fs = require("fs");
const { AutoDelete, USER, appName } = require("..");

const config = {
  dir: {
    [appName.WeChat]: {
      macStore: `/Users/${USER}/Library/Containers/com.tencent.xinWeChat/Data/Library/Application Support/com.tencent.xinWeChat/2.0b4.0.9`,
    },
  },
};

class AutoDeleteMac extends AutoDelete {
  constructor() {
    super();
  }

  getAccountsList = (app) => {
    const accountsList = [];

    if (Object.keys(config.dir).indexOf(app) === -1) return [];

    for (const appStorePath of Object.values(config.dir[app])) {
      if (!fs.existsSync(appStorePath)) continue;
      Array.from(new Set(fs.readdirSync(appStorePath)))
        .filter((i) => i.length === 32)
        .forEach((i) => accountsList.push(path.join(appStorePath, i)));
    }
    return accountsList;
  };

  getWaitingPath = (app, accountRootPath) => {
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
        const _mid = fs.readdirSync(MessageTempDir);

        const folderList = ["Audio", "File", "Image", "OpenData", "Video"];
        return folderList.map((folder) => {
          return {
            status: true,
            name: folder,
            path: _mid
              .map((_mid) => {
                const folderPath = path.join(MessageTempDir, _mid, folder);
                return fs.existsSync(folderPath) ? folderPath : undefined;
              })
              .filter((i) => i !== undefined),
          };
        });
      }
      // TODO: Macos QQ
      case appName.QQ: {
        return [];
      }
    }
  };

  getAccountName = (app, accountRootPath) => {
    return path.basename(accountRootPath);
  };
}

module.exports = AutoDeleteMac;

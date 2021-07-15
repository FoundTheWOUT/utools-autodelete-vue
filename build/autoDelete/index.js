/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const os = require("os");
const fs = require("fs");

const USER = os.userInfo().username;

const appName = {
  WeChat: "WeChat",
  QQ: "QQ",
};

class AutoDelete {
  constructor() {
    // this.app = this.hasApp.WeChat;
  }

  switchApp(app, cb) {
    if (Object.values(this.hasApp).indexOf(app) === -1) {
      console.warn("can't find app, has app: ", this.hasApp);
      return;
    }
    this.app = app;
    cb(this.getFile(app));
  }

  /**
   * @description 获得基本信息
   * @param {String} app
   * @returns {Array}
   */
  getFile(app) {
    const accountsList = this.getAccountsList(app);
    if (accountsList.length === 0) {
      window.utools.showNotification(`没有安装${app}`);
      // return undefined
      return [];
    }

    // 遍历 accountsList ，填充 waitingFolderList
    return accountsList.map((accountRootPath) => {
      return {
        username: this.getAccountName(app, accountRootPath),
        rootPath: accountRootPath,
        waitingFolderList: this.getWaitingPath(app, accountRootPath),
      };
    });
  }

  async cleanUpSubItem(List, callback) {
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
}

module.exports = { AutoDelete, appName, USER };

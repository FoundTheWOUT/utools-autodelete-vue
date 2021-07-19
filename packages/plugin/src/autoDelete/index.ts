import os from "os";
import * as utils from "../utils";
import path from "path";
import fs from "fs";

export const USER = os.userInfo().username;

export enum appName {
  WeChat = "WeChat",
  QQ = "QQ",
}

export type appNameType = keyof typeof appName;

export default abstract class AutoDelete {
  appMapAccounts: Record<appNameType, IAccount[]>;
  fileSizePromise: ICancelablePromise<number>[];
  config: any;
  constructor() {
    this.appMapAccounts = { WeChat: [], QQ: [] };
    this.fileSizePromise = [];
  }

  abstract getAccountsList(app: appNameType): void;

  public getAccounts(app: appNameType): IAccount[] {
    this.getAccountsList(app);
    if (this.appMapAccounts[app].length === 0) {
      window.utools.showNotification(`没有安装${app}`);
    }
    return this.appMapAccounts[app];
  }

  getWaitingPath(app: appNameType, root: string): IWaitingFolder[] {
    const { waitingFolderPath, mid } = this.config[app];
    console.log(mid);
    return waitingFolderPath.map((folder) => {
      return {
        status: true,
        name: folder,
        path: mid
          .map((_mid) => {
            const folderPath = path.join(root, _mid, folder);
            return fs.existsSync(folderPath) ? folderPath : "";
          })
          .filter((i) => i !== ""),
      };
    });
  }

  // TODO: mac os clear it parents
  async cleanUp(List: string[]): Promise<void> {
    if (List.length === 0) {
      window.utools.showNotification("没有可清理内容");
      return;
    }

    // forEach can't choke a promise
    try {
      for (const item of List) {
        await utils.deleteFilePromise(item);
      }
      window.utools.showNotification("清理完成");
    } catch (error) {
      window.utools.showNotification("发送错误");
      return error;
    }
  }
}

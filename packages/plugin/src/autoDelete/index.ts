import os from "os";
import * as utils from "../utils";

export const USER = os.userInfo().username;

export enum appName {
  WeChat = "WeChat",
  QQ = "QQ",
}

export type appNameType = keyof typeof appName;

export default abstract class AutoDelete {
  appMapAccounts: Record<appNameType, IAccount[]>;
  fileSizePromise: ICancelablePromise<number>[];
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

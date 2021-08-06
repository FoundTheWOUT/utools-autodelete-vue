import os from "os";
import * as utils from "../utils";
import path from "path";
import Account from "./account";
import { IAppConfig, IConfig, IConfigFuncOptions } from "./types";

export const USER = os.userInfo().username;

export enum appName {
  WeChat = "WeChat",
  QQ = "QQ",
}

export type appNameType = keyof typeof appName;

export default abstract class AutoDelete {
  appMapAccounts: Record<appNameType, IAccount[]>;
  fileSizePromise: ICancelablePromise<number>[];
  config: IConfig;
  constructor() {
    this.appMapAccounts = { WeChat: [], QQ: [] };
    this.fileSizePromise = [];
  }

  abstract getAccountsList(app: appNameType): void;

  public getAccounts(app: appNameType): IAccount[] {
    this.getAccountsList(app);
    // reset map
    this.appMapAccounts[app] = [];
    //loop accountPaths, new account instance
    this.config[app].accountPaths.forEach((path) => {
      this.appMapAccounts[app].push(new Account(path, app, this));
    });
    console.debug("accounts list updated: ", this.appMapAccounts[app]);
    // 从远端获得List并合并
    if (this.appMapAccounts[app].length === 0) {
      window.utools.showNotification(`没有安装${app}`);
    }
    return this.appMapAccounts[app];
  }

  private getPathFromFolder(midPaths: string[], folder: string): string[] {
    if (midPaths.length > 0) {
      return midPaths.map((_mid: string) => path.join(_mid, folder));
    } else {
      return [folder];
    }
  }

  getWaitingPath(app: appNameType, root: string): IWaitingFolder[] {
    const { waitingFolderPath, mid } = this.config[app];
    return waitingFolderPath.map((folder) => {
      return {
        status: true,
        name: folder,
        path: this.getPathFromFolder(mid, folder).map((pth) =>
          path.join(root, pth)
        ),
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

  // the newC will be mutated
  mergeConfig(
    config: IAppConfig,
    to: IAppConfig,
    options?: IConfigFuncOptions
  ): void {
    // if is null or undefine
    if (!config || !to) {
      console.debug("get configObj: ", config, ", to Obj: ", to);
      return;
    }

    Object.keys(config).forEach((key) => {
      if (config[key].length === 0) {
        // 清空数组
        to[key] = [];
      } else {
        config[key].forEach((value) => {
          const idx = to[key].indexOf(value);
          // 没有则加入
          if (idx === -1) {
            to[key].push(value);
            // 有，且设置为删除，则删除
          } else if (options?.remove) {
            to[key].splice(idx, 1);
          }
        });
      }
    });
  }

  getOwnConfig(app?: appNameType): Record<string, IConfig> | null {
    const db = utools.db.get("config");
    return db !== null
      ? app
        ? db.data?.[utools.getLocalId()]?.[app]
        : db.data
      : null;
  }

  saveOwnConfig(
    config: IConfig,
    app: appNameType,
    options?: IConfigFuncOptions
  ): void {
    const localId = utools.getLocalId();
    const remoteConfig = this.getOwnConfig();
    if (remoteConfig?.[localId]) {
      // if remoteConfig already has localId, merge config
      this.mergeConfig(config[app], remoteConfig[localId][app], options);
      this.saveData("config", { ...remoteConfig });
    } else {
      // else save whole config
      this.saveData("config", { [localId]: config });
    }
  }

  private saveData(id: string, data: any): void {
    const pre = utools.db.get(id);
    let _rev: string;
    if (pre !== null) {
      //   data = Object.assign(data, JSON.parse(pre.data));
      _rev = pre._rev;
    }
    utools.db.put({
      _id: id,
      data,
      _rev,
    });
  }

  public removeAccountFromList(app: appNameType, account: IAccount): void {
    console.debug("remove account", app, account);
    // get current saved config
    const _config = this.getOwnConfig(app) as IAppConfig;
    if (_config) {
      //  if accountPath exist, remove it
      const accountPathIdx = _config?.accountPaths.indexOf(account.rootPath);
      if (accountPathIdx !== -1) {
        _config.accountPaths.splice(accountPathIdx, 1);
        // saveData
        this.saveOwnConfig({ [app]: _config }, app, { remove: true });
      }
    }
  }
}

import { appNameType } from ".";

export default class Account implements IAccount {
  public username: string;
  public rootPath: string;
  public waitingFolderList: IWaitingFolder[];
  constructor(rootPath: string, app: appNameType, platform: any) {
    this.rootPath = rootPath;
    this.username = platform.getUserName(app, rootPath);
    this.waitingFolderList = platform.getWaitingFolderList(app, rootPath);
  }

  public getName(): string {
    return this.username;
  }

  public getRootPath(): string {
    return this.rootPath;
  }

  public getWaitingFolderList(): IWaitingFolder[] {
    return this.waitingFolderList;
  }
}

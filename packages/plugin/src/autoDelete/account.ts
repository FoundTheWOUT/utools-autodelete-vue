export default class Account implements IAccount {
  public username;
  public rootPath;
  public waitingFolderList;
  constructor(
    username: string,
    rootPath: string,
    folderList: IWaitingFolder[]
  ) {
    this.username = username;
    this.rootPath = rootPath;
    this.waitingFolderList = folderList;
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

export interface Accounts {
  account: string;
  waitingFolderList: { status: boolean; path: string }[];
}
export interface cacheFile {
  [app: string]: Accounts[];
}

export interface stateType {
  app: string[];
  curApp: number;
  activeAccountID: number;
  accounts: Accounts[];
  cacheFile: cacheFile;
  folderSize: string;
  pendingFolderSize: boolean;
}

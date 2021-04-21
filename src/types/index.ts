export interface Accounts {
  account: string;
  waitingFolderList: { status: boolean; path: string }[];
}
export interface cacheFile {
  [app: string]: Accounts[];
}

export interface stateType {
  activeAccountID: number;
  accounts: Accounts[];
  cacheFile: cacheFile;
  folderSize: string;
  pendingFolderSize: boolean;
}

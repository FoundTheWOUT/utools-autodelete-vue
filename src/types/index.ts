export interface Accounts {
  account: string;
  waitingFolderList: string[];
}
export interface cacheFile {
  [property: string]: Accounts[];
}

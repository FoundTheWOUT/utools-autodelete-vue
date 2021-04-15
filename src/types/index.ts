export interface Accounts {
  account: string;
  waitingFolderList: { status: boolean; path: string }[];
}
export interface cacheFile {
  [property: string]: Accounts[];
}

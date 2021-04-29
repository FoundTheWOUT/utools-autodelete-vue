export interface Accounts {
  account: string;
  waitingFolderList: { status: boolean; path: string }[];
}
export interface cacheFile {
  [app: string]: Accounts[];
}

export interface FolderSizePromise {
  promise: Promise<number>;
  cancel: () => void;
}

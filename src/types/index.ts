export interface Account {
  account: string;
  rootPath: string;
  waitingFolderList: { status: boolean; path: string }[];
}
export interface cacheFile {
  [app: string]: Account[];
}

export interface FolderSizePromise {
  promise: Promise<number>;
  cancel: () => void;
}

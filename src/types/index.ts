export interface Account {
  username: string;
  rootPath: string;
  waitingFolderList: {
    status: boolean;
    name: string;
    path: string | string[];
  }[];
}
export interface cacheFile {
  [app: string]: Account[];
}

export interface FolderSizePromise {
  promise: Promise<number>;
  cancel: () => void;
}

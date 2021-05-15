import type { Account, FolderSizePromise } from "./types";

declare global {
  interface Window {
    utools: any;
    api: {
      getFile: (app: string, cb?: (Accounts: Account[]) => void) => void;
      cleanUpSubItem: (List: string | string[], cb?: () => void) => void;
      deleteFilePromise: (path: string) => Promise<null>;
      getFolderSize: (pathArr: string[]) => FolderSizePromise[];
    };
  }
}
export {};

import type { Account, FolderSizePromise } from "./types";

declare global {
  const utools: any;
  interface Window {
    api: {
      getFile: (app: string, cb?: (Accounts: Account[]) => void) => void;
      cleanUpSubItem: (List: string | string[], cb?: () => void) => void;
      deleteFilePromise: (path: string) => Promise<null>;
      getFolderSize: (pathArr: string[]) => FolderSizePromise[];
    };
  }
}

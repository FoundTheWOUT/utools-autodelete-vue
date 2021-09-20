declare global {
  interface Window {
    autoDelete: any;
    utils: any;
    Dialog: any;
  }
  interface IAccount {
    username: string;
    rootPath: string;
    waitingFolderList: IWaitingFolder[];
  }

  interface IWaitingFolder {
    status: boolean;
    name: string;
    path: string[];
  }

  interface ICancelablePromise<T> {
    promise: Promise<T>;
    cancel: () => void;
  }
}
export {};

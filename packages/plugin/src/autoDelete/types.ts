import { appNameType } from ".";

export type IAppConfig = {
  dir?: string[];
  mid?: string[];
  waitingFolderPath?: string[];
  removeV?: string[];
  accountPaths?: string[];
};

export type IConfig = Record<appNameType, IAppConfig>;

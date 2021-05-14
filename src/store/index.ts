import Vue from "vue";
import Vuex, { Store } from "vuex";
import { actionsDefinition } from "./actions";
import type { Account, cacheFile, FolderSizePromise } from "../types";

Vue.use(Vuex);

export { action } from "./actions";

const state = {
  app: ["WeChat", "QQ"],
  curApp: 0,
  activeAccountID: 0,
  accounts: [] as Account[],
  cacheFile: {} as cacheFile,
  folderSize: "0",
  pendingFolderSize: false,
  getFileSizePromise: [] as FolderSizePromise[],
};

export type StateType = typeof state;

export enum mutations {
  SET_ACCOUNT = "SET_ACCOUNT",
  SET_ACCOUNTS = "SET_ACCOUNTS",
  PUT_CACHE_FILE = "PUT_CACHE_FILE",
  SET_FILE_SIZE = "SET_FILE_SIZE",
  SET_ACCOUNT_ID = "SET_ACCOUNT_ID",
  SET_PENDING_STATUS = "SET_PENDING_STATUS",
  SWITCH_APP = "SWITCH_APP",
  SET_PROMISE = "SET_PROMISE",
}

export default new Store({
  state,
  getters: {
    selectedWaitingFolderList: (state) => {
      //   return []
      return state.accounts[state.activeAccountID].waitingFolderList
        .filter((v) => v.status !== false)
        .map((v) => v.path);
    },
    curAccount: (state) => {
      return state.accounts[state.activeAccountID];
    },
  },
  mutations: {
    [mutations.SET_ACCOUNT]: (state, account: Account) => {
      state.accounts[state.activeAccountID] = account;
    },
    [mutations.SET_ACCOUNTS]: (state, accounts: Account[]) => {
      state.accounts = accounts;
    },
    [mutations.SET_ACCOUNT_ID]: (state, id) => {
      state.activeAccountID = id;
    },
    [mutations.PUT_CACHE_FILE]: (
      state,
      payload: { app: string; accounts: Account[] }
    ) => {
      state.cacheFile[payload.app] = payload.accounts;
    },
    [mutations.SET_FILE_SIZE]: (state, size) => {
      // TODO: refactor set-file-size mutation
      console.log("update size: ", size);
      state.folderSize = size;
    },
    [mutations.SET_PENDING_STATUS]: (state, status) => {
      state.pendingFolderSize = status;
    },
    [mutations.SWITCH_APP]: (state, app: string) => {
      state.curApp = state.app.indexOf(app) !== -1 ? state.app.indexOf(app) : 0;
    },
    [mutations.SET_PROMISE]: (state, promiseArr) => {
      state.getFileSizePromise = promiseArr;
    },
  },
  actions: actionsDefinition,
});

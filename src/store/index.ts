import Vue from "vue";
import Vuex, { Store } from "vuex";
import { Accounts, cacheFile, FolderSizePromise } from "../types";
import { actionsDefinition } from "./actions";

Vue.use(Vuex);

export { action } from "./actions";

const state = {
  app: ["WeChat", "QQ"],
  curApp: 0,
  activeAccountID: 0,
  accounts: [] as Accounts[],
  cacheFile: {} as cacheFile,
  folderSize: "0",
  pendingFolderSize: false,
  globalMask: false,
  getFileSizePromise: [] as FolderSizePromise[],
};

export type StateType = typeof state;

export enum mutations {
  SET_ACCOUNTS = "SET_ACCOUNTS",
  PUT_CACHE_FILE = "PUT_CACHE_FILE",
  SET_FILE_SIZE = "SET_FILE_SIZE",
  SET_ACCOUNT_ID = "SET_ACCOUNT_ID",
  SET_PENDING_STATUS = "SET_PENDING_STATUS",
  SWITCH_APP = "SWITCH_APP",
  SET_GLOBALMASK = "SET_GLOBALMASK",
  SET_PROMISE = "SET_PROMISE",
}

export default new Store({
  state,
  getters: {
    selectedWaitingFolderList: state => {
      //   return []
      return state.accounts[state.activeAccountID].waitingFolderList
        .filter(v => v.status !== false)
        .map(v => v.path);
    },
  },
  mutations: {
    [mutations.SET_ACCOUNTS]: (state, accounts: Accounts[]) => {
      state.accounts = accounts;
    },
    [mutations.SET_ACCOUNT_ID]: (state, id) => {
      state.activeAccountID = id;
    },
    [mutations.PUT_CACHE_FILE]: (
      state,
      payload: { app: string; accounts: Accounts[] }
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
    [mutations.SET_GLOBALMASK]: (state, status: boolean) => {
      state.globalMask = status;
    },
    [mutations.SET_PROMISE]: (state, promiseArr) => {
      state.getFileSizePromise = promiseArr;
    },
  },
  actions: actionsDefinition,
});

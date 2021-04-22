import Vue from "vue";
import Vuex, { Store } from "vuex";
import { Accounts, stateType } from "../types";
import { actionsDefinition } from "./actions";

Vue.use(Vuex);

export { action } from "./actions";

export const mutations = {
  SET_ACCOUNTS: "SET_ACCOUNTS",
  PUT_CACHE_FILE: "PUT_CACHE_FILE",
  SET_FILE_SIZE: "SET_FILE_SIZE",
  SET_ACCOUNT_ID: "SET_ACCOUNT_ID",
  SET_PENDING_STATUS: "SET_PENDING_STATUS",
  SWITCH_APP: "SWITCH_APP",
};

export default new Store<stateType>({
  state: {
    app: ["WeChat", "QQ"],
    curApp: 0,
    activeAccountID: 0,
    accounts: [],
    cacheFile: {},
    folderSize: "0",
    pendingFolderSize: false,
  },
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
  },
  actions: actionsDefinition,
});

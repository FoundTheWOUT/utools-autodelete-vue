import Vue from "vue";
import Vuex, { Store } from "vuex";
import { Accounts, cacheFile } from "../types";
import { actionsDefinition } from "./actions";

Vue.use(Vuex);

export { action } from "./actions";

export const mutations = {
  SET_ACCOUNTS: "SET_ACCOUNTS",
  PUT_CACHE_FILE: "PUT_CACHE_FILE",
  SET_FILE_SIZE: "SET_FILE_SIZE",
  SET_ACCOUNT_ID: "SET_ACCOUNT_ID",
  SET_PADDING_STATUS: "SET_PADDING_STATUS",
};

export default new Store({
  state: {
    activeAccountID: 0,
    accounts: [] as Accounts[],
    cacheFile: {} as cacheFile,
    folderSize: "0",
    paddingFolderSize: false,
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
      console.log("update size: ", size);
      state.folderSize = size;
    },
    [mutations.SET_PADDING_STATUS]: (state, status) => {
      state.paddingFolderSize = status;
    },
  },
  actions: actionsDefinition,
});

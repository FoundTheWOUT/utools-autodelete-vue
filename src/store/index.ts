import Vue from "vue";
import Vuex, { Store } from "vuex";
import { actionsDefinition } from "./actions";

Vue.use(Vuex);

export { action } from "./actions";

const state = {
  app: ["WeChat", "QQ"],
  curApp: 0,
  activeAccountID: 0,
  accounts: [] as IAccount[],
  folderSize: "0",
  pendingFolderSize: false,
  getFileSizePromise: [] as ICancelablePromise<number>[],
};

export type StateType = typeof state;

export enum mutations {
  SET_ACCOUNT = "SET_ACCOUNT",
  SET_ACCOUNTS = "SET_ACCOUNTS",
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
      const waitingFolderList =
        state.accounts[state.activeAccountID].waitingFolderList;
      if (!Array.isArray(waitingFolderList)) return [];
      return waitingFolderList
        .filter((v) => v.status === true)
        .map((v) => v.path)
        .flat();
    },
    curAccount: (state) => {
      console.debug("curring account: ", state.accounts[state.activeAccountID]);
      return state.accounts[state.activeAccountID];
    },
  },
  mutations: {
    [mutations.SET_ACCOUNT]: (state, account: IAccount) => {
      state.accounts[state.activeAccountID] = account;
    },
    [mutations.SET_ACCOUNTS]: (state, accounts: IAccount[]) => {
      state.accounts = accounts;
    },
    [mutations.SET_ACCOUNT_ID]: (state, id) => {
      state.activeAccountID = id;
    },
    [mutations.SET_FILE_SIZE]: (state, size) => {
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

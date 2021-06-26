import { ActionTree } from "vuex";
import { mutations } from "./index";
import type { StateType } from "./index";

export enum action {
  SET_ACCOUNTS = "SET_ACCOUNTS",
  GET_SET_FILE_SIZE = "GET_SET_FILE_SIZE",
  CLEAR_FILES = "CLEAR_FILES",
  REMOVE_ACCOUNT = "REMOVE_ACCOUNT",
}

export const actionsDefinition: ActionTree<StateType, StateType> = {
  [action.SET_ACCOUNTS]: async ({ commit }, app: string) => {
    // reset AccountId
    commit(mutations.SET_ACCOUNT_ID, 0);
    let Accounts: IAccount[];
    if (process.env.NODE_ENV === "production") {
      Accounts = window?.autoDelete.getAccounts(app);
    } else {
      const data = await import("../mock/data.json");
      // eslint-disable-next-line prettier/prettier
      Accounts = data.default
    }
    // if have Accounts
    // 1.set Accounts to state
    // 2.switch app
    // 3.put Accounts to cache
    if (Accounts.length) {
      commit(mutations.SET_ACCOUNTS, Accounts);
      commit(mutations.SWITCH_APP, app);
    }
  },
  // TODO: refactor get file size, extract function to Class
  [action.GET_SET_FILE_SIZE]: async ({ state, getters, commit }) => {
    commit(mutations.SET_PENDING_STATUS, true);
    // example
    // let size = await windows?.AutoDelete.getFolderSize(List[])
    if (process.env.NODE_ENV === "development") return;

    // if pending Promises exists, cancel them.
    if (state.getFileSizePromise.length !== 0)
      state.getFileSizePromise.forEach((item) => item.cancel());
    const getFolderSizePromise = window?.utils?.getFolderSize(
      getters.selectedWaitingFolderList
    );
    const promise: Promise<number[]> = Promise.all(
      getFolderSizePromise.map((v: any) => v.promise)
    );
    // store pending promise
    // commit(mutations.SET_PROMISE, getFolderSizePromise);

    promise
      .then((size: number[]) => {
        const totalSize =
          size.length !== 0 ? size.reduce((pre, cur) => pre + cur) : 0;
        let totalSizeString;

        if (totalSize / 1024 / 1024 / 1024 >= 1) {
          // if greater then 1GB,
          totalSizeString = `${(totalSize / 1024 / 1024 / 1024).toFixed(2)} GB`;
        } else {
          // convert to GB
          totalSizeString = `${(totalSize / 1024 / 1024).toFixed(2)} MB`;
        }

        commit(mutations.SET_FILE_SIZE, `${totalSizeString}`);
        commit(mutations.SET_PENDING_STATUS, false);
        // clear Promise
      })
      .catch((err: string) => {
        console.warn(err);
        // commit(mutations.SET_FILE_SIZE, "0");
        commit(mutations.SET_PENDING_STATUS, false);
      });
  },
  [action.REMOVE_ACCOUNT]: async ({ state, commit, dispatch }) => {
    const _account = state.accounts[state.activeAccountID];

    const newAccount: IAccount = {
      username: "该账号已删除",
      rootPath: "",
      waitingFolderList: [],
    };
    window?.autoDelete.cleanUp([_account.rootPath]).then(() => {
      commit(mutations.SET_ACCOUNT, newAccount);
      dispatch(action.GET_SET_FILE_SIZE);
    });
  },
  [action.CLEAR_FILES]: async ({ getters }) => {
    window?.autoDelete
      .cleanUp(getters.selectedWaitingFolderList)
      .catch((err: any) => {
        console.warn("action CLEAR_FILES fail: ", err);
      });
  },
};

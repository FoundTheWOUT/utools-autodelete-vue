import { ActionTree } from "vuex";
import { mutations, StateType } from "./index";
import { Accounts, FolderSizePromise } from "../types";

export enum action {
  SET_ACCOUNTS = "SET_ACCOUNTS",
  GET_SET_FILE_SIZE = "GET_SET_FILE_SIZE",
}

export const actionsDefinition: ActionTree<StateType, StateType> = {
  [action.SET_ACCOUNTS]: async ({ state, commit }, app: string) => {
    // reset AccountId
    commit(mutations.SET_ACCOUNT_ID, 0);

    //check cache
    Object.keys(state.cacheFile).some(arrVal => {
      if (arrVal === app && state.cacheFile[app].length !== 0) {
        console.log("using cache");
        console.log({ app, input: state.cacheFile[app] });
        commit(mutations.SET_ACCOUNTS, state.cacheFile[app]);
        commit(mutations.SWITCH_APP, app);
        return;
      }
    });

    if (process.env.NODE_ENV === "development") {
      const testAccounts = [
        {
          account: "wauaddddddddddddddddddd",
          waitingFolderList: [
            {
              status: true,
              path:
                "34dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
            },
            { status: true, path: "12" },
            { status: true, path: "hi" },
          ],
        },
        {
          account: "happy",
          waitingFolderList: [
            { status: true, path: "134" },
            { status: true, path: "15" },
          ],
        },
      ];
      commit(mutations.SET_ACCOUNTS, testAccounts);
      commit(mutations.PUT_CACHE_FILE, { app, accounts: testAccounts });
      return;
    }

    await window.exports.getFile(app, (AccountsArr: Accounts[]) => {
      // if have Accounts
      // 1.set Accounts to state
      // 2.switch app
      // 3.put Accounts to cache
      if (AccountsArr) {
        commit(mutations.SET_ACCOUNTS, AccountsArr);
        commit(mutations.SWITCH_APP, app);
        commit(mutations.PUT_CACHE_FILE, { app, accounts: AccountsArr });
      }
    });
  },
  [action.GET_SET_FILE_SIZE]: async ({ state, getters, commit }) => {
    if (state.getFileSizePromise.length !== 0) {
      console.log("have promise: ", state.getFileSizePromise);
      state.getFileSizePromise.forEach(item => item.cancel());
      // const fastestPromise = new Promise(resolve => resolve("I am fastest"));
      // Promise.race([fastestPromise, state.getFileSizePromise]).then(res => {
      //   console.log(res);
      // });
    }

    commit(mutations.SET_PENDING_STATUS, true);
    const getFolderSizePromise = window.exports?.getFolderSize(
      getters.selectedWaitingFolderList
    );
    // const promiseObj = {
    //   promise: Promise.all([getFolderSize.map((v: FolderSizePromise) => v.promise)]),
    //   cancelFunc: getFolderSize.map((v: FolderSizePromise) => v.cancel),
    // };
    const promise: Promise<number[]> = Promise.all(
      getFolderSizePromise.map((v: FolderSizePromise) => v.promise)
    );
    // console.log(promiseObj);
    commit(mutations.SET_PROMISE, getFolderSizePromise);

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
        // clear PROMISE
        commit(mutations.SET_PROMISE, []);
      })
      .catch((err: string) => {
        console.error(err);
        commit(mutations.SET_FILE_SIZE, "0");
        commit(mutations.SET_PENDING_STATUS, false);
      });
  },
};

import { ActionTree } from "vuex";
import { mutations } from "./index";

export const action = {
  SET_ACCOUNTS: "SET_ACCOUNTS",
  GET_SET_FILE_SIZE: "GET_SET_FILE_SIZE",
};

export const actionsDefinition: ActionTree<any, any> = {
  [action.SET_ACCOUNTS]: async ({ state, commit }, app: string) => {
    let accounts;
    //check cache
    commit(mutations.SET_ACCOUNT_ID, 0);
    Object.keys(state.cacheFile).some(async arrVal => {
      if (arrVal === app && state.cacheFile[app].length !== 0) {
        console.log("using cache");
        console.log({ app, input: state.cacheFile[app] });
        commit(mutations.SET_ACCOUNTS, state.cacheFile[app]);
        return;
      }
    });

    if (process.env.NODE_ENV === "development") {
      accounts = [
        {
          account: "waua",
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
    } else {
      accounts = await window.exports.getFile(app);
    }
    commit(mutations.SET_ACCOUNTS, accounts);
    commit(mutations.PUT_CACHE_FILE, { app, accounts });
  },
  [action.GET_SET_FILE_SIZE]: async ({ getters, commit }) => {
    commit(mutations.SET_PENDING_STATUS, true);
    window.exports
      ?.getFolderSize(getters.selectedWaitingFolderList)
      .then((size: number[]) => {
        const totalSize =
          size.length !== 0 ? size.reduce((pre, cur) => pre + cur) : 0;
        // conver to GB
        commit(
          mutations.SET_FILE_SIZE,
          `${(totalSize / 1024 / 1024 / 1024).toFixed(2)} GB`
        );
        commit(mutations.SET_PENDING_STATUS, false);
      })
      .catch((err: string) => {
        console.error(err);
        commit(mutations.SET_FILE_SIZE, "0");
        commit(mutations.SET_PENDING_STATUS, false);
      });
  },
};

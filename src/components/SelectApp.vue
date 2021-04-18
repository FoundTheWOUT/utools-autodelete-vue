<template>
  <div class="w-4/5 m-auto">
    <div class="flex justify-center">
      <button
        class="w-40 rounded-full m-4 p-2 bg-gray-500 hover:bg-gray-700 focus:outline-none"
        :class="curApp === app.indexOf(item) ? 'bg-gray-700' : ''"
        v-for="item in app"
        :key="item"
        @click="handleSwitchApp(item)"
      >
        <p class="text-lg text-white font-bold">
          {{ item }}
        </p>
      </button>
    </div>
    <AppCard :accounts="accounts" ref="AppCard"></AppCard>
    <div class="flex flex-row px-3 pt-2 text-gray-400">
      <div class="mx-1">文件大小：</div>
      <svg
        v-if="paddingFolderSize"
        class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-300"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <div v-if="!paddingFolderSize">{{ folderSize }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import AppCard from "./AppCard.vue";
import { EventBus } from "../event-bus";
import type { Accounts, cacheFile } from "../types";
import * as _ from "lodash";

const TestAccounts = [
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

export default Vue.extend({
  data() {
    return {
      curApp: 0,
      app: ["WeChat", "QQ"],
      accounts: [] as Accounts[],
      cacheFile: {} as cacheFile,
      folderSize: "0",
      paddingFolderSize: false,
    };
  },
  components: {
    AppCard,
  },
  created() {
    this.getFileSizeFromArray = _.debounce(this.getFileSizeFromArray, 800);
  },
  mounted() {
    this.handleSwitchApp(this.app[this.curApp]);
    EventBus.$on("clean-up", () => {
      this.handelCleanUp(this.filterWaitingFolderList());
    });
    EventBus.$on("check-box-change", () => {
      this.getFileSizeFromArray();
    });
  },
  methods: {
    getActiceID(): number {
      return (this.$refs.AppCard as Vue & { activeID: number }).activeID;
    },

    filterWaitingFolderList(): string[] {
      return this.accounts[this.getActiceID()].waitingFolderList
        .filter(v => v.status !== false)
        .map(v => v.path);
    },

    handelCleanUp(FolderList: string[]) {
      if (window.exports?.cleanUpSubItem) {
        window.exports.cleanUpSubItem(FolderList);
      } else {
        console.log("no method");
      }
    },

    handleSwitchApp(app: string) {
      // we must get the accouts first to own enough information
      this.accounts = this.handleGetFile(app);
      this.getFileSizeFromArray();
      switch (app) {
        case "QQ":
          this.curApp = 1;
          break;
        case "WeChat":
          this.curApp = 0;
          break;
      }
    },

    handleGetFile(app: string): Accounts[] {
      // check if caching
      Object.keys(this.cacheFile).some(arrVal => {
        // TODO:
        if (arrVal === app && this.cacheFile[app].length !== 0) {
          console.log("using cache");
          return this.cacheFile[app];
        }
      });

      // check env
      if (process.env.NODE_ENV === "production") {
        return (this.cacheFile[app] = window.exports?.getFile(app));
      } else {
        return (this.cacheFile[app] = TestAccounts);
      }
    },

    getFileSizeFromArray() {
      this.paddingFolderSize = true;
      window.exports
        ?.getFolderSize(this.filterWaitingFolderList())
        .then((size: number[]) => {
          let totalSize =
            size.length !== 0 ? size.reduce((pre, cur) => pre + cur) : 0;
          // conver to GB
          this.folderSize = `${(totalSize / 1024 / 1024 / 1024).toFixed(2)} GB`;
          this.paddingFolderSize = false;
        })
        .catch((err: string) => {
          console.error(err);
          this.folderSize = "0";
          this.paddingFolderSize = false;
        });
    },
  },
});
</script>

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
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import AppCard from "./AppCard.vue";
import { EventBus } from "../event-bus";
import type { Accounts, cacheFile } from "../types";

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
    };
  },
  components: {
    AppCard,
  },

  mounted() {
    this.handleSwitchApp(this.app[this.curApp]);
    EventBus.$on("clean-up", () => {
      this.handelCleanUp(this.filterWaitingFolderList());
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
      EventBus.$emit('check-box-change')
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
  },
});
</script>

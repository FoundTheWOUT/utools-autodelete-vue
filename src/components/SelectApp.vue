<template>
  <div>
    <b-row style="margin:10px;">
      <b-col v-for="item in app" :key="item">
        <b-button
          pill
          :pressed="curApp == app.indexOf(item)"
          size="lg"
          @click="handleSwitchApp(item)"
        >
          {{ item }}
        </b-button>
      </b-col>
    </b-row>
    <AppCard :accounts="accounts" ref="AppCard"></AppCard>
    <div class="d-flex flex-row-reverse text-secondary px-3 pt-2">
      文件大小: {{ folderSize }} GB
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import AppCard from "./AppCard.vue";
import { EventBus } from "../event-bus";
import { Accounts, cacheFile } from "../types";

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
    };
  },
  components: {
    AppCard,
  },
  created() {
    this.handleSwitchApp(this.app[this.curApp]);
  },
  mounted() {
    EventBus.$on("clean-up", () => {
      // filter path
      let pathArr = this.accounts[this.getActiceID()].waitingFolderList
        .filter(v => v.status !== false)
        .map(v => v.path);

      this.handelCleanUp(pathArr);
    });
    EventBus.$on("check-box-change", () => {
      // filter path
      let pathArr = this.accounts[this.getActiceID()].waitingFolderList
        .filter(v => v.status !== false)
        .map(v => v.path);
      this.folderSize = "计算中...";
      this.handleGetFileSizeFromArray(pathArr);
    });
  },
  methods: {
    getActiceID(): number {
      return (this.$refs.AppCard as Vue & { activeID: number }).activeID;
    },

    handelCleanUp(FolderList: string[]) {
      if (window.exports?.cleanUpSubItem) {
        window.exports.cleanUpSubItem(FolderList);
      } else {
        console.log("no method");
      }
    },

    handleSwitchApp(app: string) {
      switch (app) {
        case "QQ":
          this.curApp = 1;
          this.accounts = this.handleGetFile(app);
          break;
        case "WeChat":
          this.curApp = 0;
          this.accounts = this.handleGetFile(app);
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
        // old WeChat API
        // if (app === "微信") {
        //   return (this.cacheFile["微信"] = window.exports?.getWeChatFile());
        // }
        return (this.cacheFile[app] = window.exports?.getFile(app));
      } else {
        return (this.cacheFile[app] = TestAccounts);
      }
    },

    async handleGetFileSizeFromArray(arr: string[]): Promise<number> {
      let total = 0;
      for (const item of arr) {
        total += await window.exports?.getFolderSize(item);
      }
      return total;
    },
  },
});
</script>

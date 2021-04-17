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
    <div class="d-flex flex-row text-secondary px-3 pt-2">
      <div class="mx-1">文件大小：</div>
      <b-spinner
        v-if="paddingFolderSize"
        class="my-auto"
        small
        label="Loading..."
      ></b-spinner>
      <div v-if="!paddingFolderSize">{{ folderSize }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import AppCard from "./AppCard.vue";
import { EventBus } from "../event-bus";
import { Accounts, cacheFile } from "../types";
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

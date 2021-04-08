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
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import AppCard from "./AppCard.vue";
import { EventBus } from "../event-bus";
const TestAccounts = [
  {
    account: "waua",
    waitingFolderList: ["12", "hi"],
  },
  {
    account: "happy",
    waitingFolderList: ["34", "134", "15"],
  },
];

interface Accounts {
  account: string;
  waitingFolderList: string[];
}
interface cacheFile {
  [property: string]: Accounts[];
}
export default Vue.extend({
  data() {
    return {
      curApp: 0,
      app: ["微信", "QQ"],
      accounts: [] as Accounts[],
      cacheFile: {} as cacheFile,
    };
  },
  components: {
    AppCard,
  },
  created() {
    if (process.env.NODE_ENV === "production") {
      this.handleSwitchApp(this.app[this.curApp]);
    } else {
      this.accounts = TestAccounts;
    }
  },
  mounted() {
    EventBus.$on("clean-up", () => {
      this.handelCleanUp();
    });
  },
  methods: {
    handelCleanUp() {
      if (window.exports?.cleanUpSubItem) {
        window.exports.cleanUpSubItem(
          this.accounts[
            (this.$refs.AppCard as Vue & { activeID: number }).activeID
          ].waitingFolderList
        );
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
        case "微信":
          this.curApp = 0;
          this.accounts = this.handleGetFile(app);
          break;
      }
    },
    handleGetFile(app: string): Accounts[] {
      // check if caching
      if (Object.keys(this.cacheFile[app]).length !== 0) {
        return this.cacheFile[app];
      }
      if (app === "微信") {
        return (this.cacheFile["微信"] = window.exports?.getWeChatFile());
      }
      return (this.cacheFile[app] = window.exports?.getFile(app));
    },
  },
});
</script>

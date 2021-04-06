<template>
  <div>
    <b-row style="margin:10px;">
      <b-col v-for="item in btn" :key="item">
        <b-button
          pill
          :pressed="curBtn == btn.indexOf(item)"
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
import { TestAccounts } from "../js/datatest.js";

interface Accounts {
  account: string;
  waitingFolderList: string[];
}

export default Vue.extend({
  data() {
    return {
      curBtn: 0,
      btn: ["微信", "QQ"],
      accounts: [] as Accounts[],
    };
  },
  components: {
    AppCard,
  },
  created() {
    if (process.env.NODE_ENV === "production") {
      this.accounts = window.exports.getWeChatFile();
    } else {
      this.accounts = TestAccounts;
    }
  },
  methods: {
    Clean: function() {
      window.exports.cleanUpSubItem(
        this.accounts[
          (this.$refs.AppCard as Vue & { activeID: number }).activeID
        ].waitingFolderList
      );
    },
    handleSwitchApp: function(app: string) {
      switch (app) {
        case "QQ":
          this.curBtn = 1;
          this.accounts = window.exports.getFile(window.exports.dir.qqDir);
          break;
        case "微信":
          this.curBtn = 0;
          this.accounts = window.exports.getWeChatFile();
          break;
      }
    },
  },
});
</script>

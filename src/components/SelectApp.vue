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

<script>
import AppCard from "./AppCard";

let accounts;
if (process.env.NODE_ENV === "production") {
  accounts = window.exports.getWeChatFile();
} else {
  let accountsReq = require("../js/datatest");
  accounts = accountsReq.accounts;
}
export default {
  data() {
    return {
      curBtn: 0,
      btn: ["微信", "QQ"],
      accounts,
    };
  },
  components: {
    AppCard,
  },
  methods: {
    Clean: function() {
      window.exports.cleanUpSubItem(
        this.accounts[this.$refs.AppCard.activeID].waitingFolderList
      );
    },
    handleSwitchApp: function(app) {
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
};
</script>

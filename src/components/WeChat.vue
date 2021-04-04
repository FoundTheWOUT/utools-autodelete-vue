<template>
  <b-container fluid>
    <b-card no-body>
      <b-tabs pills card vertical>
        <b-tab title="账号" disabled></b-tab>
        <b-tab
          v-show="accounts.length !== 0"
          v-for="(account, index) in accounts"
          :key="account.name"
          :title="account.name"
          @click="activeID = index"
        >
          <b-card no-body>
            <b-list-group
              flush
              v-for="waitingItem in account.waitingFloderList"
              :key="waitingItem"
            >
              <b-list-group-item href="#" @click="openFloder(waitingItem)">{{
                waitingItem
              }}</b-list-group-item>
            </b-list-group>
            <b-card-footer>点击可打开目录查看</b-card-footer>
          </b-card>
        </b-tab>
      </b-tabs>
    </b-card>
  </b-container>
</template>

<script>
let accounts;
if (process.env.NODE_ENV === "production") {
  accounts = window.exports.accounts;
} else {
  let accountsReq = require("../js/datatest");
  accounts = accountsReq.accounts;
}

export default {
  data() {
    return {
      activeID: 0,
      accounts,
    };
  },
  methods: {
    openFloder: function(target) {
      window.utools.shellOpenPath(target);
    },
  },
  computed: {
    ListIs() {
      return accounts[this.activeID].waitingFloderList;
    },
  },
};
</script>

<style scoped></style>

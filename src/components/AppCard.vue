<template>
  <b-container fluid>
    <b-card no-body>
      <b-tabs pills card vertical>
        <b-tab title="账号" disabled></b-tab>
        <b-tab
          v-show="accounts.length !== 0"
          v-for="(account, index) in accounts"
          :key="account.account"
          :title="account.account"
          @click="activeID = index"
        >
          <b-card no-body>
            <b-list-group
              flush
              v-for="waitingItem in account.waitingFolderList"
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
export default {
  props: { accounts: Array },
  data() {
    return {
      activeID: 0,
    };
  },
  methods: {
    openFloder: function(target) {
      window.utools.shellOpenPath(target);
    },
  },
};
</script>

<style scoped></style>

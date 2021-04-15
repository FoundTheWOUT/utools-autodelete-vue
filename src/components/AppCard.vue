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
              class="d-flex flex-row"
              flush
              v-for="item in account.waitingFolderList"
              :key="item.path"
            >
              <b-form-checkbox
                class="my-auto mx-2"
                v-model="item.status"
                @change="handleCheckbox"
              />
              <b-list-group-item href="#" @click="openFloder(item.path)">
                {{ item.path }}
              </b-list-group-item>
            </b-list-group>
            <b-card-footer>点击可打开目录查看</b-card-footer>
          </b-card>
        </b-tab>
      </b-tabs>
    </b-card>
  </b-container>
</template>

<script lang="ts">
import Vue from "vue";
import { EventBus } from "../event-bus";

export default Vue.extend({
  props: { accounts: Array },
  data() {
    return {
      activeID: 0,
    };
  },
  mounted() {
    // console.log(this.accounts);
  },
  methods: {
    openFloder(target: string): void {
      window.utools.shellOpenPath(target);
    },
    handleCheckbox(): void {
      EventBus.$emit("check-box-change");
    },
  },
});
</script>

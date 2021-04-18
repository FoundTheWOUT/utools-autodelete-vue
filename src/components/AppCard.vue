<template>
  <div>
    <div title="账号" disabled></div>
    <div
      v-show="accounts.length !== 0"
      v-for="(account, index) in accounts"
      :key="account.account"
      :title="account.account"
      @click="handelChangeAccount(index)"
    >
      <div>
        <div
          class="d-flex flex-row"
          flush
          v-for="item in account.waitingFolderList"
          :key="item.path"
        >
          <div class="my-auto mx-2" @change="handleCheckbox">
            <div href="#" @click="openFloder(item.path)">
              {{ item.path }}
            </div>
          </div>
          <div>点击可打开目录查看</div>
        </div>
      </div>
    </div>
  </div>
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

    handelChangeAccount(index: number): void {
      this.activeID = index;
      EventBus.$emit("check-box-change");
    },
  },
});
</script>

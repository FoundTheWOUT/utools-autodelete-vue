<template>
  <div class="flex flex-row justify-center">
    <div class="flex flex-col mx-2">
      <button
        class="m-1 px-3 py-1 rounded-full focus:outline-none hover:bg-blue-200"
        v-for="(account, index) in accounts"
        :class="index === activeID ? 'bg-blue-500' : ''"
        :key="account.account"
        @click="handelChangeAccount(index)"
      >
        <p class="font-bold" :class="index === activeID ? 'text-white' : ''">
          {{ account.account }}
        </p>
      </button>
    </div>
    <FolderList :list="folderList"></FolderList>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { EventBus } from "../event-bus";
import FolderList from "./FolderList.vue";
import type { Accounts } from "../types"

export default Vue.extend({
  props: { accounts: Array as () => Accounts[] },
  components: {
    FolderList,
  },
  data() {
    return {
      activeID: 0,
    };
  },
  computed: {
    folderList(): { status: boolean; path: string }[] {
      return this.accounts[this.activeID]?.waitingFolderList
        ? this.accounts[this.activeID].waitingFolderList
        : [];
    },
  },
  methods: {
    handelChangeAccount(index: number): void {
      this.activeID = index;
      EventBus.$emit("check-box-change");
    },
  },
});
</script>

<template>
  <div class="flex flex-row justify-center">
    <div class="max-w-xxs flex flex-col mx-2">
      <button
        class="m-1 px-3 py-1 rounded-full outline-none focus:outline-none hover:bg-blue-200 transition-all"
        v-for="(account, index) in accounts"
        :class="index === activeAccountID ? 'bg-blue-500' : ''"
        :key="account.account"
        @click="handelChangeAccount(index)"
      >
        <p
          class="truncate font-bold"
          :class="index === activeAccountID ? 'text-white' : ''"
        >
          {{ account.account }}
        </p>
      </button>
    </div>
    <div class="flex flex-col w-full flex-shrink-0">
      <FolderList />
      <div class="flex ml-auto px-3 pt-2 text-gray-400">
        <div class="mx-1">文件大小：</div>
        <icon
          v-if="pending"
          class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-300"
          iconName="Load"
        ></icon>
        <div v-if="!pending">{{ folderSize }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import FolderList from "./FolderList.vue";
import { mutations, action } from "../store";

export default Vue.extend({
  components: {
    FolderList,
  },
  computed: {
    accounts() {
      return this.$store.state.accounts;
    },
    activeAccountID() {
      return this.$store.state.activeAccountID;
    },
    folderSize() {
      return this.$store.state.folderSize;
    },
    pending() {
      return this.$store.state.pendingFolderSize;
    },
  },
  methods: {
    handelChangeAccount(index: number): void {
      this.$store.commit(mutations.SET_ACCOUNT_ID, index);
      this.$store.dispatch(action.GET_SET_FILE_SIZE);
    },
  },
});
</script>

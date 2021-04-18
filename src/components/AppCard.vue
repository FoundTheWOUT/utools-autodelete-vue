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
    <div class="flex flex-col">
      <FolderList :list="folderList"></FolderList>
      <div class="px-3 pt-2 text-gray-400 ml-auto">
        <div class="mx-1">文件大小：</div>
        <svg
          v-if="paddingFolderSize"
          class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-300"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <div v-if="!paddingFolderSize">{{ folderSize }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { EventBus } from "../event-bus";
import FolderList from "./FolderList.vue";
import type { Accounts } from "../types"
import * as _ from "lodash";


export default Vue.extend({
  props: { accounts: Array as () => Accounts[] },
  components: {
    FolderList,
  },
  data() {
    return {
      activeID: 0,
      paddingFolderSize: false,
      folderSize: "0"
    };
  },
    created() {
    this.getFileSizeFromArray = _.debounce(this.getFileSizeFromArray, 800);
  },
  mounted(){
    EventBus.$on("check-box-change", () => {
      this.getFileSizeFromArray();
    });
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

    getFileSizeFromArray() {
      this.paddingFolderSize = true;
      window.exports
        ?.getFolderSize(this.$refs.selectapp.filterWaitingFolderList())
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
    }
  },
});
</script>

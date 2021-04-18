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
    <div class="flex flex-col w-full">
      <FolderList :list="folderList"></FolderList>
      <div class="px-3 pt-2 text-gray-400 ml-auto flex">
        <div class="mx-1">文件大小：</div>
        <svg
          v-if="padding"
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
        <div v-if="!padding">{{ size }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { EventBus } from "../event-bus";
import FolderList from "./FolderList.vue";
import type { Accounts } from "../types"

export default Vue.extend({
  props: { accounts: Array as () => Accounts[],padding:Boolean,size:String },
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
  mounted(){
    EventBus.$on('reset-activeID',()=>{
      this.resetActiveID()
    })
  },
  computed: {
    folderList(): { status: boolean; path: string }[] {
      return this.accounts[this.activeID]?.waitingFolderList
        ? this.accounts[this.activeID].waitingFolderList
        : [];
    },
  },
  methods: {
    resetActiveID(): void {
      this.activeID = 0
    },
    handelChangeAccount(index: number): void {
      this.activeID = index;
      EventBus.$emit("check-box-change");
    },
  },
});
</script>

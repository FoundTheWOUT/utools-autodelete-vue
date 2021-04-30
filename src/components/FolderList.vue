<template>
  <div class="border-4 rounded-lg w-full p-4">
    <div
      class="flex items-center rounded-lg my-3 py-3 border border-dashed border-indigo-200 hover:border-transparent hover:shadow-lg hover:bg-gray-100 active:shadow-none transition-all"
      v-for="item in list"
      :key="item.path"
    >
      <div class="w-1/12 flex items-center mx-3">
        <input
          class="appearance-none h-5 w-5 border border-gray-300 rounded-md checked:bg-blue-500 checked:border-transparent focus:outline-none"
          type="checkbox"
          v-model="item.status"
          @click="handleCheckbox"
        />
      </div>
      <button
        class="h-auto w-11/12 px-3 focus:outline-none"
        @click="openFloder(item.path)"
      >
        <div class="break-words">{{ item.path }}</div>
      </button>
    </div>
    <div class="flex justify-between items-center">
      <div class="w-2/12"></div>
      <div class="text-gray-400">点击对应条目可打开目录</div>
      <button
        class="warn-btn w-2/12"
        @click="mountPopper"
        ref="removeAccountBtn"
      >
        <p class="text-white font-bold">删除账号</p>
      </button>
    </div>
    <div style="z-index: 999" ref="popper">
      <transition name="slide-fade">
        <Card v-show="removeAccountEnsure" titleCenter>
          <template #title>
            <div class="text-red-500">你确定删除账号吗</div>
          </template>
          <p class="m-3">
            按下确定后该账号文件夹将会被直接移除，该过程无法被阻止
          </p>
          <button
            class="mx-2 warn-btn text-white font-bold"
            @click="sureRemove"
          >
            确定
          </button>
          <button
            class="mx-2 safe-btn text-white font-bold"
            @click="closePanel"
          >
            取消
          </button>
        </Card>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import * as _ from "lodash";
import { action } from "../store";
import Card from "./Card.vue";
import { createPopper } from "@popperjs/core";

export default Vue.extend({
  components: { Card },
  data() {
    return {
      removeAccountEnsure: false,
    };
  },
  computed: {
    list(): [] {
      let state = this.$store.state;
      return state.accounts[state.activeAccountID].waitingFolderList;
    },
  },
  created() {
    this.handleCheckbox = _.debounce(this.handleCheckbox, 800);
  },
  methods: {
    openFloder(target: string): void {
      window.utools.shellOpenPath(target);
    },
    handleCheckbox(): void {
      this.$store.dispatch(action.GET_SET_FILE_SIZE);
    },
    sureRemove(): void {
      this.closePanel();
      this.$store.dispatch(action.REMOVE_ACCOUNT);
    },
    closePanel(): void {
      this.removeAccountEnsure = false;
    },
    mountPopper(): void {
      if (this.removeAccountEnsure) return;
      this.removeAccountEnsure = true;
      createPopper(
        this.$refs.removeAccountBtn as HTMLElement,
        this.$refs.popper as HTMLElement,
        {
          placement: "top",
          modifiers: [{ name: "offset", options: { offset: [-150, 10] } }],
        }
      );
    },
  },
});
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(20px) scale(0.7);
  opacity: 0;
}
</style>

<template>
  <div class="border-4 rounded-lg w-full p-4 dark:border-gray-500">
    <!-- TODO: add poper show the folders will be removed -->
    <div
      class="flex items-center rounded-lg my-3 py-3 border border-dashed border-indigo-200 hover:border-transparent hover:shadow-lg hover:bg-gray-100 active:shadow-none transition-all dark:hover:bg-gray-500 dark:hover:shadow-white dark:active:shadow-none"
      v-for="item in list"
      :key="item.name"
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
        <div class="break-words dark:text-white">{{ item.name }}</div>
      </button>
    </div>
    <div class="flex justify-between items-center">
      <button class="safe-btn w-2/12" @click="openFloder([])">
        <p class="text-white font-bold">打开账号</p>
      </button>
      <div class="text-gray-400">点击对应条目可打开目录</div>
      <button
        class="warn-btn w-2/12"
        @click="showDialog = true"
        @mouseenter="mountPopper"
        @mouseleave="hover = false"
        ref="removeAccountBtn"
      >
        <p class="text-white font-bold">删除账号</p>
      </button>
    </div>
    <Dialog v-model="showDialog">
      <Card title-center>
        <template #title>
          <div class="text-red-500">你确定删除账号吗</div>
        </template>
        <p class="m-3">
          按下确定后该账号文件夹将会被直接移除，且移除过程不可逆
        </p>
        <button class="mx-2 warn-btn text-white font-bold" @click="sureRemove">
          确定
        </button>
        <button class="mx-2 safe-btn text-white font-bold" @click="closePanel">
          取消
        </button>
      </Card>
    </Dialog>
    <div style="z-index: 999" ref="popper">
      <transition name="slide-fade">
        <Card v-show="hover" title-center>
          <template #title>
            <div class="text-red-500">删除当前账号</div>
          </template>
          <p>按下后会询问你是否确认删除账号</p>
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
import Dialog from "./Dialog.vue";
import { createPopper } from "@popperjs/core";
import { mapGetters } from "vuex";

export default Vue.extend({
  components: { Card, Dialog },
  data() {
    return {
      hover: false,
      showDialog: false,
    };
  },
  computed: {
    ...mapGetters(["waitingFolderList"]),
    list(): [] {
      // console.log("List update");
      // let state = this.$store.state;
      // console.log(state.accounts[state.activeAccountID]);
      return this.$store.getters.curAccount?.waitingFolderList;
    },
  },
  created() {
    this.handleCheckbox = _.debounce(this.handleCheckbox, 800);
  },
  methods: {
    // TODO: mac os open messageTemp
    openFloder(target: string | string[]): void {
      if (Array.isArray(target)) {
        window.utools.shellOpenPath(this.$store.getters.curAccount.rootPath);
      } else {
        window.utools.shellOpenPath(target);
      }
    },
    handleCheckbox(): void {
      this.$store.dispatch(action.GET_SET_FILE_SIZE);
    },
    sureRemove(): void {
      this.closePanel();
      this.$store.dispatch(action.REMOVE_ACCOUNT);
    },
    closePanel(): void {
      this.showDialog = false;
    },
    mountPopper(): void {
      this.hover = true;
      createPopper(
        this.$refs.removeAccountBtn as HTMLElement,
        this.$refs.popper as HTMLElement,
        {
          placement: "top",
          modifiers: [{ name: "offset", options: { offset: [0, 10] } }],
        }
      );
    },
  },
});
</script>

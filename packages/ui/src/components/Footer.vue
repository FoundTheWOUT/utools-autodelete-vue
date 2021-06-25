<template>
  <div class="mb-4">
    <Dialog v-model="showDialog">
      <Card class="flex flex-col items-center">
        <div class="flex flex-col items-center">
          <icon class="animate-spin h-10 w-10 text-red-500" icon-name="Load" />
          <p class="animate-flow m-3 text-2xl font-bold">清理中</p>
        </div>
      </Card>
    </Dialog>
    <button
      id="cleanup"
      class="warn-btn"
      @click="cleanup"
      @mouseenter="mountPopper"
      @mouseleave="hover = false"
      ref="cleanBtn"
    >
      <p class="flex items-center text-white font-bold">
        <icon class="h-5 w-5" icon-name="Warn"></icon>
        清空目录
      </p>
    </button>
    <div ref="popper">
      <transition name="slide-fade">
        <Card v-show="hover" title-center>
          <template #title>
            <div class="text-red-500">注意</div>
          </template>
          <div>
            按下后当前选中目录将会被<b>直接</b>清空，请确保需要文件已自行保存
          </div>
        </Card>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { createPopper } from "@popperjs/core";
import { action } from "../store";
import Card from "./Card.vue";
import Dialog from "./Dialog.vue";

export default Vue.extend({
  components: { Card, Dialog },
  data() {
    return {
      hover: false,
      showDialog: false,
    };
  },
  methods: {
    mountPopper() {
      this.hover = true;
      createPopper(
        this.$refs.cleanBtn as HTMLElement,
        this.$refs.popper as HTMLElement,
        {
          placement: "top",
          modifiers: [{ name: "offset", options: { offset: [0, 10] } }],
        }
      );
    },

    async cleanup() {
      console.warn("clean up.");
      this.showDialog = true;
      await this.$store.dispatch(action.CLEAR_FILES);
      setTimeout(() => {
        this.showDialog = false;
        this.$store.dispatch(action.GET_SET_FILE_SIZE);
      }, 500);
    },
  },
});
</script>

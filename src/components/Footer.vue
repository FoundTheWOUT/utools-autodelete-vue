<template>
  <div>
    <button
      id="cleanup"
      class="rounded-lg p-2 bg-red-500 outline-none focus:outline-none hover:bg-red-700 transform hover:shadow-xl hover:scale-110 transition-all"
      @click="cleanup"
      @mouseenter="mountPopper"
      @mouseleave="hover = false"
      ref="cleanBtn"
    >
      <p class="flex items-center text-white font-bold">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
        清空目录
      </p>
    </button>
    <transition name="slide-fade">
      <div
        v-show="hover"
        ref="popper"
        class="bg-gray-100 p-4 rounded-lg shadow-lg"
      >
        <div class="text-xl font-bold text-red-600">注意</div>
        按下后当前账号对应目录下<b>所有文件</b>将被清空，请确保需要文件已自行保存
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { EventBus } from "../event-bus";
import { createPopper } from "@popperjs/core";

export default Vue.extend({
  data() {
    return {
      hover: false,
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

    cleanup() {
      console.warn("clean up.");
      EventBus.$emit("clean-up");
    },
  },
});
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.3s ease;
}
.slide-fade-enter,
.slide-fade-leave-to {
  opacity: 0;
}
</style>

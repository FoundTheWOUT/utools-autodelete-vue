<template>
  <div>
    <button
      id="cleanup"
      class="rounded-lg p-2 bg-red-500 hover:bg-red-700 focus:outline-none"
      @click="cleanup"
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
    <div target="cleanup" triggers="hover" placement="top">
      <div>注意</div>
      按下后当前账号对应目录下<b>所有文件</b>将被清空，请确保需要文件已经自行保存
    </div>
  </div>
</template>

<script lang="ts">
import { EventBus } from "../event-bus";
export default {
  methods: {
    cleanup(): void {
      console.warn("clean up.");
      EventBus.$emit("clean-up");
    },
  },
};
</script>

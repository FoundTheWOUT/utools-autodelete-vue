<template>
  <div class="border-4 rounded-lg w-full p-4">
    <div
      class="flex items-center rounded-lg my-3 py-3 border border-dashed border-indigo-200 hover:border-transparent hover:shadow-md hover:shadow-lg hover:bg-gray-100"
      v-for="item in list"
      :key="item.path"
    >
      <div class="w-1/12 flex items-center mx-3">
        <input
          class="appearance-none h-5 w-5 border border-gray-300 rounded-md checked:bg-blue-500  checked:border-transparent focus:outline-none"
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
    <div class="text-gray-400">点击可打开目录</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { EventBus } from "../event-bus";

export default Vue.extend({
  props: { list: Array },
  methods: {
    openFloder(target: string): void {
      window.utools.shellOpenPath(target);
    },
    handleCheckbox(): void {
      EventBus.$emit("check-box-change");
    },
  },
});
</script>

<template>
  <div>
    <button id="cleanup" variant="danger" @click="cleanup">
      <!-- <b-icon icon="exclamation-circle-fill" variant="warning"></b-icon> -->
      清空目录
    </button>
    <div target="cleanup" triggers="hover" placement="top">
      <template>注意</template>
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

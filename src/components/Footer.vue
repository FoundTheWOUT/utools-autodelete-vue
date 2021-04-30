<template>
  <div class="mb-4">
    <button
      id="cleanup"
      class="rounded-lg p-2 bg-red-500 outline-none focus:outline-none active:shadow-none active:scale-105 hover:bg-red-700 transform hover:scale-110 hover:shadow-xl transition-all"
      @click="cleanup"
      @mouseenter="mountPopper"
      @mouseleave="hover = false"
      ref="cleanBtn"
    >
      <p class="flex items-center text-white font-bold">
        <icon class="h-5 w-5" iconName="Warn"></icon>
        清空目录
      </p>
    </button>
    <transition name="slide-fade">
      <Card v-show="hover" titleCenter ref="popper" id="popper">
        <template #title>
          <div class="text-red-500">注意</div>
        </template>
        <div>
          按下后当前账号对应目录下<b>所有文件</b>将被清空，请确保需要文件已自行保存
        </div>
      </Card>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { createPopper } from "@popperjs/core";
import { action, mutations } from "../store";
import Card from "./Card.vue";

export default Vue.extend({
  components: { Card },
  data() {
    return {
      hover: false,
    };
  },
  methods: {
    mountPopper() {
      this.hover = true;
      const popper = (this.$refs.popper as any).$el as HTMLElement;
      createPopper(this.$refs.cleanBtn as HTMLElement, popper, {
        placement: "top",
        modifiers: [{ name: "offset", options: { offset: [0, 10] } }],
      });
    },

    cleanup() {
      console.warn("clean up.");
      this.$store.commit(mutations.SET_GLOBALMASK, true);
      if (window.exports?.cleanUpSubItem) {
        window.exports.cleanUpSubItem(
          this.$store.getters.selectedWaitingFolderList,
          () => {
            setTimeout(() => {
              this.$store.commit(mutations.SET_GLOBALMASK, false);
              this.$store.dispatch(action.GET_SET_FILE_SIZE);
            }, 500);
          }
        );
      } else {
        setTimeout(
          () => this.$store.commit(mutations.SET_GLOBALMASK, false),
          500
        );
        console.log("no method");
      }
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

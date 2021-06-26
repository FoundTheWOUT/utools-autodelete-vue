<template>
  <div style="z-index: 999" ref="popper">
    <transition name="slide-fade">
      <div v-show="show">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script>
import Vue from "vue";
import { createPopper } from "@popperjs/core";

export default Vue.extend({
  name: "Popper",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    target: {
      type: HTMLElement,
      default: undefined,
      require: true,
    },
    placement: {
      type: String,
      default: "top",
    },
  },
  watch: {
    show(val) {
      if (val) {
        createPopper(this.target, this.$refs.popper, {
          placement: this.placement,
          modifiers: [{ name: "offset", options: { offset: [0, 10] } }],
        });
      }
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

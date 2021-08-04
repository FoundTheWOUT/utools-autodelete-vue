<template>
  <div
    style="z-index: 999"
    ref="popper"
    @mouseenter="handelMouseenter"
    @mouseleave="handelMouseleave"
  >
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
      type: [HTMLElement, Array],
      default: undefined,
      require: true,
    },
    placement: {
      type: String,
      default: "top",
    },
    // 是否有点击其它地方退出当前popper
    autohide: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      timeout: 0,
    };
  },
  watch: {
    show(val) {
      if (val) {
        let _target;

        Array.isArray(this.target)
          ? (_target = this.target[0])
          : (_target = this.target);
        if (this.autohide) {
          _target.onmouseleave = this.handelMouseleave;
        }
        createPopper(_target, this.$refs.popper, {
          placement: this.placement,
          modifiers: [{ name: "offset", options: { offset: [0, 10] } }],
        });
      }
    },
  },
  methods: {
    handelMouseenter() {
      clearTimeout(this.timeout);
    },
    handelMouseleave() {
      if (!this.autohide) return;
      this.timeout = setTimeout(() => {
        this.$emit("update:show", false);
      }, 100);
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

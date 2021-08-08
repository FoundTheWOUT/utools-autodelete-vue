<template>
  <transition name="dialog">
    <div
      v-show="value"
      class="flex justify-center items-center fixed z-50 w-full h-full inset-0 bg-gray-500 bg-opacity-80"
      @click.self="$emit('close')"
    >
      <div class="dialog__body">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    value: Boolean,
    center: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.dialog-enter-active,
.dialog-leave-active {
  transition: all 0.3s ease;
}
.dialog-enter,
.dialog-leave-to {
  opacity: 0;
}
.dialog-enter-active .dialog__body {
  animation: scale 0.3s;
}
.dialog-leave-active .dialog__body {
  animation: scale 0.3s;
  animation-direction: reverse;
}
@keyframes scale {
  0% {
    transform: scale(0.7);
  }
  50% {
    transform: scale(1.03);
  }
  100% {
    transform: scale(1);
  }
}
</style>

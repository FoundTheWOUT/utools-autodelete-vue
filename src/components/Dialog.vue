<template>
  <transition name="fade">
    <div
      v-show="value"
      class="flex justify-center items-center fixed z-50 w-full h-full inset-0 bg-gray-500 bg-opacity-80"
    >
      <transition name="scale">
        <div v-show="value">
          <slot></slot>
        </div>
      </transition>
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
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s ease;
}
.scale-enter,
.scale-leave-to {
  transform: scale(0.7);
}
</style>

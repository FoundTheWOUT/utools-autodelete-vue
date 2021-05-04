<template>
  <div class="bg-gray-100 dark:bg-gray-700 p-5 rounded-lg shadow-lg">
    <div
      class="flex text-xl font-bold"
      :class="titleCenter ? 'justify-center' : ''"
    >
      <slot name="title"></slot>
    </div>
    <div class="dark:text-white">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    titleCenter: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style></style>

<template>
  <div class="card-box p-5 w-full">
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

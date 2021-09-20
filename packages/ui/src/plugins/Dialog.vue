<template>
  <transition name="dialog">
    <div
      v-show="value"
      :id="dialogId"
      class="flex justify-center items-center fixed z-50 w-full h-full inset-0 bg-gray-500 bg-opacity-80"
      @click.self="$emit('close')"
    >
      <div class="dialog__body max-w-4/5">
        <div v-if="content" class="bg-white p-4 rounded-md w-64">
          <div class="flex">
            <div
              class="ml-auto rounded-full cursor-pointer hover:bg-gray-300"
              @click="close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <span>
            {{ content }}
          </span>
        </div>
        <div v-else>
          <slot></slot>
        </div>
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
    content: {
      type: String,
      default: "",
    },
  },
  computed: {
    dialogId({ content }) {
      return `dialog_${content}`;
    },
  },
  methods: {
    close() {
      document.getElementById(this.dialogId)?.remove();
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

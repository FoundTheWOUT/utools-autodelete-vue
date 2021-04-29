<template>
  <div id="app">
    <div
      id="global-mask"
      class="flex flex-col justify-center items-center absolute z-50 w-full h-full bg-gray-300 opacity-70"
      v-if="globalMask"
    >
      <svg
        class="animate-spin h-10 w-10 text-red-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <p class="animate-flow m-3 text-2xl font-bold">清理中</p>
    </div>
    <div class="h-full">
      <SelectApp />
      <Footer class="mx-4" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SelectApp from "@/components/SelectApp.vue";
import Footer from "@/components/Footer.vue";
import { action } from "./store";

export default Vue.extend({
  name: "App",
  components: {
    SelectApp,
    Footer,
  },
  computed: {
    globalMask() {
      return this.$store.state.globalMask;
    },
  },
  async created() {
    await this.$store.dispatch(action.SET_ACCOUNTS, "WeChat");
    this.$store.dispatch(action.GET_SET_FILE_SIZE);
  },
});
</script>

<style>
html,
body {
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
  height: 100%;
}
</style>

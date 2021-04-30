<template>
  <div id="app">
    <div
      id="global-mask"
      class="flex flex-col justify-center items-center absolute z-50 w-full h-full bg-gray-300 opacity-70"
      v-if="globalMask"
    >
      <icon class="animate-spin h-10 w-10 text-red-500" iconName="Load"></icon>
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

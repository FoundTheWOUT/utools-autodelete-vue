<template>
  <div id="app" :class="isDark ? 'dark' : ''">
    <div class="h-full dark:bg-gray-900">
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
    isDark: () => (window?.utools ? utools.isDarkColors() : undefined),
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
  overflow: hidden;
  height: 100vh;
  scrollbar-width: thin;
}
*::-webkit-scrollbar {
  width: 5px;
}
*::-webkit-scrollbar-thumb {
  background-color: gray;
  border-radius: 20px;
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

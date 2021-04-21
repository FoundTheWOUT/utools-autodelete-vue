<template>
  <div id="app">
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

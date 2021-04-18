<template>
  <div id="app">
    <div id="mainCard">
      <SelectApp ref="selectapp" />
      <Footer class="mx-4" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SelectApp from "@/components/SelectApp.vue";
import Footer from "@/components/Footer.vue";

export default Vue.extend({
  name: "App",
  components: {
    SelectApp,
    Footer,
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
#mainCard {
  height: 100%;
}
</style>

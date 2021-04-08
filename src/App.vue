<template>
  <div id="app">
    <b-card id="mainCard">
      <b-card-body><SelectApp /></b-card-body>
      <b-card-body><Footer /></b-card-body>
    </b-card>
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

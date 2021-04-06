<template>
  <div id="app">
    <b-card id="mainCard">
      <b-card-body><SelectApp ref="SelectApp"/></b-card-body>
      <b-card-body><Footer @cleanUp="cleanUpFloder"/></b-card-body>
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
  methods: {
    cleanUpFloder: function() {
      (this.$refs.SelectApp as Vue & { Clean: () => void }).Clean();
    },
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

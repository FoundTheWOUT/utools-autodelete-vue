<template>
  <div id="app">
    <b-card id="mainCard">
      <b-card-body><SelectApp /></b-card-body>
      <b-card-body><WeChat ref="WeChat"/></b-card-body>
      <b-card-body><Footer @cleanUp="cleanUpFloder"/></b-card-body>
    </b-card>
  </div>
</template>

<script>
import SelectApp from "./components/SelectApp";
import WeChat from "./components/WeChat";
import Footer from "./components/Footer";

export default {
  name: "App",
  components: {
    SelectApp,
    WeChat,
    Footer,
  },
  methods: {
    cleanUpFloder: function() {
      window.exports.cleanUpSubItem(this.$refs.WeChat.ListIs);
    },
  },
};
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

import Vue from "vue";
import App from "./App.vue";
import "./assets/tailwind.css";

Vue.config.productionTip = false;

if (process.env.NODE_ENV === "production") {
  window.utools.onPluginReady(() => {
    // window.exports.getWeChatFile();
    new Vue({
      render: h => h(App),
    }).$mount("#app");
    window.utools.onPluginEnter((code: any) => {
      console.log("进入插件", code);
    });
  });
} else {
  new Vue({
    render: h => h(App),
  }).$mount("#app");
}

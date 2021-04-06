import Vue from "vue";
import App from "./App.vue";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.config.productionTip = false;

// Install BootstrapVue
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);

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

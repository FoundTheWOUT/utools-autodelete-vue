import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import { autoDeleteVuePlugin } from "./plugins/install";

import "./assets/tailwind.css";
import { Dialog } from "./plugins/Dialog";

Vue.config.productionTip = false;

Vue.use(autoDeleteVuePlugin);
window.Dialog = Dialog;

if (process.env.NODE_ENV === "production") {
  utools.onPluginReady(() => {
    new Vue({
      store,
      render: (h) => h(App),
    }).$mount("#app");
    utools.onPluginEnter((code) => {
      console.log("进入插件", code);
    });
  });
} else {
  new Vue({
    store,
    render: (h) => h(App),
  }).$mount("#app");
}

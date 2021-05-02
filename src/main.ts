import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import { autoDelete } from "./plugins/install";

import "./assets/tailwind.css";

Vue.config.productionTip = false;

Vue.use(autoDelete);

if (process.env.NODE_ENV === "production") {
  window.utools.onPluginReady(() => {
    // window.api.getWeChatFile();
    new Vue({
      store,
      render: (h) => h(App),
    }).$mount("#app");
    window.utools.onPluginEnter((code: any) => {
      console.log("进入插件", code);
    });
  });
} else {
  new Vue({
    store,
    render: (h) => h(App),
  }).$mount("#app");
}

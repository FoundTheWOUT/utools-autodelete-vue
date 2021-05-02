import { PluginObject } from "vue";
import * as components from "./index";

export const autoDelete: PluginObject<any> = {
  install: (Vue) => {
    (function registerComponents(components: any) {
      for (const key in components) {
        Vue.component(key, components[key]);
      }
    })(components);
  },
};

import Vue from "vue";
import DialogVue from "./Dialog.vue";

const DialogExtended = Vue.extend(DialogVue);

export const Dialog = (options: any) => {
  document.getElementById("dialog")?.remove();
  const instance = new DialogExtended({
    el: document.createElement("div"),
    components: `123`,
    propsData: {
      value: true,
    },
    ...options,
  });
  document.body.appendChild(instance.$el);
  return instance;
};

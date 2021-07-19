import { ComponentOptions, CreateElement, VNode } from "vue";

const Dialog: ComponentOptions<any> = {
  name: "dialog",
  render(h: CreateElement): VNode {
    return h("div", {
      class:
        "flex justify-center items-center absolute z-50 w-full h-full bg-gray-500 bg-opacity-80",
      slot: "button",
      scopedSlots: {
        default: () => {
          return h("div", {}, "hi");
        },
        button: () => {
          return h("div", {
            class: "warn-button",
          });
        },
      },
    });
  },
};

export default Dialog;

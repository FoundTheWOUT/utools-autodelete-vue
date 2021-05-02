import { CreateElement, VNode, VueConstructor } from "vue";
import Load from "./icon/load.vue";
import Warn from "./icon/warn.vue";

// options
const Icon: any = {
  name: "icon",
  props: {
    iconName: String,
  },
  components: {
    Load,
    Warn,
  },
  render(h: CreateElement): VNode {
    return h(this.iconName);
  },
};

export { Icon };
export default Icon;

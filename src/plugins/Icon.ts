import { CreateElement, VNode, VueConstructor } from "vue";
import Load from "./icon/load.vue";
import Warn from "./icon/warn.vue";

// constructor
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

Icon.install = (Vue: VueConstructor) => {
  Vue.component(Icon.name, Icon);
};

export { Icon };
export default Icon;

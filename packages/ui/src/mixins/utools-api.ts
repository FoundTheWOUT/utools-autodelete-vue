import Vue, { ComponentOptions } from "vue";

const api: ComponentOptions<Vue> = {
  methods: {
    // TODO: mac os open messageTemp
    openFolder(target: string[]) {
      target.length === 1
        ? window.utools.shellOpenPath(target[0])
        : window.utools.shellOpenPath(this.$store.getters.curAccount.rootPath);
    },
  },
};

export default api;

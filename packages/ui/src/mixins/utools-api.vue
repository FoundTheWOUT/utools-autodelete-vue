<script lang="ts">
export default {
  methods: {
    // TODO: mac os open messageTemp
    openFolder(target: string | string[]): void {
      if (Array.isArray(target)) {
        window.utools.shellOpenPath(this.$store.getters.curAccount.rootPath);
      } else {
        window.utools.shellOpenPath(target);
      }
    },
  },
};
</script>

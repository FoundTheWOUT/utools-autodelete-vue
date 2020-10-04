<template>
  <b-container>
    <b-btn id="cleanup" variant="danger" @click="cleanup">
      <b-icon icon="exclamation-circle-fill" variant="warning"></b-icon>
      清空目录
    </b-btn>
    <b-popover target="cleanup" triggers="hover" placement="top">
      <template v-slot:title>注意</template>
      按下后当前账号对应目录下<b>所有文件</b>将被清空，请确保需要文件已经自行保存
    </b-popover>
  </b-container>
</template>

<script>
export default {
  methods: {
    cleanup: function() {
      console.log("cleaning");
      this.$emit("cleanUp");
    },
  },
};
</script>

<style scoped></style>

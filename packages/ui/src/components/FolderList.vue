<template>
  <div class="border-4 rounded-lg w-full p-4 dark:border-gray-500">
    <FolderListItem
      v-for="item in waitingFolderList"
      :key="item.name"
      :data="item"
    />
    <div class="flex justify-between items-center">
      <button class="safe-btn w-2/12" @click="openFolder([])">
        <p class="text-white font-bold">打开账号</p>
      </button>
      <div class="text-gray-400">点击对应条目可打开目录</div>
      <button
        class="warn-btn w-2/12"
        @click="showDialog = true"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
        ref="removeAccountBtn"
      >
        <p class="text-white font-bold">删除账号</p>
      </button>
    </div>
    <Dialog v-model="showDialog" @close="closePanel">
      <Card title-center>
        <template #title>
          <div class="text-red-500">你确定删除账号吗</div>
        </template>
        <p class="m-3">
          按下确定后该账号文件夹将会被直接移除，且移除过程不可逆
        </p>
        <button class="mx-2 warn-btn text-white font-bold" @click="sureRemove">
          确定
        </button>
        <button class="mx-2 safe-btn text-white font-bold" @click="closePanel">
          取消
        </button>
      </Card>
    </Dialog>
    <Popper :show.sync="hover" :target="$refs.removeAccountBtn">
      <Card title-center>
        <template #title>
          <div class="text-red-500">删除当前账号</div>
        </template>
        <p>按下后会询问你是否确认删除账号</p>
      </Card>
    </Popper>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { action } from "../store";
import Card from "./Card.vue";
import Dialog from "./Dialog.vue";
import { mapGetters } from "vuex";
import FolderListItem from "./FolderListItem.vue";
import utoolsApiMixin from "@/mixins/utools-api";

export default Vue.extend({
  components: { Card, Dialog, FolderListItem },
  data() {
    return {
      hover: false,
      showDialog: false,
    };
  },
  mixins: [utoolsApiMixin],
  computed: {
    ...mapGetters(["waitingFolderList"]),
  },
  methods: {
    sureRemove(): void {
      this.closePanel();
      this.$store.dispatch(action.REMOVE_ACCOUNT).then(() => {
        this.$emit("change-active-account");
      });
    },
    closePanel(): void {
      this.showDialog = false;
    },
  },
});
</script>

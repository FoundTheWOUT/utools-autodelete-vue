<template>
  <div class="mb-4">
    <Dialog v-model="showDialog">
      <Card :title-center="true" class="max-h-[80%]">
        <template #title>
          <span class="dark:text-white text-lg font-semibold"
            >即将清理列表</span
          >
        </template>
        <div v-if="isCleaning" class="flex flex-col items-center">
          <icon class="animate-spin h-10 w-10 text-red-500" icon-name="Load" />
          <p class="animate-flow m-3 text-2xl font-bold">清理中</p>
        </div>
        <div v-else>
          <div class="max-h-96 overflow-auto">
            <div
              v-for="path in selectedWaitingFolderList"
              :key="path"
              class="break-all"
            >
              {{ path }}
            </div>
          </div>
          <div class="flex mt-4">
            <button
              class="mx-2 flex-1 safe-btn text-white"
              @click="showDialog = false"
            >
              取消
            </button>
            <button class="mx-2 flex-1 warn-btn text-white" @click="cleanup">
              确定
            </button>
          </div>
        </div>
      </Card>
    </Dialog>
    <button
      id="cleanup"
      class="warn-btn"
      @click="showDialog = true"
      @mouseenter="hover = true"
      ref="cleanBtn"
    >
      <p class="flex items-center text-white font-bold">
        <icon class="h-5 w-5" icon-name="Warn"></icon>
        清空目录
      </p>
    </button>
    <Popper :show.sync="hover" :target="$refs.cleanBtn" autohide>
      <Card title-center> 按下查看清理目录 </Card>
    </Popper>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import { action } from "../store";
import Card from "./Card.vue";

export default Vue.extend({
  components: { Card },
  data() {
    return {
      hover: false,
      showDialog: false,
      isCleaning: false,
    };
  },
  computed: {
    ...mapGetters(["selectedWaitingFolderList"]),
  },
  methods: {
    async cleanup() {
      console.warn("clean up.");
      this.isCleaning = true;
      await this.$store.dispatch(action.CLEAR_FILES);
      setTimeout(() => {
        this.isCleaning = false;
        this.showDialog = false;
        this.$store.dispatch(action.GET_SET_FILE_SIZE);
      }, 500);
    },
  },
});
</script>

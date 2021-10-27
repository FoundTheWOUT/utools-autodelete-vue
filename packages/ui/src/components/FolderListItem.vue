<template>
  <div
    class="flex items-center rounded-lg my-3 py-3 border border-dashed border-indigo-200 hover:border-transparent hover:shadow-lg hover:bg-gray-100 transition-all dark:hover:bg-gray-500 dark:hover:shadow-white dark:active:shadow-none"
  >
    <div class="w-1/12 flex items-center mx-3">
      <input
        class="form-tick appearance-none h-5 w-5 border border-gray-300 rounded-md checked:bg-blue-500 checked:border-transparent focus:outline-none"
        type="checkbox"
        v-model="data.status"
        @change="handleCheckbox"
      />
    </div>
    <button
      class="h-auto flex-1 px-3 focus:outline-none"
      @click="openFolder(paths)"
    >
      <div class="break-words dark:text-white">{{ name }}</div>
    </button>
    <div
      class="mx-2 text-sm text-gray-500 hover:border-b hover:text-gray-300 border-gray-300 select-none cursor-pointer"
      @click="hoverDetail = !hoverDetail"
      ref="detail"
    >
      详细信息
    </div>
    <Popper
      :show.sync="hoverDetail"
      :target="$refs.detail"
      placement="left"
      autohide
    >
      <Card title-center>
        <template #title>
          <span class="dark:text-white text-lg font-semibold"
            >即将清理列表</span
          >
        </template>
        <div class="max-h-80 w-96 overflow-y-scroll">
          <div class="break-all" v-for="path in paths" :key="path">
            {{ path }}
          </div>
        </div>
      </Card>
    </Popper>
  </div>
</template>

<script>
import Vue from "vue";
import { debounce } from "lodash";
import { action } from "@/store";
import Card from "./Card.vue";
import utoolsApiMixin from "@/mixins/utools-api";

export default Vue.extend({
  components: { Card },
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  mixins: [utoolsApiMixin],
  data() {
    return {
      hoverDetail: false,
    };
  },
  computed: {
    paths() {
      return this.data.path ?? "";
    },
    name() {
      return this.data.name ?? "";
    },
  },
  created() {
    this.handleCheckbox = debounce(this.handleCheckbox, 800);
  },
  methods: {
    handleCheckbox() {
      this.$store.dispatch(action.GET_SET_FILE_SIZE);
    },
  },
});
</script>

<style scoped>
.form-tick:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
}
</style>

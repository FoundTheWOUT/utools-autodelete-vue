<template>
  <div
    class="flex items-center rounded-lg my-3 py-3 border border-dashed border-indigo-200 hover:border-transparent hover:shadow-lg hover:bg-gray-100 transition-all dark:hover:bg-gray-500 dark:hover:shadow-white dark:active:shadow-none"
  >
    <div class="w-1/12 flex items-center mx-3">
      <input
        class="appearance-none h-5 w-5 border border-gray-300 rounded-md checked:bg-blue-500 checked:border-transparent focus:outline-none"
        type="checkbox"
        v-model="status"
        @click="handleCheckbox"
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
      closeable
      @close="hoverDetail = false"
    >
      <Card>
        <div class="w-96 flex flex-col">
          <div class="mr-auto text-lg font-semibold">即将清理列表</div>
          <div class="max-h-80 overflow-y-scroll">
            <div class="break-all" v-for="path in paths" :key="path">
              {{ path }}
            </div>
          </div>
        </div>
      </Card>
    </Popper>
  </div>
</template>

<script>
import Vue from "vue";
import * as _ from "lodash";
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
    status() {
      return this.data.status ?? false;
    },
    paths() {
      return this.data.path ?? "";
    },
    name() {
      return this.data.name ?? "";
    },
  },
  created() {
    this.handleCheckbox = _.debounce(this.handleCheckbox, 800);
  },
  methods: {
    handleCheckbox() {
      this.$store.dispatch(action.GET_SET_FILE_SIZE);
    },
  },
});
</script>

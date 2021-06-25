<template>
  <div class="w-4/5 m-auto">
    <div class="flex justify-center">
      <button
        class="w-40 rounded-full m-4 p-2 bg-gray-500 hover:bg-gray-700 outline-none focus:outline-none transform active:scale-90 transition-all"
        :class="curApp === app.indexOf(item) ? 'bg-gray-700' : ''"
        v-for="item in app"
        :key="item"
        @click="handleSwitchApp(item)"
      >
        <p class="text-lg text-white font-bold">
          {{ item }}
        </p>
      </button>
    </div>
    <AppCard />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import AppCard from "./AppCard.vue";
import { action } from "../store";

export default Vue.extend({
  computed: {
    curApp() {
      return this.$store.state.curApp;
    },
    app() {
      return this.$store.state.app;
    },
  },
  components: {
    AppCard,
  },
  methods: {
    async handleSwitchApp(app: string) {
      await this.$store.dispatch(action.SET_ACCOUNTS, app);
      this.$store.dispatch(action.GET_SET_FILE_SIZE);
    },
  },
});
</script>

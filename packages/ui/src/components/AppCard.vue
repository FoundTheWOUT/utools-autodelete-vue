<template>
  <div class="flex flex-row justify-center">
    <div class="max-w-xxs flex flex-col mx-2">
      <button
        class="account-btn"
        v-for="(account, index) in accounts"
        :class="index === activeAccountID ? 'bg-blue-500' : ''"
        :key="account.username"
        @click="handelChangeAccount(index)"
        @click.right.prevent="rightClick(index)"
        :ref="'accountUsername' + index"
      >
        <p
          class="truncate font-bold dark:text-white"
          :class="index === activeAccountID ? 'text-white' : ''"
        >
          {{ account.username }}
        </p>
      </button>
      <button class="account-btn" @click="addAccount">
        <p class="dark:text-white">添加账号</p>
      </button>
    </div>
    <Popper
      :show.sync="popperShow"
      :target="$refs[popperRef]"
      placement="right"
      autohide
    >
      <div class="card-box p-2 flex">
        <button
          class="safe-btn text-white"
          @click="removeAccountFromList(popperSelected)"
        >
          从列表中移除
        </button>
      </div>
    </Popper>
    <div class="flex flex-col w-full flex-shrink-0">
      <FolderList @change-active-account="mutateAccountID" />
      <div class="flex ml-auto px-3 pt-2 text-gray-400">
        <div class="mx-1">文件大小：</div>
        <icon
          v-if="pending"
          class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-300"
          icon-name="Load"
        ></icon>
        <div v-if="!pending">{{ folderSize }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import FolderList from "./FolderList.vue";
import { mutations, action } from "../store";
import { mapGetters, mapState } from "vuex";
// import Card from "./Card.vue";

export default Vue.extend({
  components: {
    FolderList,
    // Card,
  },
  data() {
    return {
      popperShow: false,
      popperSelected: -1,
      popperRef: "",
      timeout: 0,
    };
  },
  computed: {
    ...mapState(["accounts", "activeAccountID", "folderSize", "pending"]),
    ...mapGetters(["curAppName"]),
  },
  methods: {
    handelChangeAccount(index: number): void {
      this.$store.commit(mutations.SET_ACCOUNT_ID, index);
      this.$store.dispatch(action.GET_SET_FILE_SIZE);
    },
    mutateAccountID() {
      if (this.activeAccountID === 0) return;
      this.handelChangeAccount(--this.activeAccountID);
    },
    addAccount() {
      const a = utools.showOpenDialog({ properties: ["openDirectory"] });
      if (a) {
        window.autoDelete.saveOwnConfig(
          { [this.curAppName]: { accountPaths: [a[0]] } },
          this.curAppName
        );
        this.$store.dispatch(action.SET_ACCOUNTS, this.curAppName);
      }
    },
    removeAccountFromList(target: number) {
      window.autoDelete.removeAccountFromList(
        this.curAppName,
        this.accounts[target]
      );
      this.$store.dispatch(action.SET_ACCOUNTS, this.curAppName);
    },
    rightClick(target: number) {
      this.popperShow = !this.popperShow;
      this.popperSelected = target;
      this.popperRef = "accountUsername" + target;
    },
  },
});
</script>

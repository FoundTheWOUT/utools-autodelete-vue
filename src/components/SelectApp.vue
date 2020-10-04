<template>
  <div>
    <b-row>
      <b-col
        ><b-button
          pill
          :pressed="btn[0].state"
          @click="routeToWeChact"
          size="lg"
          >{{ btn[0].app }}</b-button
        ></b-col
      >
      <b-col><b-button pill size="lg" disabled>QQ</b-button></b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      btn: [
        { app: "微信", state: true },
        { app: "QQ", state: false },
      ],
    };
  },
  methods: {
    routeToWeChact: function() {
      // window.utools.showNotification('hi')
      // window.utools.ubrowser.goto('https://www.baidu.com').show()
      if (this.btn[0].state) {
        return;
      }
      //route to wechate
      this.btn[0].state = true;
    },
  },
};
</script>

<style scoped>
/* .Appbtn{

} */
</style>

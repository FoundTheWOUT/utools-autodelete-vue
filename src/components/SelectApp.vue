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
      <b-col
        ><b-button pill :pressed="btn[1].state" size="lg" @click="routeToQQ"
          >QQ</b-button
        ></b-col
      >
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
      if (this.btn[0].state) {
        return;
      }
      //route to wechate
      this.btn[0].state = true;
    },
    routeToQQ: function() {
      console.log("hi");
      this.btn[1].state = true;
    },
  },
};
</script>

<style scoped>
/* .Appbtn{

} */
</style>

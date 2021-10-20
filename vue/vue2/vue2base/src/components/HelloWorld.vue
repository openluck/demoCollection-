<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-10-13 16:20:53
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-20 13:19:14
-->
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  async mounted() {
    let a = await this.getRobotImg("https://robohash.org/1");
    console.log('a',a);
  },
  methods: {
    getRobotImg(url) {
      console.log(111);
      // https://robohash.org/${id}
      return new Promise((resolve) => {
        this.$api.get(url).then((res) => {
          resolve(res);
        });
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

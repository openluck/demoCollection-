<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-10-13 16:20:53
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-18 11:01:54
-->
<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
    <BaseInput v-model="something"></BaseInput>
  </div>
</template>

<script>
// import HelloWorld from "./components/HelloWorld.vue";
import BaseInput from "./components/v-modelltest/baseInput.vue";

export default {
  name: "App",
  components: {
    // HelloWorld,
    BaseInput,
  },
  data() {
    return {
      something: "something",
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

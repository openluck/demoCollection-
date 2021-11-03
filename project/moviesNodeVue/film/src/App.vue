<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-05-13 13:12:21
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-05-13 15:34:56
-->
<template>
  <div id="app">
    <router-view />
    <tab-bar v-if="$route.meta.showTabBar" />
  </div>
</template>

<script>
import TabBar from "./components/TabBar/TabBar";
import "mint-ui/lib/style.css";
export default {
  name: "App",
  components: { TabBar },
};
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
#app {
  width: 100%;
  height: 100%;
}
</style>

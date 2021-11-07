<!--
 * @Desc: 
 * @Version: v1.00
 * @Author: went
 * @Date: 2021-06-18 13:08:49
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-06-25 13:29:16
-->
<template>
  <div id="app" class="app">
    <a-config-provider :locale="zhCN">
      <transition name="component-fade" mode="out-in">
        <router-view />
      </transition>
    </a-config-provider>
  </div>
</template>
<script>
import zhCN from "ant-design-vue/es/locale/zh_CN";
import Vue from "vue";

import { ConfigProvider, message } from "ant-design-vue";
Vue.use(ConfigProvider);
message.config({
  duration: 2,
  maxCount: 2,
});
export default {
  name: "App",
  data() {
    return {
      zhCN,
    };
  },
  mounted() {},
  methods: {},
};
</script>
<style lang="less"  src="./assets/css/baseLess.less" >
// @import "~ant-design-vue/dist/antd.less";
// @import "./assets/css/baseLess.less";
// #app {
//   touch-action: none;
// }

</style>

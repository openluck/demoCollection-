<!--
 * @Desc: 
 * @Version: v1.00
 * @Author: went
 * @Date: 2021-08-02 15:29:00
 * @LastEditors: went
 * @LastEditTime: 2021-09-09 16:24:44
-->
<template>
  <div
    id="app"
    class="app"
  >
    <a-config-provider :locale="zhCN">
      <transition
        name="component-fade"
        mode="out-in"
      >
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
  maxCount: 2
});
export default {
  name: "App",
  data() {
    return {
      zhCN
    };
  },
  watch: {
    $route() {
      sessionStorage.removeItem("showConflictPage");
    }
  },
  mounted() { },
  methods: {}
};
</script>
<style lang="less">
</style>

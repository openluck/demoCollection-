<!--
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-11-12 15:28:28
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-11-12 15:35:26
-->
<template>
  <div class="container">
    <a-spin size="larger" :tip="tip"> 这是init页面 </a-spin>
  </div>
</template>

<script>
export default {
  name: "Init",
  data() {
    return {};
  },
  create() {
    // 通过路由参数获取
    sessionStorage.setItem("token", this.$route.query.token);
    sessionStorage.setItem("orgCode", this.$route.query.orgCode);
    // sessionStorage.setItem("token", this.$route.query.token);
  },
  methdos: {
    // 初始化
    init() {
      
    }
  }
};
</script>

<style lang="" scoped>
</style>
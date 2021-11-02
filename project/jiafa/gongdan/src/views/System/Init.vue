<template>
  <div class="container">
    <a-spin size="large" :tip="tip">
      <div class="container"></div>
    </a-spin>
  </div>
</template>
<script>
import Vue from "vue";
// import axios from 'axios';
// import api from '@/http/api';
import { spin, message } from "ant-design-vue";
import { getQueryString, getRouterString } from "@/Utils/util";
Vue.use(spin);
Vue.prototype.$message = message;
export default {
  data() {
    return {
      loading: false,
      token: "",
      examid: "",
      tip: "加载中...",
      routerPush: ""
    };
  },
  created() {
    // 获取token
    sessionStorage.setItem("sjgdxgxt_token", getQueryString("token"));
    // 获取exId
    sessionStorage.setItem("exId", getQueryString("exId"));
    // 获取pure
    sessionStorage.setItem("pure", getQueryString("pure"));
    // 获取路由地址
    this.routerPush = getRouterString();
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      let res = await this.$api.user.checkToken({});
      if (res && res.code === "200") {
        // 获取用户信息，考试计划列表
        this.getInfo();
        // 跳转到指定页面
        let finallyRoute = this.routerPush ? this.routerPush : "/";
        this.$nextTick(() => {
          this.$router.push(finallyRoute);
        });
      }
    },
    async getInfo() {
      let res = await this.$api.user.getUserInfo({});
      if (res.code === "200") {
        sessionStorage.setItem("orgId", res.data.orgId);
        this.getExaminationList();
      }
    },
    async getExaminationList() {
      let resp = await this.$api.common.getExaminationList();
      if (resp.code === "200") {
        sessionStorage.setItem("exId", resp.data.list[0].exId);
        sessionStorage.setItem("exList", JSON.stringify(resp.data.list));
        this.$store.commit("changeExId", this.exId);
      }
    }
  }
};
</script>
<style scoped lang="less">
.container {
  width: 100%;
  height: 100vh;
}
</style>

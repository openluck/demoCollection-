<!--
 * @Descripttion: 分班
 * @version: v1.0
 * @Author: xutao
 * @Date: 2021-04-25 09:02:01
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-07-26 10:11:54
-->

<template>
  <div class="container">
    <a-spin size="large" :tip="tip">
      <div class="container"></div>
    </a-spin>
  </div>
</template>
<script>
import axios from "axios";
import Vue from "vue";
// import axios from 'axios';
// import api from '@/http/api';
import { spin, message } from "ant-design-vue";
import { getQueryString } from "@/Utils/util";

import store from "../../store";
import techerRouter from "../../router/teacher";
// import studentRouter from '../../router/student'
import adminRouter from "../../router/admin";
Vue.use(spin);
Vue.prototype.$message = message;
export default {
  data() {
    return {
      loading: false,
      token: "",
      examid: "",
      tip: "加载中...",
      routerPush: "",
      fenban_token: "",
      fenban_orgcode: ""
    };
  },
  created() {
    this.fenban_token = getQueryString("token");
    this.fenban_orgcode = getQueryString("orgcode");
    // 获取token
    sessionStorage.setItem("paike_token", getQueryString("token"));
    sessionStorage.setItem("paike_orgcode", getQueryString("orgcode"));
  },
  mounted() {
    // store.dispatch("add_Routes", adminRouter);
    // this.$router.push("/PermissionSetting");
    const initUrl = window.G.initUrl;
    axios
      .post(
        initUrl + "/p/SSOGetUserInfo",
        {
          Data: {
            OrgCode: this.fenban_orgcode,
            TokenID: this.fenban_token
          }
        },
        {
          headers: {
            AccessToken: this.fenban_token
          }
        }
      )
      .then(res => {
        if (res.data.result) {
          // res.data.data.personTypes = '1'
          sessionStorage.setItem("user", JSON.stringify(res.data.data));
          let user = JSON.parse(sessionStorage.getItem("user"));
          if (user.personTypes.includes("0")) {
            sessionStorage.setItem("role", "0");
          } else if (user.personTypes.includes("1")) {
            sessionStorage.setItem("role", "1");
          } else if (user.personTypes.includes("2")) {
            sessionStorage.setItem("role", "2");
          } else {
            sessionStorage.setItem("role", user.personTypes);
          }
          // if (sessionStorage.getItem('role') === '1') {
          this.getSysPermissions();
          // }
          // sessionStorage.setItem("role", user.personTypes);
          if (sessionStorage.getItem("role") === "1") {
            //老师
            store.dispatch("add_Routes", techerRouter);
            this.$router.push("/DivideArrangeLes");
          } else if (sessionStorage.getItem("role") === "0") {
            //管理员
            store.dispatch("add_Routes", adminRouter);
            this.$router.push("/DivideArrangeLes");
          } else {
            this.$router.push("/403");
          }
        } else {
          this.$message.error(res.message);
        }
      });
  },
  methods: {
    //鉴权
    async getSysPermissions() {
      let data = {
        sysType: 1
      };
      try {
        const res = await this.$api.permissionSetting.getSysPermissions(data);
        if (res.code === 200 || res.code === "200") {
          if (!res.data.state) {
            this.$router.push("/403");
          }
        } else {
          // this.$router.push('/403')
        }
      } catch (error) {
        // this.$message.error("请求失败！" + error);
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

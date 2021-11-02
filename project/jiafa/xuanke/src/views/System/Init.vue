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
import techerRouter from '../../router/teacher'
import studentRouter from '../../router/student'
import adminRouter from '../../router/admin'
Vue.use(spin);
Vue.prototype.$message = message;
const initUrl = window.g.initUrl
export default {
  data() {
    return {
      initUrl,
      loading: false,
      token: "",
      examid: "",
      tip: "加载中...",
      routerPush: "",
      xuanke_token: "",
      xuanke_orgcode: "",
    };
  },
  created() {
    this.xuanke_token = getQueryString("token");
    this.xuanke_orgcode = getQueryString("orgcode");
    console.log("orgcode", this.xuanke_orgcode);
    // 获取token
    sessionStorage.setItem("xuanke_token", getQueryString("token"));
    sessionStorage.setItem("xuanke_orgcode", getQueryString("orgcode"));
  },
  mounted() {
    axios
      .post(
        this.initUrl + "/p/SSOGetUserInfo",
        {
          Data: {
            OrgCode: this.xuanke_orgcode,
            TokenID: this.xuanke_token,
          },
        },
        {
          headers: {
            AccessToken: this.xuanke_token,
          },
        }
      )
      .then((res) => {
        if (res.data.result) {
          sessionStorage.setItem("user", JSON.stringify(res.data.data));
          let user = JSON.parse(sessionStorage.getItem("user"));
          if (user.personTypes.includes('0')) {
            sessionStorage.setItem("role", '0');
          } else if (user.personTypes.includes('1')) {
            sessionStorage.setItem("role", '1');
          } else if (user.personTypes.includes('2')) {
            sessionStorage.setItem("role", '2');
          } else {
            sessionStorage.setItem("role", user.personTypes);
          }
          if (sessionStorage.getItem("role") === '1') {
             this.getSysPermissions()
          }
          // sessionStorage.setItem("role", user.personTypes);
          if (sessionStorage.getItem("role") === "2") { //学生     
            store.dispatch("add_Routes", studentRouter);
             this.$router.push('/studentExam');
          } else if (sessionStorage.getItem("role") === "1") { //老师     
            store.dispatch("add_Routes", techerRouter);
            this.$router.push('/TeacherExam');
          } else if (sessionStorage.getItem("role") === "0") { //管理员
            store.dispatch("add_Routes", adminRouter);
            this.$router.push('/TeacherExam');
          } else {
             this.$router.push('/403')
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
      }
      try {
        const res = await this.$api.admin.getSysPermissions(data);
        console.log(res.data);
        if (res.code === 200) {
          if (!res.data.state) {
            // console.log(res.data)
            this.$router.push('/403')
          }
        } else {
          // this.$router.push('/403')
        }
      } catch (error) {
        // this.$message.error("请求失败！" + error);
      }
    },
  },
};
</script>
<style scoped lang="less">
.container {
  width: 100%;
  height: 100vh;
}
</style>

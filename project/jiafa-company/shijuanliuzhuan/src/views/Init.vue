<template>
  <div class="container">
    <a-spin size="large" :tip="tip">
      <div class="container"></div>
    </a-spin>
  </div>
</template>
<script>
import Vue from "vue";
import axios from "axios";
import api from "@/http/api";
import { spin, message } from "ant-design-vue";
Vue.use(spin);
Vue.prototype.$message = message;
export default {
  data() {
    return {
      loading: false,
      token: "",
      examid: "",
      tip: "加载中..."
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const token = sessionStorage.getItem("CToken");
      this.$api.init
        .getSystemConf()
        .then(res => {
          sessionStorage.setItem("systemConf", JSON.stringify(res.data));
          this.$api.init.checkToken({ token: token }).then(res => {
            if (res.result) {
              sessionStorage.setItem("userInfo", JSON.stringify(res.data));
              this.$router.push("/");
            } else {
              this.$message.error(res.message);
              this.tip = res.message;
            }
          });
        })
        .catch(err => {
          console.log("err ===" + err);
        });
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
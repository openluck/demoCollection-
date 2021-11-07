<!--
 * @Desc: 
 * @Version: v1.00
 * @Author: went
 * @Date: 2021-05-11 16:06:52
 * @LastEditors: went
 * @LastEditTime: 2021-07-13 14:41:51
-->
<template>
  <div class="errPage-container">
    <a-row :span="24">
      <h1 class="text-jumbo text-ginormous">Oops!</h1>
      <h2>你没有权限访问该页面，请联系管理员！</h2>
    </a-row>
    <a-col :span="24">
      <img :src="errGif" width="313" height="428" alt="Girl has dropped her ice cream." />
    </a-col>
  </div>
</template>

<script>
import errGif from "@/assets/img/401.gif";

export default {
  name: "Page401",
  data() {
    return {
      errGif: errGif + "?" + +new Date(),
      dialogVisible: false
    };
  },
  methods: {
    backback() {
      if (this.$route.query.noGoBack) {
        this.$router.go(-1);
      } else {
        this.$router.go(-1);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.errPage-container {
  text-align: center;
  padding-top: 100px;
  .pan-gif {
    text-align: center;
    display: inline-block;
  }
  .text-jumbo {
    font-size: 60px;
    font-weight: 700;
    color: #484848;
  }
  .list-unstyled {
    font-size: 14px;
    li {
      padding-bottom: 5px;
    }
    a {
      color: #008489;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>

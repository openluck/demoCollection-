/*
 * @Descripttion:
 * @version:
 * @Author: OpenLcuk
 * @Date: 2021-05-14 13:43:38
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-05-14 13:57:26
 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import axios from "axios";
import util from "./assets/js/util";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import echarts from "echarts";
// import { Message } from "ant-design-vue";

Vue.prototype.$echarts = echarts;
Vue.config.productionTip = false;
Vue.prototype.$http = axios;
Vue.prototype.$util = util;
// Vue.prototype.$message = Message;
Vue.use(Antd);

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>"
});

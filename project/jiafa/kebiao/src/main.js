/*
 * @Descripttion: 
 * @version: 
 * @Author: YanQY
 * @Date: 2021-08-27 09:13:09
 * @LastEditors: went
 * @LastEditTime: 2021-10-08 14:47:49
 */
import "babel-polyfill"
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import { registerApp } from "./register";
import { fliterTimestamp } from "./filters/index";
import "./icon";
import "./directives/loading";
// 路由重复点击问题
import Router from "vue-router";
import 'normalize.css/normalize.css'
import "@/assets/css/baseLess.less";
Vue.filter("fliterTimestamp", fliterTimestamp);

Vue.config.productionTip = false;

//全局注册
registerApp(Vue);
//处理$router.push跳转到相同路由报错
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount("#app");

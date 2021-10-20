/*
 * @Descripttion:
 * @version:
 * @Author: OpenLcuk
 * @Date: 2021-10-13 16:20:53
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-20 13:16:41
 */
import Vue from "vue";
import App from "./App.vue";
// 导入接口文件
// import api from "./http";
import axios from 'axios'

Vue.config.productionTip = false;
// Vue.use(axios);
Vue.prototype.$api = axios

new Vue({
  render: (h) => h(App),
}).$mount("#app");

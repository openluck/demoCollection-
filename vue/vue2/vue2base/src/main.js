/*
 * @Descripttion:
 * @version:
 * @Author: OpenLcuk
 * @Date: 2021-10-13 16:20:53
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-13 17:09:19
 */
import Vue from "vue";
import App from "./App.vue";
// 导入接口文件
import api from "./http";

Vue.config.productionTip = false;
Vue.use(api);

new Vue({
  render: (h) => h(App),
}).$mount("#app");

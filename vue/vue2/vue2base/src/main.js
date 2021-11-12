/*
 * @Descripttion:
 * @version:
 * @Author: OpenLcuk
 * @Date: 2021-10-13 16:20:53
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-11-12 17:07:57
 */
import Vue from "vue";
import App from "./App.vue";
import router from './router'
console.log('vue中的Vue-->', Vue);
Vue.config.productionTip = false;

import { registerApp } from './register'



registerApp(Vue)
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");

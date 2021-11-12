/*
 * @Descripttion:
 * @version:
 * @Author: OpenLcuk
 * @Date: 2021-10-14 09:34:14
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-11-12 13:14:21
 */
import VueRouter from "vue-router";
import Vue from "vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('../layouts/BasicLayout.vue')
  }
];

const router = new VueRouter({
  routes,
});

export default router;

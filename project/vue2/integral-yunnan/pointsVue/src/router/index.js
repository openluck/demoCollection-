/*
 * @Descripttion:
 * @version:
 * @Author: OpenLcuk
 * @Date: 2021-05-14 13:43:38
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-05-17 16:30:30
 */
import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/login",
      name: "Login",
      component: () => import("../components/login/Login"),
      meta: {
        title: "登录"
      }
    },
    {
      path: "/",
      name: "UserHome",
      redirect: "/login",
      component: () => import("../view/UserHome/UserHome.vue"),
      children: [
        {
          path: "/news",
          name: "News",
          component: () => import("../components/News/News.vue"),
          meta: {
            title: "新闻中心"
          }
        },
        {
          path: "/userinfo",
          name: "UserInfo",
          component: () => import("../components/UserInfo/UserInfo.vue"),
          meta: {
            title: "个人中心"
          }
        },
        {
          path: "/pointes",
          name: "Pointes",
          component: () => import("../components/Pointes/Pointes.vue"),
          meta: {
            title: "积分中心"
          }
        },
        {
          path: "/publish",
          name: "Publish",
          component: () => import("../components/Publish/Publish.vue"),
          meta: {
            title: "发布中心"
          }
        },
        {
          path: "/destails",
          name: "Destails",
          component: () => import("../components/Destails/Destails.vue"),
          meta: {
            title: "商品详情"
          }
        },
        {
          path: "/send",
          name: "Send",
          component: () => import("../components/Send/Send.vue"),
          meta: {
            title: "赠送"
          }
        }
      ]
    }
  ]
});

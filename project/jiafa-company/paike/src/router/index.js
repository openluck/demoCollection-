/*
 * @Descripttion:
 * @version: v1.0
 * @Author: wentan
 * @Date: 2021-03-30 17:00:38
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-08-17 14:57:55
 */
import Vue from "vue";
// import { Modal } from "ant-design-vue"
import VueRouter from "vue-router";
import NProgress from "nprogress";
import techerRouter from "@/router/teacher";
import adminRouter from "@/router/admin";
import store from "../store";
import "nprogress/nprogress.css";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () =>
      import(/* webpackChunkName: "user" */ "../layouts/BasicLayout.vue"),
    children: [],
  },
  {
    path: "/init",
    name: "登录",
    component: () =>
      import(/* webpackChunkName: "user" */ "../views/System/Init.vue"),
  },
  {
    path: "/SmartArrange/ArrangeOperation",
    name: "排课操作",
    meta: {
      title: "排课操作",
      icon: "lock",
      // isShow: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "layout" */ "../views/SmartArrLesson/ArrLesson/ArrangeOperation/ArrangeOperation"
      ),
  },
  {
    path: "/403",
    hideInMenu: true,
    component: () => import(/* webpackChunkName: "user" */ "../views/403.vue"),
  },
  // {
  //   path: "/Instructions",
  //   name: "说明文档",
  //   meta: {
  //     title: "说明文档",
  //     icon: "lock",
  //     // isShow: true,
  //   },
  //   component: () =>
  //     import(
  //       /* webpackChunkName: "layout" */ "../views/SmartArrLesson/Instructions/Instructions"
  //     ),
  // },
  {
    path: "*",
    hideInMenu: true,
    component: () => import(/* webpackChunkName: "user" */ "../views/404.vue"),
  },
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});
router.beforeEach((to, from, next) => {
  let token = sessionStorage.getItem("paike_token");
  if (to.path === "/init") {
    // 如果是访问登录界面，如果用户会话信息存在，代表已登录过，跳转到主页
    if (token && token !== "null") {
      next({ path: "/" });
    } else {
      next();
    }
  } else {
    if (!token || token === "null") {
      // 如果访问非登录界面，且户会话信息不存在，代表未登录，则跳转到登录界面
      let href = window.location.href;
      let w = href.slice(href.indexOf("?"));
      next({ path: `/init${w}` });
    } else {
      let routerInfo = JSON.parse(sessionStorage.getItem("routerInfo"));
      //判断是否是刷新页面，如果是刷新vue会重新实例化，vuex数据消失（vuex数据保存在运行内存中）
      //因此将之前的路由保存在浏览器缓存，刷新时动态更新vuex数据

      if (routerInfo && store.state.addRoutes.rootRoute.length === 0) {
        if (sessionStorage.getItem("role") === "1") {
          //老师
          store.dispatch("add_Routes", techerRouter).then(next({ ...to }));
        } else if (sessionStorage.getItem("role") === "0") {
          //管理员
          store.dispatch("add_Routes", adminRouter).then(next({ ...to }));
        }
      } else {
        next();
      }
    }
  }
});
router.afterEach(() => {
  NProgress.done();
});
export default router;

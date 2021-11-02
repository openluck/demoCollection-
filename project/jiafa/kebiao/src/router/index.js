/*
 * @Desc:
 * @Version: v1.00
 * @Author: went
 * @Date: 2021-08-02 15:28:59
 * @LastEditors: YanQY
 * @LastEditTime: 2021-09-15 14:57:54
 */
import Vue from "vue";
import { Modal } from "ant-design-vue";
import VueRouter from "vue-router";
import NProgress from "nprogress";
import store from "../store";
import "nprogress/nprogress.css";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () =>
      import(/* webpackChunkName: "BasicLayout" */ "../layouts/BasicLayout.vue"),
    redirect: "/home",
    children: []
  },
  {
    path: "/init",
    name: "loading",
    component: () => import(/* webpackChunkName: "views" */ "../views/Init")
  },
  {
    path: "/403",
    hideInMenu: true,
    component: () => import(/* webpackChunkName: "system" */ "../views/403.vue")
  },
  {
    path: "/conflictPage",
    hideInMenu: true,
    name: "课程冲突",
    meta: {
      icon: "home",
      title: "课程冲突"
    },
    component: () =>
      import(
        /* webpackChunkName: "ConflictPage" */ "../views/TimetableManage/ConflictPage"
      )
  },
  {
    path: "/lessonDetails",
    hideInMenu: true,
    component: () => import(/* webpackChunkName: "system" */ "../views/404.vue")
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});
router.beforeEach((to, from, next) => {
  Modal.destroyAll();
  let token = sessionStorage.getItem("token");
  if (to.path !== from.path) {
    NProgress.start();
  }
  if (to.path === "/init") {
    // debugger;
    if (token && token !== "null") {
      // next({ path: "/" });
      next();
    } else {
      next();
    }
  } else {
    // debugger;
    if (!token || token === "null") {
      // 如果访问非登录界面，且户会话信息不存在，代表未登录，则跳转到登录界面
      let href = window.location.href;
      let start = href.indexOf("#");
      let inputPath = href.slice(start + 1, href.indexOf("?"));
      sessionStorage.setItem("inputPath", inputPath);
      let w = href.slice(href.indexOf("?"));
      next({ path: `/init${w}` });
    } else {
      let routerInfo = JSON.parse(sessionStorage.getItem("routerInfo"));
      //判断是否是刷新页面，如果是刷新vue会重新实例化，vuex数据消失（vuex数据保存在运行内存中）
      //因此将之前的路由保存在浏览器缓存，刷新时动态更新vuex数据
      if (routerInfo && store.state.addRoutes.rootRoute.length === 0) {
        if (store.state.app.isAllowStatus) {
          store
            .dispatch(
              "add_Routes",
              JSON.parse(sessionStorage.getItem("routerInfo"))
            )
            .then(next({ ...to }));
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

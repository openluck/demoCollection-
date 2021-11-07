import Vue from "vue";
// import { Modal } from "ant-design-vue"
import VueRouter from "vue-router";
import NProgress from "nprogress";
// import store from "../store"
import "nprogress/nprogress.css"
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import(/* webpackChunkName: "user" */ "../layouts/BasicLayout.vue"),
    redirect: "/platformStats",
    children: [
      {
        path: '/platformStats',
        name: '高考选课',
        meta: {
          icon: "platformStats",
          title: "高考选课",
          isShow: true
        },
        component: () => import(/* webpackChunkName: "user" */ "../views/PlatformStats/PlatformStats.vue")
      }
    ]
  },
  {
    path: '/init',
    name: '登录',
    component: () => import(/* webpackChunkName: "user" */ "../views/System/Init.vue")
  },
  {
    path: '/403',
    hideInMenu: true,
    component: () => import(/* webpackChunkName: "user" */ "../views/403.vue")

  },
  {
    path: '*',
    hideInMenu: true,
    component: () => import(/* webpackChunkName: "user" */ "../views/404.vue")

  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});
router.beforeEach((to, from, next) => {
  if (to.path !== from.path) {
    NProgress.start();
    // 权限路由控制
    if (to.path !== "/init") {
      next();
    } else {
      next();
    }
  }
});
router.afterEach(() => {
  NProgress.done()
})
export default router;

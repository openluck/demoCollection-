import Vue from "vue";
import { Modal, message } from "ant-design-vue"
import VueRouter from "vue-router";
import NProgress from "nprogress";
import store from "../store"
import "nprogress/nprogress.css"
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "index",
    component: () => import("../layouts/BasicLayout.vue"),
    // redirect: "/platformStats",
    children: [
      // {
      //   path: '/plat',
      //   name: '消息llalal',
      //   meta: {
      //     icon: "platformStats",
      //     title: "消息llalal"
      //   },
      //   component: () => import("../views//PlatformStats/PlatformStats.vue")
      // }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import("../views/System/Login.vue")
  }, {
    path: '/disabledStudents',
    name: 'disabledStudents',
    meta: { needTempToken: true },
    component: () => import("../views/disabledStudents/disabledStudents.vue")
  },
  {
    path: '/studentApplication',
    name: 'studentApplication',
    meta: { needTempToken: true },
    component: () => import("../views/disabledStudents/studentApplication.vue")
  },
  {
    path: '/printNote',
    name: 'printNote',
    meta: { needTempToken: true },
    component: () => import("../views/disabledStudents/printNote.vue")
  },
  {
    path: '/403',
    hideInMenu: true,
    component: () => import("../views/403.vue")
  },
  {
    path: '*',
    hideInMenu: true,
    component: () => import("../views/404.vue")
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});
router.beforeEach((to, from, next) => {
  console.log("to, from", to, from);
// debugger
  Modal.destroyAll();
  let token = sessionStorage.getItem('token');
  let temporary_token = sessionStorage.getItem('temporaryV1.20_token');
  if (to.path !== from.path) {
    NProgress.start();
  }
  if (to.meta.needTempToken) {
    if (temporary_token) {
      if (to.query.token) {
        next(to.path)
      } else {
        next()
      }
      next()
    } else {
      message.error("未获取到token")
      next("/403")
    }
  } else {
    if (to.path === '/login') {
      // 如果是访问登录界面，如果用户会话信息存在，代表已登录过，跳转到主页
      if (token) {
        next({ path: '/' })
      } else {
        next()
      }
    } else if (to.path === '/403') {
      next()
    } else {
      if (!token) {
        // 如果访问非登录界面，且户会话信息不存在，代表未登录，则跳转到登录界面
        next({ path: '/login' })
      } else {
        let routerInfo = JSON.parse(sessionStorage.getItem('routerInfo'))

        //判断是否是刷新页面，如果是刷新vue会重新实例化，vuex数据消失（vuex数据保存在运行内存中）
        //因此将之前的路由保存在浏览器缓存，刷新时动态更新vuex数据
        if (routerInfo && store.state.addRoutes.rootRoute.length === 0) {
          //刷新
          store.dispatch("add_Routes", JSON.parse(sessionStorage.getItem('routerInfo'))).then(
            next({ ...to })
          )
        } else {
          next()
        }
      }
    }
  }
});
router.afterEach(() => {
  NProgress.done()
})

export default router;

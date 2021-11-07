import Vue from 'vue'
import {
  Modal
} from 'ant-design-vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'
import store from '../store'
import 'nprogress/nprogress.css'
// import {
//   getQueryString
// } from '@/Utils/util'
Vue.use(VueRouter)

const routes = [{
  path: '/',
  component: () =>
    import( /* webpackChunkName: "user" */ '../layouts/BasicLayout.vue'),
  redirect: '/RegInfoStatistics/ApplyDataSearch',
  children: [

  ],
},
{
  path: '/login',
  name: '登录',
  component: () =>
    import( /* webpackChunkName: "user" */ '../views/System/Login.vue'),
},
{
  path: '/init',
  name: 'init',
  component: () =>
    import( /* webpackChunkName: "user" */ '../views/System/Init.vue'),
},
{
  path: '/403',
  hideInMenu: true,
  component: () => import( /* webpackChunkName: "user" */ '../views/403.vue'),
},
{
  path: '*',
  hideInMenu: true,
  component: () => import( /* webpackChunkName: "user" */ '../views/404.vue'),
},
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
})
Modal.destroyAll()
router.beforeEach((to, from, next) => {

  let token = sessionStorage.getItem('sjgdxgxt_token')==="null"?null:sessionStorage.getItem('sjgdxgxt_token')
  if (to.path !== from.path) {
    NProgress.start()
  }
  // let exId = getQueryString('exId')
  // if (exId) {
  //   // 获取token
  //   sessionStorage.setItem('sjgdxgxt_token', getQueryString('token'))
  //   // 获取exId
  //   sessionStorage.setItem('exId', getQueryString('exId'))
  //   // 获取pure
  //   sessionStorage.setItem('pure', getQueryString('pure'))
  // }

  if (to.path === '/login') {
       // 如果是访问登录界面，如果用户会话信息存在，代表已登录过，跳转到主页
    if (token) {
      next({
        path: '/',
      })
    } else {
      next()
    }
  } else if (to.path === '/init') {
    // 如果是访问初始化页面
    next()
  } else {
    if (!token) {
      // 如果访问非登录界面，且户会话信息不存在，代表未登录，则跳转到登录界面
      next({
        path: '/login',
      })
    } else {
      let routerInfo = JSON.parse(sessionStorage.getItem('routerInfo'))
      let picBaseUrl = sessionStorage.getItem('picBaseUrl')
      store.commit('changePicBaseUrl', picBaseUrl)
      //判断是否是刷新页面，如果是刷新vue会重新实例化，vuex数据消失（vuex数据保存在运行内存中）
      //因此将之前的路由保存在浏览器缓存，刷新时动态更新vuex数据
      if (routerInfo && store.state.addRoutes.rootRoute.length === 0) {
        store
          .dispatch(
            'add_Routes',
            JSON.parse(sessionStorage.getItem('routerInfo'))
          )
          .then(
            next({
              ...to,
            })
          )
      } else {
        next()
      }
    }
  }
})
router.afterEach(() => {
  NProgress.done()
})
export default router
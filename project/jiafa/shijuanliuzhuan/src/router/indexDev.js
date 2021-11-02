import Vue from 'vue'
import Router from 'vue-router'
import api from '@/http/api'
import store from '@/store'
import { getStore } from '@/utils/util.js'

Vue.use(Router)
const router = new Router({
  mode: 'hash',
  routes: [
    {
      path: '/init',
      name: 'init',
      component: resolve => require(['@/views/init'], resolve)
    },
    // {
    //   path: '/',
    //   name: 'redirect',
    //   redirect: '/EscortPlan'
    // },
    // {
    //   path: '/',
    //   name: 'Home',
    //   component: resolve => require(['@/views/Home'], resolve),
    //   children: [
    {
      path: '/WorkRequirement',
      name: 'WorkRequirement',
      component: resolve => require(['@/views/WorkRequirement/WorkRequirement'], resolve)
    },
    {
      path: '/TaskMonitor',
      name: 'TaskMonitor',
      component: resolve => require(['@/views/EscortTaskAdmin/TaskMonitor/TaskMonitor'], resolve)
    }, {
      path: '/EscortPlan',
      name: 'EscortPlan',
      component: resolve => require(['@/views/EscortTaskAdmin/EscortPlan/EscortPlan'], resolve)
    }, {
      path: '/EscortTask',
      name: 'EscortTask',
      meta: {
        keepAlive: true
      },
      component: resolve => require(['@/views/EscortTaskAdmin/EscortTask/Escorttask'], resolve)
    },
    {
      path: '/EscortTask/EscortTaskManage',
      name: 'EscortTaskManage',
      component: resolve => require(['@/views/EscortTaskAdmin/EscortTask/ChildCon/EscortTaskManage'], resolve)
    },
    {
      path: '/EscortPlan/AddPlan',
      name: 'AddPlan',
      component: resolve => require(['@/views/EscortTaskAdmin/EscortPlan/Addplan'], resolve)
    },
    {
      path: '/EscortAlarm',
      name: 'EscortAlarm',
      component: resolve => require(['@/views/EscortTaskAdmin/EscortAlarm/EscortAlarm'], resolve)
    },
    {
      path: '/EscortPlayback',
      name: 'EscortPlayback',
      component: resolve => require(['@/views/EscortTaskAdmin/EscortPlayback/EscortPlayback'], resolve)
    },
    {
      path: 'PrintPuPdf',
      name: 'PrintPuPdf',
      props: true,
      component: resolve => require(['@/views/PrintPdf/PrintPuPdf'], resolve)
    },
    {
      path: 'EscortDuPdf',
      name: 'EscortDuPdf',
      props: true,
      component: resolve => require(['@/views/PrintPdf/EscortDuPdf'], resolve)
    },
    {
      path: 'EscortYiPdf',
      name: 'EscortYiPdf',
      props: true,
      component: resolve => require(['@/views/PrintPdf/EscortYiPdf'], resolve)
    },
    //   ]
    // },
    {
      path: '/404',
      name: '404',
      component: resolve => require(['@/views/Error/404.vue'], resolve)
    },

  ]
})
router.beforeEach((to, from, next) => {
  console.log(from)
  // 登录界面登录成功之后，会把用户信息保存在会话
  // 存在时间为会话生命周期，页面关闭即失效。
  let token = sessionStorage.getItem('token')
  let userInfo = sessionStorage.getItem('userInfo')
  let systemConf = sessionStorage.getItem('systemConf')
  if (to.path === '/init') {
    // 如果是访问登录界面，如果用户会话信息存在，代表已登录过，跳转到主页
    next()
  } else {

    if (userInfo == null || systemConf == null) {
      // 如果访问非登录界面，且户会话信息不存在，代表未登录，则跳转到登录界面
      next({ path: '/init' })

    } else {
      //在此处进行页面权限控制
      getOrg()
      getOrg1()
      getSessionAndSubject()
      getSystemConf()
      next()
    }
  }
})

function getOrg () {
  api.init.getEnabledOrgs({ orgCode: JSON.parse(getStore('userInfo')).orgcode }).then(
    res => {
      store.commit('setOrgs', res.data)
    }
  ).catch()
}

function getOrg1 () {
  api.init.getEnabledOrgs({ orgCode: '' }).then(
    res => {
      //  console.log(res.data);
      store.commit('setOrgs1', res.data)
    }
  ).catch()
}

function getSessionAndSubject () {
  api.init.getSessionAndSubject().then(
    res => {
      //  console.log(res.data);
      store.commit('setSessionAndSubject', res.data)
    }
  ).catch()
}

function getSystemConf () {
  api.init.getSystemConf().then(
    res => {
      //  console.log(res.data);
      store.commit('setSystemConf', res.data)
    }
  )
}

export default router

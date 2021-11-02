import Vue from 'vue'
import Router from 'vue-router'
import api from '@/http/api'
import store from '@/store'
import { getStore } from "@/utils/util.js";
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
    //   redirect: '/WorkRequirement'
    // },
    {
      path: '/',
      name: 'Home',
      component: resolve => require(['@/views/Home'], resolve),
      children: [
        {
          path: 'WorkRequirement',
          name: 'WorkRequirement',
          component: resolve => require(['@/views/WorkRequirement/WorkRequirement'], resolve)
        },
        {
          path: 'TaskMonitor',
          name: 'TaskMonitor',
          component: resolve => require(['@/views/EscortTaskAdmin/TaskMonitor/TaskMonitor'], resolve)
        },
        {
          path: 'TaskMonitorNew',
          name: 'TaskMonitorNew',
          component: resolve => require(['@/views/EscortTaskAdmin/TaskMonitor/TaskMonitorNew'], resolve)
        }, {
          path: 'EscortPlan',
          name: 'EscortPlan',
          component: resolve => require(['@/views/EscortTaskAdmin/EscortPlan/EscortPlan'], resolve)
        }, {
          path: 'EscortTask',
          name: 'EscortTask',
          meta: {
            keepAlive: true
          },
          component: resolve => require(['@/views/EscortTaskAdmin/EscortTask/Escorttask'], resolve)
        },
        {
          path: 'EscortTask/EscortTaskManage',
          name: 'EscortTaskManage',
          component: resolve => require(['@/views/EscortTaskAdmin/EscortTask/ChildCon/EscortTaskManage'], resolve)
        },
        {
          path: 'EscortPlan/AddPlan',
          name: 'AddPlan',
          component: resolve => require(['@/views/EscortTaskAdmin/EscortPlan/Addplan'], resolve)
        },
        {
          path: 'EscortAlarm',
          name: 'EscortAlarm',
          component: resolve => require(['@/views/EscortTaskAdmin/EscortAlarm/EscortAlarm'], resolve)
        },
        {
          path: 'EscortPlayback',
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
          path: 'PrintDuPdf',
          name: 'PrintDuPdf',
          props: true,
          component: resolve => require(['@/views/PrintPdf/PrintDuPdf'], resolve)
        },
        {
          path: 'PrintYiPdf',
          name: 'PrintYiPdf',
          props: true,
          component: resolve => require(['@/views/PrintPdf/PrintYiPdf'], resolve)
        },
      ]
    },
    {
      path: '/404',
      name: '404',
      component: resolve => require(['@/views/Error/404.vue'], resolve)
    },

  ]
})
router.beforeEach((to, from, next) => {
  let userInfo = sessionStorage.getItem('userInfo');
  let systemConf = sessionStorage.getItem('systemConf');
  if (to.path === '/init') {
    next()
  } else {
    if (userInfo == null || systemConf == null) {
      next({ path: '/init' })
    } else {
      //在此处进行页面权限控制
      getOrg();
      getOrg1();
      getSessionAndSubject();
      getSystemConf();
      next()
    }
  }
})
function getOrg() {
  api.init.getEnabledOrgs({ orgCode: JSON.parse(getStore("userInfo")).orgcode }).then(
    res => {
      store.commit('setOrgs', res.data)
    }
  ).catch()

}
function getOrg1() {
  api.init.getEnabledOrgs({ orgCode: "" }).then(
    res => {
      //  console.log(res.data);
      store.commit('setOrgs1', res.data)
    }
  ).catch()
}
function getSessionAndSubject() {
  api.init.getSessionAndSubject().then(
    res => {
      //  console.log(res.data);
      store.commit('setSessionAndSubject', res.data)
    }
  ).catch()
}
function getSystemConf() {
  api.init.getSystemConf().then(
    res => {
      //  console.log(res.data);
      if (res.result) {
        store.commit('setSystemConf', res.data)
      } else {
        this.$message.error(res.message)
      }

    }
  )
}
export default router

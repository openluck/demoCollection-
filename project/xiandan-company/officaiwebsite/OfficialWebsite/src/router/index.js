import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

function lazyImport(path) {
  return () => import(`@/components/${path}`)
}

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'PcIndex',
      component: lazyImport('PcIndex')
    },
    // 公司主营业务
    {
      path: '/business',
      name: 'MainBusiness',
      component: lazyImport('pc/MainBusiness')
    },
    // 查看抽奖
    {
      path: '/raffle',
      name: 'raffle',
      component: lazyImport('pc/raffle')
    },
    //  公司案例展示
    {
      path: '/case',
      name: 'Case',
      component: lazyImport('pc/Case')
    },
    //  解决流程
    {
      path: '/solve',
      name: 'Solve',
      component: lazyImport('pc/Solve')
    },
    // 联系我们
    {
      path: '/contact',
      name: 'Contact',
      component: lazyImport('pc/Contact')
    },
    // 首页
    {
      path: '/home',
      name: 'home',
      component: lazyImport('pc/home')
    },
    // 发起抽奖
    {
      path: '/raffleDetail',
      name: 'raffleDetail',
      component: lazyImport('pc/raffleDetail')
    },
    // 移动端页面
    {
      path: '/m',
      name: 'Mobile',
      component: lazyImport('MobileIndex')
    },
    // 移动端公司业务
    {
      path: '/m/business',
      name: 'mBusiness',
      component: lazyImport('Mobile/mBusiness')
    },
    // 移动端公司案例展示
    {
      path: '/m/case',
      name: 'MCase',
      component: lazyImport('Mobile/MCase')
    },
    // 移动端解决流程
    {
      path: '/m/solve',
      name: 'MSolve',
      component: lazyImport('Mobile/MSolve')
    },
    // 移动端联系我们页面
    {
      path: '/m/contact',
      name: 'MContact',
      component: lazyImport('Mobile/MContact')
    }
  ]
})

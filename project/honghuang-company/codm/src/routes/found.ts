import { RouteConfig } from 'vue-router';
import Found from '@views/found';

const route: RouteConfig = {
  path: '/found', // 发现页
  name: 'found',
  component: Found,
  redirect: '/found/square',
  // note: 子路由配置, 参考 routes/home.ts 文件中子路由的配置
  children: [
    {
      path: 'square', // 动态广场
      // note: 路由名字不要使用 / 分割, 使用 - 中划线分割
      name: 'found-square',
      component: () => import(/* webpackChunkName: "square" */ '@views/found/square'),
    },
    {
      path: 'welfare', // 福利站
      name: 'found-welfare',
      component: () => import(/* webpackChunkName: "welfare" */ '@views/found/welfare'),
    },
    {
      path: 'gift', // 兑换礼包页面
      name: 'found-gift',
      component: () => import(/* webpackChunkName: "gift" */ '@/views/found/welfareGift'),
      meta: {
        hideNav: true,
        back: 1,
        hideSecNav: true,
      },
    },
    {
      path: 'calendar', // 活动日历
      name: 'found-calendar',
      component: () => import(/* webpackChunkName: "calendar" */ '@views/found/calendar'),
    },
    {
      path: 'publish', // 发布
      name: 'found-publish',
      component: () => import(/* webpackChunkName: "publish" */ '@views/found/publish'),
      meta: {
        back: 1,
        hideSecNav: true,
        hideNav: true,
      },
    },
    {
      path: 'topic', // 话题
      name: 'found-topic',
      component: () => import(/* webpackChunkName: "topic" */ '@views/found/topic'),
      meta: {
        back: 1,
        hideNav: true,
        hideSecNav: true,
      },
    },
    {
      path: 'dynamic_detail/:id', // 动态详情页面
      name: 'found-dynamicDetail',
      component: () => import(/* webpackChunkName: "dynamic-detail" */ '@/views/found/dynamicDetail'),
      meta: {
        hideNav: true,
        hideSecNav: true,
        back: 1,
      },
    },
    {
      path: 'integral_record', // 积分记录
      name: 'found-integralRecord',
      component: () => import(/* webpackChunkName: "integral-record" */ '@/views/found/integralRecord'),
      meta: {
        hideNav: true,
        hideSecNav: true,
        back: 1,
      },
    },
    {
      path: 'myaward', // 我的奖励
      name: 'found-myaward',
      component: () => import(/* webpackChunkName: "found-myaward" */ '@/views/found/myaward'),
      meta: {
        hideNav: true,
        hideSecNav: true,
        back: 1,
      },
    },
  ],
};

export default route;

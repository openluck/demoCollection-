import { RouteConfig } from 'vue-router';
import WarAreaPage from '@views/walkthrough/warArea';
import WalkthroughPage from '@views/walkthrough';

const route: RouteConfig = {
  path: '/walkthrough',
  name: 'walkthrough',
  redirect: '/walkthrough/firearms',
  component: WalkthroughPage,
  // note: 子路由配置
  children: [
    {
      path: 'firearms',
      name: 'walkthrough-firearms',
      component: () => import(/* webpackChunkName: "firearms" */ '@views/walkthrough/firearms'),
    },
    {
      path: 'weapon_detail/:id',
      name: 'firearms-weaponDetail',
      component: () =>
        import(/* webpackChunkName: "firearms-weaponDetail" */ '@views/walkthrough/firearms/weaponDetail'),
      meta: {
        hideTwoLevelNav: true,
        back: 1,
      },
    },
    {
      path: 'gameplay',
      name: 'walkthrough-gameplay',
      component: () => import(/* webpackChunkName: "gameplay" */ '@views/walkthrough/gamePlay'),
    },
    {
      path: 'gameplay_detail/:id',
      name: 'gameplay-detail',
      component: () => import(/* webpackChunkName: "gameplay-detail" */ '@views/walkthrough/gamePlay/detail'),
      meta: {
        hideTwoLevelNav: true,
        back: 1,
      },
    },
    {
      path: 'rank',
      name: 'walkthrough-rank',
      component: () => import(/* webpackChunkName: "rank" */ '@views/walkthrough/rank'),
    },
    {
      path: 'war_area',
      name: 'walkthrough-warArea',
      component: WarAreaPage,
    },
    // 成长宝典
    {
      path: 'grow_up',
      name: 'walkthrough-growUp',
      component: () => import(/* webpackChunkName: "grow-up" */ '@views/walkthrough/growUp'),
    },
    {
      path: 'map', // 地图
      name: 'found-map',
      component: () => import(/* webpackChunkName: "calendar" */ '@views/walkthrough/map'),
    },
  ],
};

export default route;

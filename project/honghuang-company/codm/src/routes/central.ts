import { RouteConfig } from 'vue-router';
import CentralPage from '@views/central';

const route: RouteConfig = {
  path: '/central',
  name: 'central',
  redirect: '/central/dynamic',
  component: CentralPage,
  // note: 子路由配置, 参考 routes/home.ts 文件中子路由的配置
  children: [
    // {
    //   path: 'data',
    //   name: 'central-data',
    //   component:
    // () => import( /* webpackPrefetch: true */  /* webpackChunkName: "central-data" */ '@views/central/data'),
    // },
    {
      path: 'dynamic',
      name: 'central-dynamic',
      component: () => import(/* webpackChunkName: "central-dynamic" */ '@views/central/dynamic'),
    },
    {
      path: 'message',
      name: 'central-message',
      component: () => import(/* webpackChunkName: "central-message" */ '@views/central/message'),
    },
    {
      path: 'test',
      name: 'central-test',
      component: () => import(/* webpackChunkName: "central-testEntry" */ '@/views/central/testEntry'),
    },
  ],
};

export default route;

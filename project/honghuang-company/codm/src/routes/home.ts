import { RouteConfig } from 'vue-router';
import Home from '@views/home';
import HomeContentPage from '@views/home/homeContent';

const route: RouteConfig = {
  path: '/',
  name: 'home',
  component: Home,
  redirect: '/home',
  // note: 子路由配置
  children: [
    {
      path: 'home',
      name: 'home-content',
      component: HomeContentPage,
    },
    {
      path: 'article_list/:id',
      name: 'home-articleList',
      component: () => import(/* webpackChunkName: "article-list" */ '@views/home/articleList'),
      meta: {
        back: 1,
        hideNav: true,
      },
    },
    {
      path: 'video_list/:id',
      name: 'home-videoList',
      component: () => import(/* webpackChunkName: "video-list" */ '@views/home/videoList'),
      meta: {
        back: 1,
        hideNav: true,
      },
    },
  ],
};

export default route;

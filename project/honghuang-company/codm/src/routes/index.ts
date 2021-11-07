import { baseUrl } from '@/config';
import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from './home';
import Walkthrough from './walkthrough';
import Found from './found';
import Central from './central';
import { IRouteConfig } from '@/typings/shims-tsx';

Vue.use(VueRouter);

const routes: Array<IRouteConfig> = [
  Home,
  Walkthrough,
  Found,
  Central,
  // 视频详情页面
  {
    path: '/video_detail/:id',
    name: 'videoDetail',
    component: () => import(/* webpackChunkName: "article-detail" */ '@views/videoDetail'),
    meta: {
      // note: 隐藏一级入口
      hideNav: true,
      back: 1,
    },
  },
  // 文章详情页面
  {
    meta: {
      hideNav: true,
      back: 1,
    },
    path: '/article_detail/:id',
    name: 'articleDetail',
    component: () => import(/* webpackChunkName: "video-detail" */ '@views/articleDetail'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: baseUrl,
  routes,
});

export default router;

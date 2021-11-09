import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [{
      path: 'index',
      name: 'Index',
      component: () => import('@/views/index/index'),
      meta: { title: '概要', icon: 'el-icon-s-home' }
    }]
  },

  {
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    name: 'User',
    children: [
      {
        path: 'list',
        name: 'List',
        component: () => import('@/views/user/index'),
        meta: { title: '用户列表', icon: 'peoples' }
      }
    ]
  },
  {
    path: '/article',
    component: Layout,
    redirect: '/article/list',
    name: 'Article',
    meta: {
      title: '文章',
      icon: 'excel'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/article/create'),
        name: 'CreateArticle',
        meta: { title: '创建文章', icon: 'edit' }
      },
      {
        path: 'edit/:id',
        component: () => import('@/views/article/edit'),
        name: 'EditArticle',
        meta: { title: '修改文章', noCache: true, activeMenu: '/article/list' },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/article/list'),
        name: 'ArticleList',
        meta: { title: '文章列表', icon: 'list' }
      },
      {
        path: 'classify',
        component: () => import('@/views/article/classify'),
        name: 'ClassifyList',
        meta: { title: '文章分类', icon: 'component' }
      }
    ]
  },
  {
    path: '/record',
    component: Layout,
    redirect: '/record/list',
    name: 'Record',
    meta: {
      title: '记录管理',
      icon: 'nested'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/record/list'),
        name: 'RecordList',
        meta: { title: '记录列表', icon: 'list' }
      },
      {
        path: 'tag',
        component: () => import('@/views/record/tag'),
        name: 'Tag',
        meta: { title: '记录分类', icon: 'component' }
      }
    ]
  },
  {
    path: '/word',
    component: Layout,
    redirect: '/word/list',
    name: 'Word',
    meta: {
      title: '留言管理',
      icon: 'message'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/word/list'),
        name: 'WordList',
        meta: { title: '留言列表', icon: 'list' },
        hidden: true
      },
      {
        path: 'childList/:id',
        component: () => import('@/views/word/childList'),
        name: 'ChildWordList',
        meta: { title: '回复列表', icon: 'list' },
        hidden: true
      }
    ]
  },
  {
    path: '/album',
    component: Layout,
    redirect: '/album/list',
    name: 'Album',
    meta: {
      title: '相册管理',
      icon: 'el-icon-picture'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/album/list'),
        name: 'WordList',
        meta: { title: '相册列表', icon: 'list' },
        hidden: true
      },
      {
        path: 'photoList/:id',
        component: () => import('@/views/album/photoList'),
        name: 'PhotoList',
        meta: { title: '相片列表', icon: 'list' },
        hidden: true
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
//   mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

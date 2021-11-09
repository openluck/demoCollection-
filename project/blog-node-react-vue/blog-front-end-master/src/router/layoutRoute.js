/**
 * 二级路由
 */

 // 引入页面
 import Article from '../pages/article/article' //  文章首页
 import ArticleDetail from '../pages/articledetail/articledetail' //  文章首页
 import Record from  '../pages/record/record' // 记录页
 import Album from '../pages/album/album' //  相册
 import AlbumDetail from '../pages/albumdetail/albumdetail' //  相册
 import Message from '../pages/message/message' //  留言板
 import About from '../pages/about/about' //  个人介绍
 // 路由数组

 const routes = [
    {
        key: 0,
        path: '/home/article',
        name: '文章',
        component: Article,
    },
    {
        key: 1,
        path: '/home/album',
        name: '相册',
        component: Album,
    },
    {
        key: 3,
        path: '/home/message',
        name: '留言板',
        component: Message,
    },
    {
        key: 4,
        path: '/home/about',
        name: '关于',
        component: About,
    },
    {
        key: 5,
        path: '/home/article/detail/:id',
        name: '文章详情',
        component: ArticleDetail,
    },
    {
        key: 6,
        path: '/home/album/detail/:id',
        name: '相册详情',
        component: AlbumDetail,
    },
    {
        key: 7,
        path: '/home/record',
        name: '相册详情',
        component: Record,
    }
 ]

 export default routes
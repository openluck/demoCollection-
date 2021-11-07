/**
 * 配置参考：https://wechat-miniprogram.github.io/kbone/docs/config/
 */

module.exports = {
  origin: 'https://www.xiandanmall.com',
  entry: '/index',
  router: {
    mall: [
      '/index',
    ],
  },
  redirect: {
    notFound: 'mall',
    accessDenied: 'mall',
  },
  generate: {
    autoBuildNpm: 'npm',
  },
  app: {
    backgroundTextStyle: 'dark',
    navigationBarTextStyle: 'white',
    navigationBarTitleText: '闲蛋电商',
  },
  appExtraConfig: {
    sitemapLocation: 'sitemap.json',
  },
  global: {
    share: true,
    windowScroll: false,
    backgroundColor: '#F7F7F7',
  },
  pages: {},
  optimization: {
    domSubTreeLevel: 10,

    elementMultiplexing: true,
    textMultiplexing: true,
    commentMultiplexing: true,
    domExtendMultiplexing: true,

    styleValueReduce: 5000,
    attrValueReduce: 5000,
  },
  projectConfig: {
    projectname: 'XianDanMALL',
    appid: 'wxda29151fa0315379',
  },
};

'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    // 开启反向代理
    proxyTable: {
      // 抽奖列表展示代理
      '/user': {
        target: 'http://192.168.0.253:80',
        changeOrigin: true,
        // 不需要这个，只是单纯的代理，不需要重写
        // pathRewrite: {
        //   '^/user': ''
        // }
      },
      // 上传发布抽奖展示图片代理
      '/upload':{
        target: 'http://192.168.0.253:80',
        changeOrigin: true,
      },
      // 发布抽奖列表代理
      '/lottery': {
        target: 'http://192.168.0.253:80',
        changeOrigin: true,
      }
    },

    // Various Dev Server settings
    // host: 'localhost', // can be overwritten by process.env.HOST
    host: '192.168.0.107',
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    disableHostCheck: true,
    allowedHosts:['192.168.0.107'],
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true,


  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}

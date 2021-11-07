const path = require('path')

function resolve(dir) {
  return path.join(__dirname, '.', dir)
}
module.exports = {
  lintOnSave: false,
  publicPath: './',
  // 关闭eslint
  devServer: {
    // open: true, //是否自动弹出浏览器页面
    // host: "localhost",
    // port: '8081',
    // https: false,
    // hotOnly: false,
    // proxy: {
    //   '/api': {
    //     target: 'http://10.10.0.124:8080', //API服务器的地址
    //     ws: true, //代理websockets
    //     changeOrigin: true, // 虚拟的站点需要更管origin
    //     pathRewrite: { //重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
    //       '^/api': ''
    //     }
    //   }
    // },
    // overlay: {
    //   warnings: true,
    //   errors: true
    // }
    proxy: {  //配置跨域
      '/api': {
        target: 'http://10.20.5.176:10086/EXDMW',  //这里后台的地址模拟的;应该填写你们真实的后台接口
        changOrigin: true,  //允许跨域
        pathRewrite: {
          /* 重写路径，当我们在浏览器中看到请求的地址为：http://localhost:8080/api/core/getData/userInfo 时
            实际上访问的地址是：http://121.121.67.254:8185/core/getData/userInfo,因为重写了 /api
           */
          '^/api': '' 
        }
      },
    }
  },
  // 关闭eslint
  //   lintOnSave: true,

  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  chainWebpack: config => {
    config.module.rules.delete('svg') // 重点:删除默认配置中处理svg,
    config.module
      .rule('svg-sprite-loader')
      .test(/\.svg$/)
      .include
      .add(resolve('src/icon')) // 处理svg目录
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@assets', resolve('src/assets'))
  }
}
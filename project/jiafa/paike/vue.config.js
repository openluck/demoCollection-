/*
 * @Descripttion:
 * @version: v3.10
 * @Author: wentan
 * @Date: 2021-03-30 17:00:38
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-08 10:32:36
 */
const path = require("path");
function resolve(dir) {
  return path.join(__dirname, ".", dir);
}
module.exports = {
  transpileDependencies: [
    /[/\\]node_modules[/\\](.+?)?vuex-persistedstate(.*)/,
  ],
  runtimeCompiler: true,
  publicPath: "./",
  // 关闭eslint
  devServer: {
    // open: true, //是否自动弹出浏览器页面
    host: 'localhost',
    // host: "10.10.0.80",
    port: "8088",
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
  },
  lintOnSave: false,

  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  chainWebpack: (config) => {
    config.module.rules.delete("svg"); // 重点:删除默认配置中处理svg,
    config.module
      .rule("svg-sprite-loader")
      .test(/\.svg$/)
      .include.add(resolve("src/icon")) // 处理svg目录
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      });
    config.module
      .rule("compile")
      .test(/\.js$/)
      .include.add(resolve("node_modules/vuex-persist"))
      .add(resolve("node_modules/_v-area-select@1.0.7@v-area-select"))
      .end()
      .use("babel")
      .loader("babel-loader");
    config.resolve.alias
      .set("@", resolve("src"))
      .set("@assets", resolve("src/assets"));
  },
};

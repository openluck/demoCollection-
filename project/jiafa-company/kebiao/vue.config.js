/*
 * @Desc:
 * @Version: v1.00
 * @Author: went
 * @Date: 2021-08-02 15:29:00
 * @LastEditors: YanQY
 * @LastEditTime: 2021-09-23 10:56:38
 */
const path = require("path");

function resolve(dir) {
  return path.join(__dirname, ".", dir);
}
module.exports = {
  publicPath: "./",
  devServer: {
    // open: true, //是否自动弹出浏览器页面
    host: "0.0.0.0",
    port: "8090",
    https: false,
    hotOnly: false,
    proxy: {
      "/api": {
        target: "http://10.10.0.21:7005", //API服务器的地址
        // target: "http://10.10.0.121:7005", //API服务器的地址
        ws: true, //代理websockets
        changeOrigin: true, // 虚拟的站点需要更管origin
        pathRewrite: {
          "^/api": "" //重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
        }
      }
    }
    // overlay: {
    //   warnings: true,
    //   errors: true
    // }
  },
  // 关闭eslint
  lintOnSave: false,

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          //在此处设置，也可以设置直角、边框色、字体大小等
          "primary-color": "#1BB280"
        },
        javascriptEnabled: true
      }
    }
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
        symbolId: "icon-[name]"
      });
    config.resolve.alias
      .set("@", resolve("src"))
      .set("@assets", resolve("src/assets"));
    const oneOfsMap = config.module.rule("less").oneOfs.store;
    oneOfsMap.forEach((item) => {
      item
        .use("style-resources-loader")
        .loader("style-resources-loader")
        .options({
          // or an array : ["./path/to/vars.less", "./path/to/mixins.less"] 这里的路径不能使用@，否则会报错
          patterns: "./src/assets/css/theme.less"
        })
        .end();
    });
  }
};

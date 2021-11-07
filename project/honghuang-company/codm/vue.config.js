const path = require("path")
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

function isDev() {
  return process.env.ENV === "development"
}

function isTest() {
  return process.env.ENV === "test"
}

function getPublicPath() {
  const env = process.env.ENV;
  if (env === "development") {
    return "/"
  } else if (env === "test") {
    return "https://test.ingame.qq.com/codm/"
  } else {
    return "https://sy.qq.com/codm/"
  }
}

function needAnalyze() {
  return process.env.USE_ANALYZE === 'analyze'
}

function getPlugins() {
  //  用来分析打包模块的大小和体积
  if (needAnalyze()) {
    return [new BundleAnalyzerPlugin()]
  }
  if (isDev()) {
    return [new CaseSensitivePathsPlugin()]
  }
  return [];
}

function customDefineProcessEnv(definitions, envs) {
  for (let i = 0; i < definitions.length; i++) {
    const item = definitions[i];
    if (Object.keys(item).includes("process.env")) {
      const config = definitions[i]['process.env']
      definitions[i]['process.env'] = Object.assign(config, envs)
      return
    }
  }
}

const alias = {
  "@": path.resolve(__dirname, "./src"),
  "@components": path.resolve(__dirname, "./src/components"),
  "@views": path.resolve(__dirname, "./src/views"),
  "@mixins": path.resolve(__dirname, "./src/mixins"),
  "@assets": path.resolve(__dirname, "./src/assets"),
  "@services": path.resolve(__dirname, "./src/services"),
  "@helpers": path.resolve(__dirname, "./src/helpers"),
  "@store": path.resolve(__dirname, "./src/store"),
  "@vueUtils": path.resolve(__dirname, "./src/vueUtils"),
  "@layouts": path.resolve(__dirname, "./src/layouts"),
}

module.exports = {
  publicPath: getPublicPath(),
  productionSourceMap: isTest(),
  lintOnSave: false,
  transpileDependencies: [/@tencent\/.*/],
  css: {
    extract: !isDev(),
    sourceMap: isDev(),
    loaderOptions: {
      less: {
        paths: [path.resolve(__dirname, "./src")],
      },
      css: {
        url: true
      }
    }
  },
  devServer: {
    host: "127.0.0.1",
    hot: true,
    disableHostCheck: true,
    compress: true,
    historyApiFallback: true,
  },
  configureWebpack: {
    resolve: {
      alias: alias,
    },
    plugins: getPlugins()
  },
  chainWebpack(config) {
    config.resolve.extensions.delete(".vue").prepend(".vue");
    // note: 移除 prefetch 插件
    config.plugins.delete('prefetch')
    config.plugins.delete('prefetch-index') // or
    config.plugins.delete('preload')
    config.plugin('define').tap(definitions => {
      customDefineProcessEnv(definitions, { 'APP_MODE': JSON.stringify(process.env.ENV) })
      console.log(definitions);
      return definitions
    })
    if (!isDev()) {
      config.output
        .filename("js/[name].[hash:8].js")
        .chunkFilename("js/[name].[contenthash:8].js")
        .end();
      const externals = {
        vue: 'Vue',
        axios: 'axios',
        'vue-router': 'VueRouter',
        vuex: 'Vuex',
        '@tencent/slug-ui': 'SlugUi'
      }
      config.externals(externals)
      const cdn = {
        css: [
          // // element-ui css
          // 'https://cdn.bootcdn.net/ajax/libs/element-ui/2.12.0/theme-chalk/index.css'
        ],
        js: [
          // vue
          'https://tiem-cdn.qq.com/slugteam/libs/Vue/vue.2.6.12.runtime.min.js',
          // 'https://tiem-cdn.qq.com/slugteam/libs/Vue/vue.2.6.12.min.js',
          // vue-router
          'https://tiem-cdn.qq.com/slugteam/libs/Vue/vue-router.3.4.7.min.js',
          // vuex
          'https://tiem-cdn.qq.com/slugteam/libs/Vue/vuex.3.5.1.min.js',
          // axios
          'https://tiem-cdn.qq.com/slugteam/libraries/axios/axios@0.18.min.js',
          // slug-ui
          'https://tiem-cdn.qq.com/slugteam/components/ui/v0/index.min.js'
        ]
      }
      config.plugin('html')
        .tap(args => {
          args[0].cdn = cdn
          return args
        })
    }
  }
}

const path = require('path');

const devMode = process.env.NODE_ENV !== 'production';
const analyzer = false;

const resolve = function (dir) {
  return path.join(__dirname, dir);
};

const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const EslintFriendlyFormatter = require('eslint-friendly-formatter');

const createLintingRule = () => ({
  test: /\.(ts|js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: EslintFriendlyFormatter,
    emitWarning: true,
  },
});

module.exports = {
  entry: './src/main.js', // ["babel-polyfill", "./src/main.js"], //兼容IE，太大不要
  target: 'web',
  node: {
    fs: 'empty',
  },
  output: {
    path: resolve('/dist/mall/'),
    publicPath: '/dist/mall/',
    chunkFilename: 'chunk[id].[hash:8].js',
    filename: devMode ? 'app.js' : 'app.[hash:8].js',
  },
  resolve: {
    extensions: ['.js', '.ts', '.vue', '.json', '.scss'],
    alias: {
      vue$: 'vue/dist/vue.js',
      '@': resolve('src'),
      '#': resolve('libs'),
    },
  },
  externals: !devMode ? {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios',
  } : {},
  watch: true,
  module: {
    rules: [
      // ...(config.dev.useEslint ? [createLintingRule()] : []),
      ...([createLintingRule()]),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      // ts
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        }, {
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/],
            happyPackMode: true,
          },
        }],
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.html$/,
        loader: 'vue-html-loader',
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff)$/,
        loader: 'url-loader',
        query: {
          limit: 8192,
          name: '[name].[ext]?[hash]',
        },
      }],
  },
  devServer: {
    // historyApiFallback: true,
    // noInfo: true,
    index: 'index.html',
    port: 8081,
    // disableHostCheck: true,
    allowedHosts: [
      'test.xiandanmall.com',
      'mall.kylins.com',
    ],
  },
  devtool: devMode ? 'cheap-module-eval-source-map' : '#eval-source-map',
  optimization: {
    // splitChunks: {
    //     chunks: 'all',
    //     minSize: 30000,
    //     maxSize: 0,
    //     minChunks: 1,
    //     maxAsyncRequests: 5,
    //     maxInitialRequests: 3,
    //     automaticNameDelimiter: '~',
    //     name: true,
    //     cacheGroups: {
    //         vendors: {
    //             test: /[\\/]node_modules[\\/]/,
    //             name: 'vendor',
    //             priority: -10
    //         },
    //         default: {
    //             minChunks: 2,
    //             priority: -20,
    //             reuseExistingChunk: true
    //         }
    //     }
    // },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: devMode, // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  plugins: [
    new FilterWarningsPlugin({
      exclude: /node_modules/,
    }),
    new VueLoaderPlugin(),
    ...(analyzer ? [new BundleAnalyzerPlugin()] : []),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash:8].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash:8].css',
    }),
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.style\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorOptions: { discardComments: { removeAll: true } },
      canPrint: true,
    }),
    ...(!devMode ? [new CompressionWebpackPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js(\?.*)?$/i,
      threshold: 10240,
      minRatio: 0.8,
    })] : []),
    new UglifyJsPlugin(),
  ],

};

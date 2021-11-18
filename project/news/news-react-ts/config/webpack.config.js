/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-11-18 15:13:50
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-11-18 15:42:33
 */
const { override, addWebpackAlias, fixBabelImports, addLessLoader, addBabelPlugin } = require('customize-cra')
const path = require('path')
module.exports = override(
  // 配置路径别名
  addWebpackAlias({
    '@': path.resolve('src')
  }),
)
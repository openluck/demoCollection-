/*
 * @Desc:
 * @Version: v1.00
 * @Author: wentan
 * @Date: 2021-04-30 17:19:56
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-09-29 16:21:17
 */
/**
 * 全局常量、方法封装模块
 * 通过原型挂载到Vue属性
 * 通过 this.Global 调用
 */
// 后台管理系统服务器地址
let baseUrl = ''
if (process.env.NODE_ENV === 'development') {
  // baseUrl = 'http://110.185.174.59:3000/mock/679/'
  baseUrl = 'http://10.10.0.232:2003/api/'
  // baseUrl = 'http://10.10.0.220:2003/api/'
} else if (process.env.NODE_ENV === 'debug') {
  baseUrl = 'http://10.4.3.241:8080'
} else if (process.env.NODE_ENV === 'production') {
  // baseUrl = 'http://10.10.0.232:2002/api'
  if (window.G.productionUrl) {
    baseUrl = window.G.productionUrl
  } else {
    baseUrl = '/'
  }
}

export { baseUrl }

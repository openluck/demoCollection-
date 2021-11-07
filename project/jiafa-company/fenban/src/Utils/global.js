/*
 * @Desc: 
 * @Version: v1.00
 * @Author: went
 * @Date: 2021-06-07 09:57:00
 * @LastEditors: went
 * @LastEditTime: 2021-06-17 16:58:23
 */
/**
 * 全局常量、方法封装模块
 * 通过原型挂载到Vue属性
 * 通过 this.Global 调用
 */
// 后台管理系统服务器地址
let baseUrl = ''
if (process.env.NODE_ENV === 'development') {
  //  baseUrl = '/api';
  baseUrl = 'http://10.10.0.232:2002/api'
  // baseUrl = 'http://110.185.174.59:3000/mock/567'
  // baseUrl = 'http://10.10.0.136:8080';
} else if (process.env.NODE_ENV === 'debug') {
  baseUrl = 'http://10.4.3.241:8080'
} else if (process.env.NODE_ENV === 'production') {
  // baseUrl = 'http://10.10.0.232:2002/api'
  if (window.G.productionUrL) {
    baseUrl = window.G.productionUrL
  } else {
    baseUrl = '/'
  }
}

export { baseUrl }


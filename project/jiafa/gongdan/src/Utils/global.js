/**
 * 全局常量、方法封装模块
 * 通过原型挂载到Vue属性
 * 通过 this.Global 调用
 */
// 后台管理系统服务器地址
let baseUrl = ''
if (process.env.NODE_ENV === 'development') {
  //baseUrl = 'https://125.70.9.114:11443/EXDMW'
   baseUrl = 'http://125.70.9.114:30080/EXDMW'
  // baseUrl = 'https://125.70.9.114:11443/#/door'
  // baseUrl = 'http://110.185.174.59:3000/mock/455'
} else if (process.env.NODE_ENV === 'debug') {
  baseUrl = 'http://10.4.3.241:8080'
} else if (process.env.NODE_ENV === 'production') {
  baseUrl = '../'
  // baseUrl = 'http://10.20.5.176:8098/EXDMW';
}
export {
  baseUrl
}
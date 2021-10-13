/*
 * @Descripttion:
 * @version:
 * @Author: YanQY
 * @Date: 2021-04-06 10:18:55
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-13 16:57:09
 */
/**
 * 全局常量、方法封装模块
 * 通过原型挂载到Vue属性
 * 通过 this.Global 调用
 */
// 后台管理系统服务器地址
let baseUrl = "";
  // 生产环境
if (process.env.NODE_ENV === "development") {
  baseUrl = "http://10.10.0.232:2001/";
  // 测试环境
} else if (process.env.NODE_ENV === "debug") {
  baseUrl = "http://10.4.3.241:8080";
  // 线上环境
} else if (process.env.NODE_ENV === "production") {
  // if (window.g.productionRequestUrl) {
  //   baseUrl = window.g.productionRequestUrl;
  // } else {
  //   baseUrl = "../../";
  // }
}
export { baseUrl };

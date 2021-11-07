/*
 * @Descripttion: 
 * @version: 
 * @Author: YanQY
 * @Date: 2021-04-06 10:18:55
 * @LastEditors: YanQY
 * @LastEditTime: 2021-07-22 14:35:25
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
    // baseUrl = 'http://10.20.5.125:2001/';
    // baseUrl = "http://10.4.3.30:2001";
    baseUrl = "http://10.10.0.232:2001/";
    // baseUrl = 'http://10.10.0.136:8080';
} else if (process.env.NODE_ENV === 'debug') {
    baseUrl = 'http://10.4.3.241:8080';
} else if (process.env.NODE_ENV === 'production') {
    if (window.g.productionRequestUrl) {
        baseUrl = window.g.productionRequestUrl
    } else {
        baseUrl = '../../';
    }
}
console.log("baseUrl", baseUrl);
console.log("productionRequestUrl", window.g.productionRequestUrl);
console.log("initUrl", initUrl);
export {
    baseUrl
}
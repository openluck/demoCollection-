/**
 * 全局常量、方法封装模块
 * 通过原型挂载到Vue属性
 * 通过 this.Global 调用
 */
// 后台管理系统服务器地址
let baseUrl = ''
if (process.env.NODE_ENV === 'development') {
    //  baseUrl = '/api';
    baseUrl = 'http://110.185.174.59:48100/EXSME/';
    // baseUrl = 'http://10.20.5.176:8100/EXSME/';
    // baseUrl = 'http://10.20.5.35:3000/mock/439/';
} else if (process.env.NODE_ENV === 'debug') {
    baseUrl = 'http://10.4.3.241:8080';
} else if (process.env.NODE_ENV === 'production') {
    baseUrl = '../';
    // baseUrl = 'http://110.185.174.59:20474/EXSME/';
}
export {
    baseUrl
}   
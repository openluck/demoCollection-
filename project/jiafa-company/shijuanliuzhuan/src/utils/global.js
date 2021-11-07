/**
 * 全局常量、方法封装模块
 * 通过原型挂载到Vue属性
 * 通过 this.Global 调用
 */
// 后台管理系统服务器地址
let baseUrl = ''

if (process.env.NODE_ENV == 'development') {
    //   baseUrl = 'http://10.20.5.161/EXPCM';
    baseUrl = 'https://125.70.9.114:41111/EXPCM/';
    // baseUrl = 'http://10.20.5.163:8001/EXPCM';
    // baseUrl = 'https://117.141.112.26:20080/EXPCM/';       //广西正式环境
} else if (process.env.NODE_ENV == 'debug') {
    baseUrl = ' http://10.20.5.115:8001/EXPCM';
} else if (process.env.NODE_ENV == 'production') {
    let hrefUrl = window.location.href;
    baseUrl = hrefUrl.slice(0, hrefUrl.indexOf('escort'));
    console.log("baseUrl", baseUrl);
}
export {
    baseUrl
}

/*
 * @Desc:
 * @Version: v1.00
 * @Author: went
 * @Date: 2021-09-01 18:23:52
 * @LastEditors: YanQY
 * @LastEditTime: 2021-09-30 13:07:04
 */

import "../../public/config";
let baseUrl = "";
let socketUrl = "";
if (process.env.NODE_ENV === "development") {
  // baseUrl = "/api";
  // baseUrl = 'http://110.185.174.59:3000/mock/487';
  // baseUrl = "http://10.20.5.63/service/iscms"; // 测试环境
  baseUrl = "http://10.4.3.240/service/iscms"; // 测试环境
  // socketUrl = "ws://10.20.5.63:10003";
  // baseUrl = "http://10.10.0.121:7005"; //龚俊友
  // baseUrl = "http://10.10.0.22:7000/iscms"; //冯犇
  // baseUrl = "http://10.10.0.25:7005"; //朱全科
  // baseUrl = "/api"; //陈秋琳
} else if (process.env.NODE_ENV === "debug") {
  baseUrl = "http://10.4.3.241:8080";
} else if (process.env.NODE_ENV === "production") {
  if (window.G.productionUrl && window.G.socketUrl) {
    //1、预留静态文件配置入口
    baseUrl = window.G.productionUrl;
    socketUrl = window.G.socketUr;
  } else {
    //2、通过location动态获取
    if (!window.location.origin) {
      //兼容IE
      window.location.origin =
        window.location.protocol +
        "//" +
        window.location.hostname +
        (window.location.port ? ":" + window.location.port : "");
    }
    let origin = window.location.origin;
    let port = window.location.port ? `:${window.location.port}` : `:10003`;
    baseUrl = `${origin}/service/iscms`;
    socketUrl = `ws://${window.location.hostname}${port}`;
  }
}
// window.G.socketUrl = socketUrl;
export { baseUrl, socketUrl };

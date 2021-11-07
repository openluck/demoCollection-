onVisibleChange/*
 * @Author: junjie.lean
 * @Date: 2019-04-15 15:54:03
 * @Last Modified by: lxx
 * @Last Modified time: 2021-03-31 13:22:02
 */

/**
 * @description 全局配置
 */

import lang from "./../lang/zh_CN";

let sKey = require("./../../package").config.defaultSKey;
let isDev = process.env.NODE_ENV === "development" ? true : false;

const baseConfig = {
  systeamTitle: lang.systeam.systeamTitle /** */,
  sKey: sKey,
};

/**
 * @param {Boolean} isDev
 * @description
 */
function createGlobalConfig(isDev) {
  let obj = {
    ...baseConfig
  };
  if (isDev) {
    // obj.dataService = "http://10.10.0.121:1309"; //查
    // obj.dataService = "http://10.10.0.138:1309"; //唐
    obj.dataService = "http://10.4.3.95"
    // obj.dataService = "http://10.4.3.18:12201"
    // obj.dataService = "http://192.168.117.22"
    // obj.dataService = "http://10.10.0.119:1309" // 罗云跟踪
    // obj.dataService = "http://10.10.0.119:1304"; //罗云课堂
    // obj.dataService = "http://10.10.0.127:1304" // 彭婷
    // obj.dataService = "http://10.20.5.180:180"; // 联调环境
    // obj.dataService = "http://10.10.0.121:1309"; // 查
  } else {
    // obj.dataService = "http://10.20.5.223";
    obj.dataService = window.location.origin;
  }
  return obj;
}

let G = createGlobalConfig(isDev);
// let ptName = window.location.pathname
// ptName = ptName.replace('index.html', "")
// if(ptName.lastIndexOf('/') > -1) {
//   G.valService = G.dataService + ptName + 'axvlc.cab'
// } else {
//   G.valService = G.dataService + ptName + '/axvlc.cab'
// }
// if (sessionStorage && Object.keys(sessionStorage).length) {
//   Object.keys(sessionStorage).forEach((item, index) => {
//     try {
//       G[item] = JSON.parse(sessionStorage[item])
//     }
//     catch (e) {
//       G[item] = sessionStorage[item]
//     }

//   })
// }


if (window) {
  window.G = G;
}

export default G;

/*
 * @Desc: 
 * @Version: v1.00
 * @Author: went
 * @Date: 2021-06-07 09:57:00
 * @LastEditors: went
 * @LastEditTime: 2021-06-17 17:39:07
 */
let noStudentListUrl = {
  // 无人员名单
  url: 'http://10.20.5.125:8089/share.html',
  shareToken:
    'shareToken=eNoVjUkOADEIw74EpKX0yPr_J03nFsmW42JNGbon1dLGrsQooSQD6aAVLQ0KvRoomlmPse3mZzIvO-A2WgxUYHK_mIzR-Gp9zbdLFi7aI71GmclDpy1qou8lFzeInT7n0EUVikVu79OOaUH-r0-FimfuRmjKFsqS-QCODCwF#/share/dashboard',
}

// 有人员名单
let hasStudentListUrl = {
  url: 'http://10.20.5.125:8089/share.html',
  shareToken:
    'shareToken=eNoNzskRA0EIBEGXgF5geHL6b5L0r8ioNF635Di1kXsI0tdDccjGN4ZzGGuHIyaVZ1MCIC-LlM_ht1VEUorJPTbd584XcVbx_ubIh8Bmdc4ZM2XZ7au52ghKyQd5vu5OgRkMi8Sqb-JW0HT3_VOYZLcuylpUqP_DP38pK_o#/share/dashboard',
}
// init url
let initUrl = 'http://10.20.5.191:12201/isbm'

// production url
let productionUrL = 'http://10.10.0.232:10086/api'

const g = {
  hasStudentListUrl,
  noStudentListUrl,
  initUrl,
  productionUrL: productionUrL
}

window.G = g


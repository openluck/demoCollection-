/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-10-20 09:42:07
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-20 11:22:35
 */
const request = require('request')

// let url = `https://channel.chinanews.com/cns/cjs/sh.shtml?pager=${index}&pagenum=13&t=1_41`
// request(url, (err, response, body) => {
//   // 字符串转数组
//   let bodyArr = body.split(';')
//   // 通过字符串的match 正则获取[]中的内容
//   let body1 = bodyArr[0].match(/\[(.+?)\]/g)
//   // json字符串再转为数组对象
//   let bodyObj = JSON.parse(body1[0])
//   bodyObj.map(item => {
//     console.log(item.pubtime);
//   })
// })
let resArr = []
for (let i = 0; i < 5; i++) {
  let url = `https://channel.chinanews.com/cns/cjs/sh.shtml?pager=${i}&pagenum=13&t=1_41`
  request(url, async (err, response, body) => {
    // 字符串转数组
    let bodyArr = body.split(';')
    // 通过字符串的match 正则获取[]中的内容
    let body1 = bodyArr[0].match(/\[(.+?)\]/g)
    // json字符串再转为数组对象
    let bodyObj = JSON.parse(body1[0])
    await bodyObj.map(item => {
      resArr.push(item)
    })
  })
}
setTimeout(() => {
  console.log('resArr', resArr);
}, 2000)
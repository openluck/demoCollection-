/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-10-20 13:40:52
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-21 11:42:20
 */
var mysql = require('mysql');
const request = require('request')

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: '3308',
  password: '123456',
  database: 'spider_news'
});

connection.connect();
//  存储数据的数组
let chinaNewsArr = []
// 获取当前时间
function getLocalMinutesTime() {
  let time = new Date()
  return time.getMinutes() // 获取当前分钟数(0-59)
}
function getChinanewsData() {
  for (let i = 0; i <= 15; i++) {
    let url = `https://channel.chinanews.com/cns/cjs/sh.shtml?pager=${i}&pagenum=20&t=4_${getLocalMinutesTime()}`;
    console.log('url', url+'----------------'+i);
    request(url, async (err, response, body) => {
      // 字符串转数组
      // let bodyArr = body.split(';')
      // 通过字符串的match 正则获取[]中的内容   ?获取到的body有两个
      let bodyMatch = await body.match(/\[(.+?)\]/g)
      console.log('bodyMatch', bodyMatch);
      // json字符串再转为数组对象
      let bodyObj = JSON.parse(bodyMatch[0]) 
      bodyObj.map((item, index) => {
        chinaNewsArr.push(item)
      })
    })
  }
}
const insertChinanewsDataToMysql = (item) => {
  console.log('item' + '---' + item.pubtime);
  let addSql = 'INSERT INTO chinanews_finance_index(pubtime,channel,img_cns,id,title,content,url,source_url,galleryphoto,content_y) VALUES(?,?,?,?,?,?,?,?,?,?)';
  let addSqlParams = [item.pubtime, item.channel, item.img_cns, item.id, item.title, item.content, item.url, item.source_url, item.galleryphoto, item.content_y]
  connection.query(addSql, addSqlParams, (err, result) => {
    if (err) {
      console.log('[INSERT ERROR] - ', err.message);
      return;
    }
    console.log('chinaNewsC存储数据成功!');
  })
}
getChinanewsData()
setTimeout(() => {
  chinaNewsArr.map(item => {
    insertChinanewsDataToMysql(item)
  })
}, 4000)




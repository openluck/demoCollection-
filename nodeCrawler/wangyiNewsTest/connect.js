/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-10-20 13:40:52
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-20 15:48:40
 */
var mysql = require('mysql');
const request = require('request')
const async = require('async')
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'new_db'
});

connection.connect();
let resArr = []
function getData() {
  for (let i = 1; i < 5; i++) {
    let url = `https://channel.chinanews.com/cns/cjs/sh.shtml?pager=${i}&pagenum=13&t=7_45`
    request(url, (err, response, body) => {
      // 字符串转数组
      let bodyArr = body.split(';')
      // 通过字符串的match 正则获取[]中的内容
      let body1 = bodyArr[0].match(/\[(.+?)\]/g)
      // json字符串再转为数组对象
      let bodyObj = JSON.parse(body1[0])
      bodyObj.map((item, index) => {
        resArr.push(item)
      })
    })
  }
}


// for (let i = 1; i < 5; i++) {
//   let url = `https://channel.chinanews.com/cns/cjs/sh.shtml?pager=${i}&pagenum=13&t=7_45`
//   request(url, (err, response, body) => {
//     // 字符串转数组
//     let bodyArr = body.split(';')
//     // 通过字符串的match 正则获取[]中的内容
//     let body1 = bodyArr[0].match(/\[(.+?)\]/g)
//     // json字符串再转为数组对象
//     let bodyObj = JSON.parse(body1[0])
//     bodyObj.map((item, index) => {
//       resArr.push(item)
//     })
//   })
// }
const insertValue = (item) => {
  console.log('item' + '---' + item.pubtime);
  let addSql = 'INSERT INTO newsList(pubtime,channel,img_cns,id,title,content,url,source_url,galleryphoto,content_y) VALUES(?,?,?,?,?,?,?,?,?,?)';
  let addSqlParams = [item.pubtime, item.channel, item.img_cns, item.id, item.title, item.content, item.url, item.source_url, item.galleryphoto, item.content_y]
  connection.query(addSql, addSqlParams, (err, result) => {
    if (err) {
      console.log('[INSERT ERROR] - ', err.message);
      return;
    }
    console.log('--------------------------INSERT----------------------------');
    //console.log('INSERT ID:',result.insertId);        
    console.log('INSERT ID:', result);
    console.log('-----------------------------------------------------------------\n\n');
  })
}
// setTimeout(() => {
//   console.log('resArr', resArr);
//   resArr.map(item => {
//     insertValue(item)
//   })
// }, 2000)

async.series({ getData }, (err, result) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log('result',result);
  if (result) {
    resArr.map(item => {
      insertValue(item)
    })
  }
})
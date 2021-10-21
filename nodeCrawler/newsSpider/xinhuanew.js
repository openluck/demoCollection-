/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-10-21 10:02:09
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-21 14:47:56
 */
const request = require('request')
const mysql = require('mysql')
const cheerio = require('cheerio')
const iconv = require('iconv-lite');

// function getList(url) {
//   return new Promise(resolve => {
//     request.get({ url, encoding: null }, function (err, res, body) {
//       if (err) {
//         console.log(err);
//       }
//       let html = iconv.decode(body, 'utf-8');
//       console.log(html);
//       let $ = cheerio.load(html, { decodeEntities: false });
//       resolve($);
//     });
//   })
// }
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'new_db'
});
let dataList = []
// async function getXinhuaData() {
//   let url = 'http://www.news.cn/fortunepro/json/xh_fortuneproDepth.js'
//   request(url, (err, response, body) => {
//     eval(body)
//     dataList = fortuneproDepth.data.list
//   })
// }

// const insertDataToMysql = (item) => {
//   console.log('item' + '---' + item.pubtime);
//   let addSql = 'INSERT INTO xinhuaNews(pubtime,title,id,url) VALUES(?,?,?,?)';
//   let addSqlParams = [item.pubtime, item.artDetails[0].title, item.id, item.artDetails[0].url]
//   connection.query(addSql, addSqlParams, (err, result) => {
//     if (err) {
//       console.log('[INSERT ERROR] - ', err.message);
//       return;
//     }
//     console.log('chinaNewsC存储数据成功!');
//   })
// }
// getXinhuaData()
// setTimeout(() => {
//   dataList.map(item => {
//     insertDataToMysql(item)
//   })
// }, 4000)

async function getXinhuaData() {
  let url = 'https://m.chinanews.com/chinanews/getNewsList?language=chs&pageSize=15&searchType=1&dtp=16&isWap=yes&cname=cj&pageIndex=3&version_chinanews=6.7.8'
  request(url, (err, response, body) => {
    console.log(body);
    // eval(body)
    // dataList = fortuneproDepth.data.list
  })
}
getXinhuaData()
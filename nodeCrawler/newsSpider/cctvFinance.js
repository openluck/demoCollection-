/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-10-28 15:47:56
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-29 14:04:01
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

function getNewsData() {
  for (let i = 1; i <= 3; i++) {
    // https://api.cntv.cn/newList/getMixListByPrimaryPageId?serviceId=pcfinance&id=PAGEfRGfNhO62mQrnntp6lOe210510&p=1&n=100&cb=aPAGEfRGfNhO62mQrnntp6lOe2105101
    let url = `https://api.cntv.cn/newList/getMixListByPrimaryPageId?serviceId=pcfinance&id=PAGEfRGfNhO62mQrnntp6lOe210510&p=${i}&n=100&cb=aPAGEfRGfNhO62mQrnntp6lOe210510${i}`;
    console.log('url', url + '----------------' + i);
    request({ url, encoding: 'utf-8' }, async (err, response, body) => {
      console.log(typeof body);
      let result = unescape(body.replace(/\\u/g, '%u'))
      // 通过字符串的match 正则获取[]中的内容
      let body1 = result.match(/\[(.+?)\]/g)
      let bodyObj = JSON.parse(body1)
      bodyObj.map((item, index) => {
        chinaNewsArr.push(item)
      })
    })
  }
}

const insertChinanewsDataToMysql = (item) => {
  let addSql = 'INSERT INTO cctv_finance(keywords,image,url,title,page_name,brief,id) VALUES(?,?,?,?,?,?,?)';
  let addSqlParams = [item.keywords, item.image, item.url, item.title, item.page_name, item.brief,item.id]
  connection.query(addSql, addSqlParams, (err, result) => {
    if (err) {
      console.log('[INSERT ERROR] - ', err.message);
      return;
    }
    console.log('chinaNewsC存储数据成功!');
  })
}
getNewsData()
setTimeout(() => {
  chinaNewsArr.map(item => {
    insertChinanewsDataToMysql(item)
  })
}, 4000)

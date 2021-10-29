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
  // port: '3308',
  password: '123456',
  database: 'spider_news'
});

connection.connect();
//  存储数据的数组
let chinaNewsArr = []
 
function getNewsData() {
  for (let i = 1; i <= 1; i++) {
    let url = `https://api.cntv.cn/newList/getMixListByPrimaryPageId?serviceId=pcfinance&id=PAGEfRGfNhO62mQrnntp6lOe210510&p=${i}&n=100&cb=aPAGEfRGfNhO62mQrnntp6lOe210510${i}`;
    console.log('url', url + '----------------' + i);
    request({ url, encoding: 'utf-8' }, async (err, response, body) => {
     console.log(typeof body);
     let result = unescape(body.replace(/\\u/g, '%u'))
     // 通过字符串的match 正则获取[]中的内容
     let body1 = result.match(/\[(.+?)\]/g)
     console.log(JSON.parse(body1));
    })
  }
}



getNewsData() 
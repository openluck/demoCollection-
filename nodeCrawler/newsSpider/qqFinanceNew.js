/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-10-29 14:21:11
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-29 14:31:28
 */

const request = require('request')
var mysql = require('mysql');
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
let num = 20;
// qq新闻网
function getNewsData() {
  for (let i = 0; i < 9; i++) {
    let url = `https://i.news.qq.com/trpc.qqnews_web.kv_srv.kv_srv_http_proxy/list?sub_srv_id=finance&srv_id=pc&offset=${num}&limit=20&strategy=1&ext={%22pool%22:[%22top%22],%22is_filter%22:10,%22check_type%22:true}`;
    request({ url }, async (err, response, body) => {
      let resut = JSON.parse(body)
      let dataList = resut.data.list
      dataList.map((item, index) => {
        chinaNewsArr.push(item)
      })
    })
    num += 20;
  }
}
getNewsData()

const insertChinanewsDataToMysql = (item) => {
  let addSql = 'INSERT INTO qq_finance(title,update_time,img,create_time,url,id) VALUES(?,?,?,?,?,?)';
  let addSqlParams = [item.title, item.update_time, item.img, item.create_time, item.url, item.article_id]
  connection.query(addSql, addSqlParams, (err, result) => {
    if (err) {
      console.log('[INSERT ERROR] - ', err.message);
      return;
    }
    console.log('chinaNewsC存储数据成功!');
  })
}

setTimeout(() => {
  chinaNewsArr.map(item => {
    insertChinanewsDataToMysql(item)
  })
}, 4000)
/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-10-25 09:14:58
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-11-01 16:18:46
 */
// 导入数据库设置配置文件
const defaultConfig = require('./defaultConfig')
// 导入 mysql 模块
const mysql = require('mysql')

// 数据库连接池
const pool = mysql.createPool({
  ...defaultConfig.database
})

let allServices = {
  query: function (sql, values) {
    // 返回一个promise
    return new Promise((resolve, reject) => {
      // 与数据库连接
      pool.getConnection(function (err, connection) {
        if (err) {
          reject(err);
        } else {
          connection.query(sql, values, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows);
            }
            connection.release();
          });
        }
      });
    });
  },
};

// 查询中国新闻网-财经首页新闻
let findChinaNewsFinance = async (dataParam) => {
  // let _sql = 'select * from chinanews_finance_index'
  // let _sql = 'SELECT * FROM chinanews_finance_index ORDER BY id DESC limit ' + dataParam.current + ',10'
  let data = {}
  let _sql = 'SELECT * FROM chinanews_finance_index limit ' + dataParam.current + ',' + dataParam.pageSize;
  let _sqlTotal = 'select count(*) from chinanews_finance_index;'
  data.list = await allServices.query(_sql)
  data.total = await allServices.query(_sqlTotal)
  // console.log(data);
  return data
}

// 中国新闻网-查询关键词
let findKeywordList = async (searchValue) => {
  let _sql = `SELECT * FROM chinanews_finance_index WHERE title LIKE '%${searchValue}%'`
  console.log('_sql----',_sql);
  return allServices.query(_sql)
}

// 导出
module.exports = {
  findChinaNewsFinance,
  findKeywordList
}
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
let findChinaNewsFinance = () => {
  let _sql = 'select * from chinanews_finance_index'
  return allServices.query(_sql)
}

// 导出
module.exports = {
  findChinaNewsFinance
}
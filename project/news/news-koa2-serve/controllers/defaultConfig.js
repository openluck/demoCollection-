/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-10-25 09:14:58
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-11-01 09:48:45
 */
const config = {
  database: {
    database: 'spider_news',
    user: 'root',
    password: '123456',
    // port: '3308',
    host: 'localhost'
  }
}

// node环境只支持 module导出 与 require导入
module.exports = config
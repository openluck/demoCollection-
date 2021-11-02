/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-11-02 11:29:18
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-11-02 15:45:19
 */
// 用于在数据库中查找数据
const Service = require('egg').Service;

class HomeService extends Service {
  async user() {
    return {
      name: '嘎子',
      content: '网络的世界太虚拟，你把握不住'
    }
  }
}

module.exports = HomeService
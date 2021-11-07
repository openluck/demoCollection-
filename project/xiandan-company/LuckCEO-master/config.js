/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
const host = 'https://weapp.kylins.com'
// const host =  'http://192.168.10.213:8080'

var config = {

  appId: 'wxa2e69e34c8d4bf03',

  uploadFolder: {
    cover: '/lottery/cover',
    pictures: '/lottery/pictures'
  },

  // 下面的地址配合云端 Demo 工作
  service: {
    host,
    // 登录地址，用于建立会话
    loginUrl: `${host}/login`,

    // 测试的请求地址，用于测试会话
    requestUrl: `${host}/user`,
    myLotterList: `${host}/user/lotteryList`,
    lotterDetail: `${host}/lottery/detail`,
    publishLotter: `${host}/lottery/publish`,
    lotterHeads: `${host}/lottery/heads`,
    updateAddreess: `${host}/user/address`,
    getWinners: `${host}/lottery/winners`,
    notifyAddress:`${host}/lottery/notifyAddress`,
    joinLotter: `${host}/lottery/join`,
    weeksLotter: `${host}/lottery/weeks_lottery_id`,
    uploadUrl: `${host}/upload`,
    random:`${host}/lottery/random`
  }
};

module.exports = config;
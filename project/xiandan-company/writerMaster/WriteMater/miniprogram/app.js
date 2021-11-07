//app.js

import Store from 'wxministore';
const store = new Store({
  state: {
    isRegisted: false,
    userInfo: null,
    reviewVersion: null,
  }
})

App({
  store: store,
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })

      this.login()
    }
  },
  login: function () {
    wx.cloud.callFunction({
      name:'login',
      success: res => {
        console.warn('[云函数] [login] 调用成功：', res)
        store.setState({
          isRegisted: res.result.isRegisted,
          reviewVersion: res.result.reviewVersion,
          userInfo: res.result.userInfo
        });
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [login] 调用失败：', err)
      }
    })
  }
})

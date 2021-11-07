//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
var util = require('/utils/util.js')
var than
App({
  onLaunch: function(options) {
    than = this

    than.globalData.scene = options.scene
    
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    qcloud.setLoginUrl(config.service.loginUrl)
    qcloud.setAppId(config.appId)

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          // 调用登录接口
          this.login();
        } else {
          than.globalData.logining = false
          //无法登陆
          if (than.userInfoReadyCallback) {
            than.userInfoReadyCallback(null)

          }
        }
      }
    })
  },

  login: userInfo => {
    qcloud.login({
      userDetail: userInfo,
      success(result) {
        if (result) {
          util.showSuccess('登录成功')
          than.globalData.userInfo = result
          // console.log(result,App.globalData)
          than.globalData.logged = true
          than.globalData.logining = false

          if (than.userInfoReadyCallback) {
            than.userInfoReadyCallback(result)
          }
        } else {
          // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
          qcloud.request({
            url: config.service.requestUrl,
            login: true,
            success(result) {
              util.showSuccess('登录成功')
              than.globalData.userInfo = result.data.data
              than.globalData.logged = true
              than.globalData.logining = false
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (than.userInfoReadyCallback) {
                than.userInfoReadyCallback(result.data.data)
              }
            },

            fail(error) {
              util.showModel('请求失败', error)
              console.log('request fail', error)
              than.globalData.logining = false
              if (than.userInfoReadyCallback) {
                than.userInfoReadyCallback(null)
              }
            }
          })
        }
      },

      fail(error) {
        util.showModel('登录失败', error)
        console.log('登录失败', error)
        if (than.userInfoReadyCallback) {
          than.userInfoReadyCallback(null)
        }
      }
    })
  },

  globalData: {
    userInfo: null,
    logining: true
  }
})
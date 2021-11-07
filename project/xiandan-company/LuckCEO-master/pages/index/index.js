//index.js
//获取应用实例

var util = require('../../utils/util.js')

var login = require('../../templates/login.js')
var config = require('../../config.js')
var qcloud = require('../../vendor/wafer2-client-sdk/index')

const app = getApp()
var than;

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    redirecting: false,
    feedback: wx.canIUse('button.open-type.feedback'),
    logining: app.globalData.logining,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  addPublish_count() {
    console.log('addPublish_count')
    this.setData({
      'userInfo.publish_count': parseInt(this.data.userInfo.publish_count) + 1
    })
  },

  onLoad: function(options) {
    than = this

    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#bc4343',
    })
    if (options.scene) {
      this.setData({
        logining: false,
        redirecting: true,
      });

      let url = decodeURIComponent(options.scene)
      url = url.replace('p=1', '/pages/lottery/detail/detail')
      wx.navigateTo({
        url: url,
        success: function() {
          than.setData({
            redirecting: false,
          });

        }
      })
    }

    wx.getSetting({ //先获取用户当前的设置
      success(res) {
        if (!res.authSetting['scope.address']) {
          wx.authorize({
            scope: 'scope.address',
            success(res) {
              console.log(res.errMsg); //用户授权后执行方法
            },
            fail(res) {
              //用户拒绝授权后执行
            }
          })
        }
      }
    })

  },

  onShow: function() {
    if (app.globalData.logining) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      login.hidden(this)
      this.logining()
    } else if (app.globalData.userInfo) {
      login.hidden(this)
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        logining: false
      })
      // console.log(app.globalData.userInfo)

    } else if (!login.isShow(this)) {
      this.checkLogin()
    }

    // wx.navigateTo({
    //   url: '/pages/share/share?json={"id":"2019050616397","status":3,"uid":"123456789","nick_name":"抽奖CEO","cover":"https://weapp-1253463974.cos.ap-shanghai.myqcloud.com/lottery/cover/2%E5%85%83%E7%BA%A2%E5%8C%85.jpg","title":"2019年第19周[抽奖周周乐]","join_count":"28","gifts":[{"name":"2元红包","count":10},{"name":"2元红包","count":10},{"name":"2元红包","count":10},{"name":"2元红包","count":10},{"name":"2元红包","count":10},{"name":"2元红包","count":10},{"name":"2元红包","count":10},{"name":"2元红包","count":10},{"name":"2元红包","count":10},{"name":"2元红包","count":10}],"open_type":"1","create_time":"2019-05-06 08:00:02","open_time":"2019/05/10 20:00","open_count":null,"qr_url":"https://weapp-1253463974.cos.ap-shanghai.myqcloud.com/lottery/qr/e3373975496149e323f269553532b5fb-qr.png","avatar":"https://weapp-1253463974.cos.ap-shanghai.myqcloud.com/lottery/cover/icon.png","win_count":"10","is_confirm_address":1,"gift":null,"is_joined":"1","is_win":"0"}'
    // })

  },
  checkLogin: function() {
    if (this.data.canIUse) {
      this.login()
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  logining: function() {
    this.setData({
      logining: app.globalData.logining
    })
    app.userInfoReadyCallback = userInfo => {
      if (userInfo) {
        // console.log('userInfo:', userInfo)
        this.setData({
          userInfo: userInfo,
          hasUserInfo: true,
          logining: false
        })
      } else {
        this.setData({
          logining: false
        })
        than.login()
      }
    }

  },

  login: function() {
    login.show(this, (user) => {
      this.logining()
      app.login(user)
    }, msg => {
      wx.showToast({
        title: '登陆已取消',
      })
    })
  },

  onNewLottery: function() {
    if (this.data.logining) {
      wx.showToast({
        title: '请稍等',
      })
      return;
    }

    if (app.globalData.userInfo) {
      wx.navigateTo({
        url: '/pages/lottery/new/new',
      })
    } else {
      login.show(this, (user) => {
        this.logining()
        app.login(user)
        wx.navigateTo({
          url: '/pages/lottery/new/new',
        })
      }, msg => {
        wx.showToast({
          title: '登陆已取消',
        })
      })
    }



  },
  onMyLottery: function() {

    if (this.data.logining) {
      wx.showToast({
        title: '请稍等',
      })
      return;
    }

    if (app.globalData.userInfo) {
      wx.navigateTo({
        url: '/pages/lottery/list/list?mode=1',
      })
    } else {
      login.show(this, (user) => {
        this.logining()
        app.login(user)

        wx.navigateTo({
          url: '/pages/lottery/list/list?mode=1',
        })
      }, msg => {
        wx.showToast({
          title: '登陆已取消',
        })
      })

    }


  },
  onJoinLottery: function() {
    if (this.data.logining) {
      wx.showToast({
        title: '请稍等',
      })
      return;
    }

    if (app.globalData.userInfo) {
      wx.navigateTo({
        url: '/pages/lottery/list/list?mode=2',
      })
    } else {
      login.show(this, (userInfo, rawData) => {
        this.logining()
        app.login(rawData)

        wx.navigateTo({
          url: '/pages/lottery/list/list?mode=2',
        })
      }, msg => {
        wx.showToast({
          title: '登陆已取消',
        })
      })

    }
  },

  onWinsLottery: function() {
    if (this.data.logining) {
      wx.showToast({
        title: '请稍等',
      })
      return;
    }

    if (app.globalData.userInfo) {
      wx.navigateTo({
        url: '/pages/lottery/list/list?mode=2&index=1',
      })
    } else {
      login.show(this, (userInfo, rawData) => {
        this.logining()
        app.login(rawData)

        wx.navigateTo({
          url: '/pages/lottery/list/list?mode=2&index=1',
        })
      }, msg => {
        wx.showToast({
          title: '登陆已取消',
        })
      })

    }
  },

  onShake: function() {
    if (this.data.logining) {
      wx.showToast({
        title: '请稍等',
      })
      return;
    }
    if (app.globalData.userInfo) {
      wx.navigateTo({
        url: '/pages/lottery/shake/shake',
      })
    } else {
      login.show(this, (userInfo, rawData) => {
        this.logining()
        app.login(rawData)
        wx.navigateTo({
          url: '/pages/lottery/shake/shake',
        })
      }, msg => {
        wx.showToast({
          title: '登陆已取消',
        })
      })
    }
  },
  onGoAddress(e) {
    var that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.address']) {
          wx.showModal({
            title: '提示',
            content: '请打开通讯地址授权',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.openSetting({})
              }
            }
          })
        } else {
          //打开选择地址
          wx.chooseAddress({
            success: function(res) {
              let address = res.provinceName + res.cityName + res.countyName + res.detailInfo
              let phone = res.telNumber
              let addressee = res.userName

              wx.showLoading({
                title: '请求中...',
              })
              qcloud.request({
                url: config.service.updateAddreess,
                data: {
                  address: address,
                  phone: phone,
                  addressee: addressee,
                  form_id: e.detail.formId
                },
                login: true,
                method: 'GET',
                success: function(result) {
                  wx.hideLoading()
                  if (result.data.code == 0) {
                    util.showSuccess('已提交')
                    than.setData({
                      'lottery.is_confirm_address': 1
                    })
                  } else {
                    util.showError(result.data.error)
                  }
                }
              })
            },
            fail: function(e) {
              if (e.errMsg == 'chooseAddress:fail auth deny') {
                wx.getSetting({
                  success: function(res) {
                    if (res.authSetting.hasOwnProperty('scope.address')) {
                      let isCanAddress = res.authSetting['scope.address']
                      than.setData({
                        isCanAddress: isCanAddress
                      })
                    }

                  }
                })
              } else if (e.errMsg == 'chooseAddress:fail cancel') {}
            }
          })
        }
      },
      fail(res) {
        console.log('调用失败')
      }
    })
  },

})
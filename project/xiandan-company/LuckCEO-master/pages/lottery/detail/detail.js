// pages/lottery/detail/detail.js
var config = require('../../../config.js')
var qcloud = require('../../../vendor/wafer2-client-sdk/index')
var util = require('../../../utils/util.js')
var share = require('../../../templates/share.js')
var login = require('../../../templates/login.js')
var app = getApp()
var than;
const device = wx.getSystemInfoSync() // 获取设备信息

Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: device.windowHeight,
    ready: false,
    lottery: {},
    isCanAddress: true,
    showQr: false,
    submitButTitles: ['参与抽奖', '待开奖', '已中奖', '未中奖', '已结束'],
    giftLabs: ['一等奖', '二等奖', '三等奖', '四等奖', '五等奖', '六等奖', '七等奖', '八等奖', '九等奖', '十等奖'],
    showCanvas: false,
    mode: null,
    isFixed: false,
    pageBottom: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    than = this
    than.setData({
      mode: options.mode == null ? 0 : options.mode
    })
    share.init(this, () => {
      var lottery = this.data.lottery
      var open = '';
      if (lottery.open_type == 1) {
        open += lottery.open_time
      } else {
        open += '满' + lottery.open_count + '人'
      }

      if (lottery.status > 1) {
        open += ' 已自动开奖'
      } else {
        open += ' 自动开奖'
      }
      // let title = getApp().globalData.userInfo.nickName + '邀请您参与[' + than.data.lottery.title + ']抽奖';
      wx.navigateTo({
        url: `/pages/share/share?json=${JSON.stringify({
          status: than.data.lottery.status,
          nick_name: than.data.lottery.nick_name,
          cover: than.data.lottery.cover,
          title: than.data.lottery.title,
          gifts: than.data.lottery.gifts,
          open_type: than.data.lottery.open_type,
          open_time: than.data.lottery.open_time,
          open_count: than.data.lottery.open_count,
          qr_url: than.data.lottery.qr_url,
          avatar: than.data.lottery.avatar,
        })}`,
      })
    })

    wx.showNavigationBarLoading()

    if (app.globalData.logining) {
      app.userInfoReadyCallback = res => {
        if (options.id) than.requestData(options.id)
      }
    } else {
      if (options.id) than.requestData(options.id)
    }

    //页面指定节点查询
    setTimeout(() => {
      var query = wx.createSelectorQuery()
      query.select('#ad').boundingClientRect()
      query.exec(res => {
        // console.log(res[0].top)
        // console.log(res[0].top - than.data.windowHeight)
        if (res[0]) {
          this.setData({
            pageBottom: res[0].top - than.data.windowHeight
          })
        }
      })
    }, 1500)

  },

  // 请求数据
  requestData: function (id) {

    qcloud.request({
      url: config.service.lotterDetail,
      data: {
        id: id
      },
      method: 'GET',
      success: function (result) {
        // console.log(result);
        wx.hideNavigationBarLoading()
        if (result.statusCode != 200) {
          wx.showModal({
            title: '出错了!',
            showCancel: false,
            content: result.data,
            showCancel: false,
            success: function () {
              wx.navigateBack({});
            }
          })
          return;
        }

        if (result.data.code == 0) {
          if (result.data.data.open_time) {
            let time = result.data.data.open_time.replace(/-/g, '/'); // 日期格式处理;
            var data = new Date(Date.parse(time))
            result.data.data.open_time = util.formatUsuallyTime(data)
          }

          than.setData({
            lottery: result.data.data,
            ready: true,
            showCanvas: true
          })
          // console.log(result.data.data);
          than.drawShareImage()
        } else {
          wx.showModal({
            title: '出错了!',
            content: result.data.error,
            success: function () {
              wx.navigateBack({});
            }
          })
        }

      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (wx.canIUse('button.open-type.openSetting')) {
      wx.getSetting({
        success: res => {
          if (res.authSetting.hasOwnProperty('scope.address')) {
            let isCanAddress = res.authSetting['scope.address']
            than.setData({
              isCanAddress: isCanAddress
            })
          }
        }
      })
    } else {
      this.setData({
        isCanAddress: true
      })
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  //点击分享
  onShareView: function () {
    // console.log(this.data.filter);
    share.showShare(true);
  },

  //监听屏幕滚动 判断上下滚动
  onPageScroll: function (ev) {
    // console.log(ev.scrollTop)
    if (ev.scrollTop >= this.data.pageBottom) {
      this.setData({
        isFixed: true
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    // return 
    let title = this.data.lottery.nick_name + '邀请您参与[' + this.data.lottery.title + ']抽奖';
    let scene = encodeURIComponent(`p=1?id=${this.data.lottery.id}`);

    if (this.data.lottery.share_img) {
      return {
        title: title,
        imageUrl: this.data.lottery.share_img,
        path: `/pages/index/index?scene=${scene}`
      }
    } else {

      return {
        title: title,
        path: `/pages/index/index?scene=${scene}`
      }
    }

  },

  previewImage: function (e) {
    var current = e.target.dataset.url;
    console.log(e)
    wx.previewImage({
      current: current,
      urls: [current]
    })
  },

  drawShareImage: function () {
    let lottery = this.data.lottery

    wx.getImageInfo({
      src: lottery.cover,
      success: function (res) {
        // console.log(sres);
        lottery.cover = res.path
        const context = wx.createCanvasContext('canvas', than)
        var subText = '';
        if (lottery.open_type == 1 && lottery.status == 2) {
          subText += lottery.open_time
          subText += ' 已自动开奖'
        } else if (lottery.open_type == 1 && lottery.status != 2) {
          subText += lottery.open_time
          subText += ' 自动开奖'
        } else if (lottery.open_type == 2 && lottery.status == 2) {
          subText += '满'
          subText += lottery.open_count
          subText += '人 已自动开奖'
        } else if (lottery.open_type == 2 && lottery.status != 2) {
          subText += '满'
          subText += lottery.open_count
          subText += '人 自动开奖'
        }
        context.fillStyle = 'white'
        context.fillRect(0, 0, 375, 300)
        context.drawImage(lottery.cover, 0, 0, 375, 210)
        context.setFontSize(24)
        context.fillStyle = 'black'
        context.fillText('奖品:' + lottery.gifts[0].name + "x" + lottery.gifts[0].count, 40, 250)
        context.fillStyle = 'gray'
        context.setFontSize(18)
        context.fillText(subText, 40, 280)
        context.fill()
        context.draw(false, function () {
          wx.canvasToTempFilePath({
            canvasId: 'canvas',
            x: 0,
            y: 0,
            width: 375,
            height: 300,
            destWidth: 375,
            destHeight: 300,
            success: function (res) {
              //console.log(res.tempFilePath)
              than.data.lottery.share_img = res.tempFilePath
              than.setData({
                showCanvas: false
              })
            },
            fail: function (e) {
              console.log(e)
              than.setData({
                showCanvas: false
              })
            }
          }, than)
        })
      }
    })
  },

  /**
   * 参与抽奖
   */
  onJoin: function () {
    if (app.globalData.userInfo == null) {
      login.show(this, (user) => {
        app.login(user)
        this.requestSubscribeMessage()
      }, msg => {
        wx.showToast({
          title: '登陆已取消',
        })
      })
      return
    }

    this.requestSubscribeMessage()
  },

  requestSubscribeMessage: function(){
    wx.requestSubscribeMessage({
      tmplIds:['rqF1VOKa2koM9D1AwzeQW1GJPP2O3xWDEZx6hEWlC3U'],
      success: ()=> {
        this.join()
      }
    })
  },

  /**
   * 参与抽奖发送网络请求
   */
  join: function () {
    wx.showLoading({
      title: '请求中...',
    })
    qcloud.request({
      url: config.service.joinLotter,
      data: {
        id: this.data.lottery.id,
        form_id: '-1'
      },
      login: true,
      method: 'GET',
      success: result => {
        wx.hideLoading()
        if (result.data.code == 0) {
          var heads = than.data.lottery.heads;
          var avatarUrl = "";
          if (getApp().globalData.userInfo != null) {
            avatarUrl = getApp().globalData.userInfo.avatarUrl;
          }
          heads.push(avatarUrl)
          if (heads.length >= 7) {
            heads.splice(0, 1)
          }
          than.setData({
            'lottery.status': 1,
            'lottery.join_count': than.data.lottery.join_count == null ? 1 : parseInt(than.data.lottery.join_count) + 1,
            'lottery.heads': heads
          })
          util.showSuccess('参与成功！')
          app.globalData.userInfo.joint_count = parseInt(app.globalData.userInfo.joint_count) + 1;
        } else {
          util.showError(result.data.error)
        }
      },
      fail: e => {
        console.log(e)
        util.showError(e.message)
      }
    })
  },

  resetJoin_count(newCount) {
    this.setData({
      'lottery.join_count': newCount
    })
  },

  /**
   * 选择收货地址
   */
  onGoAddress(e) {
    wx.chooseAddress({
      success: function (res) {
        // console.log(res.userName)
        // console.log(res.postalCode)
        // console.log(res.provinceName)
        // console.log(res.cityName)
        // console.log(res.countyName)
        // console.log(res.detailInfo)
        // console.log(res.nationalCode)
        // console.log(res.telNumber)
        let address = res.provinceName + res.cityName + res.countyName + res.detailInfo
        let phone = res.telNumber
        let addressee = res.userName

        wx.showLoading({
          title: '请求中...',
        })
        qcloud.request({
          url: config.service.updateAddreess,
          data: {
            id: than.data.lottery.id,
            address: address,
            phone: phone,
            addressee: addressee,
            form_id: e.detail.formId
          },
          login: true,
          method: 'GET',
          success: function (result) {
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
      fail: function (e) {
        if (e.errMsg == 'chooseAddress:fail auth deny') {
          wx.getSetting({
            success: function (res) {
              if (res.authSetting.hasOwnProperty('scope.address')) {
                let isCanAddress = res.authSetting['scope.address']
                than.setData({
                  isCanAddress: isCanAddress
                })
              }

            }
          })
        } else if (e.errMsg == 'chooseAddress:fail cancel') {

        }

      }
    })
  },

  /**
   * 显示所有参与或者中奖头像
   */
  onShowAll: function () {
    wx.navigateTo({
      url: `/pages/lottery/showAllUser/showAllUser?id=${this.data.lottery.id}&mode=${this.data.lottery.status < 2 ? 1 : 2}&page=0`,
    })
  },

  /**
   * 预览图片
   *  */
  onShowPictures: function (e) {
    let index = e.currentTarget.dataset.index

    wx.previewImage({
      current: this.data.lottery.images[index],
      urls: this.data.lottery.images,
    })
  },

  /**
   * 关闭
   */
  onCloseGift: function () {
    this.setData({
      'lottery.is_confirm_address': 1
    })
  },

  /**
   * 新抽奖
   */
  onNewLottery: function () {
    if (app.globalData.userInfo) {
      wx.navigateTo({
        url: '/pages/lottery/new/new',
      })
    } else {
      login.show(this, (user) => {
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

  /**
   * 公众号显示错误
   */
  onOfficaialAccountShowFail: function (e) {
    console.log(e)
    this.setData({
      showQr: true
    })
  }

})
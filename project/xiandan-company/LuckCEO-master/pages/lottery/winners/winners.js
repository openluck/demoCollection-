// pages/lottery/winners/winners.js
var config = require('../../../config.js')
var qcloud = require('../../../vendor/wafer2-client-sdk/index')
var util = require('../../../utils/util.js')
var than;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winners: [],
    isEmpty: false,
    copyright: `Copyright © ${new Date().getFullYear()} 厚普创优（成都）网络科技有限公司`
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    than = this
    wx.showNavigationBarLoading()
    qcloud.request({
      url: config.service.getWinners,
      data: {
        id: options.id
      },
      method: 'GET',
      login: true,
      success: function(result) {
        wx.hideNavigationBarLoading()

        if (result.data.code == 0) {

          for (var i in result.data.data){
            let key = `notify_msg_time_${than.data.id}_${result.data.data[i].uid}`
            let time = wx.getStorageSync(key)
            result.data.data[i].sendButton = (time == null || new Date() - time > 24 * 60 * 60 * 1000)
          }

          than.setData({
            winners: result.data.data,
            id: options.id,
            isEmpty: result.data.data.length == 0
          })
        } else {
          util.showError(result.data.error)
        }
      },
      fail: function(e) {
        wx.hideNavigationBarLoading()
        util.showError(e.errMsg)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {

  // }
  onNotify: function(e) {
    let index = e.currentTarget.dataset.index
    let winner = this.data.winners[index]
    let key = `notify_msg_time_${than.data.id}_${winner.uid}`
    //check 24 hours only send once msg
    let time = wx.getStorageSync(key)
    if (time == null || new Date() - time > 24 * 60 * 60 * 1000) {
      wx.showLoading({
        title: '发送中',
      })
      qcloud.request({
        url: config.service.notifyAddress,
        data: {
          id: this.data.id,
          uid: winner.uid
        },
        method: 'GET',
        login: true,
        success: function(result) {
          wx.hideLoading()
          if (result.data.code == 0) {
            util.showSuccess('发送成功')
            wx.setStorageSync(key, new Date())
          } else {
            util.showError(result.data.error)
          }
        },
        fail: function(e) {
          wx.hideLoading()
          util.showError(e.errMsg)
        }
      })
    } else {
      util.showModel('提醒', '您之前已经提醒过了，24小时之内只能提醒一次')
    }

  }
})
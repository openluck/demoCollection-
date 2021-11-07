// pages/lottery/showAllUsers/showAllUser.js

var config = require('../../../config.js')
var qcloud = require('../../../vendor/wafer2-client-sdk/index')
var util = require('../../../utils/util.js')
var than;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    heads: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    wx.setNavigationBarTitle({
      title: options.mode == 1 ? '参加名单' : '中奖名单'
    })

    than = this
    wx.showNavigationBarLoading()
    qcloud.request({
      url: config.service.lotterHeads,
      data: {
        id: options.id,
        mode: options.mode,
        page: 0
      },
      method: 'GET',
      success: function(result) {
        wx.hideNavigationBarLoading()
        if (result.data.code == 0) {
          than.setData({
            mode: options.mode,
            loading: false,
            heads: result.data.data
          })
        }
      },
      fail: function(e) {
        wx.hideNavigationBarLoading()
        than.setData({
          mode: options.mode,
          loading: false,
        })
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
    var pages = getCurrentPages()
    var page = pages[pages.length - 2];
    // console.log(this.data.heads.length)
    page.resetJoin_count(this.data.heads == null ? 0 : this.data.heads.length)
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
  // onShareAppMessage: function() {

  // }
})
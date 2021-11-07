// pages/lottery/new/success/success.js
var share = require('../../../../templates/share.js')
let app = getApp()
var than;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    than = this
    wx.hideShareMenu()
    this.setData(JSON.parse(options.json))
    share.init(this, () => {
      let avatarUrl = getApp().globalData.userInfo.avatarUrl;
      let nickName = getApp().globalData.userInfo.nickName;
      wx.navigateTo({
        url: `/pages/share/share?json=${JSON.stringify({
          status: than.data.status,
          nick_name: nickName,
          cover: than.data.cover,
          title: than.data.title,
          gifts: than.data.gifts,
          open_type: than.data.open_type,
          open_time: than.data.open_time,
          open_count: than.data.open_count,
          qr_url: than.data.qr_url,
          avatar: avatarUrl,
        })}`,
      })
    });

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
    pages[pages.length - 2].addPublish_count()
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let scene = encodeURIComponent(`p=1?id=${this.data.id}`);
    return {
      title: this.data.title,
      imageUrl: decodeURIComponent(this.data.share_img),
      path: `/pages/index/index?scene=${scene}`
    }
  },

  onViewDetail: function() {
    wx.redirectTo({
      url: `/pages/lottery/detail/detail?id=${this.data.id}`,
    })
  },

  onShowShare: function() {
    share.showShare(true)
  },

})
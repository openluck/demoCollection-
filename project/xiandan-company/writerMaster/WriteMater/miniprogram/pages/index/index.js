// miniprogram/pages/index/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      books: [],
      bookIndex: 0,
      contents: [],
      tutorialIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBooks()
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 上一课程
   */
  onPrevTutorial: function (){
    if(this.data.tutorialIndex > 0){
      this.setData({
        'tutorialIndex' : this.data.tutorialIndex - 1
      })
    }
  },

  /**
   * 下一课程
   */
  onNextTutorial: function (){
    if(this.data.tutorialIndex + 1 < this.data.contents.length){
      this.setData({
        'tutorialIndex' : this.data.tutorialIndex + 1
      })
    }
  },

  /**
   * 打开课程目录
   */
  onNavMenu: function() {

    let contnts = this.data.books.map(item => item.name)
    wx.showActionSheet({
      itemList: contnts,
      success: res => {
        console.log(res.tapIndex)
        this.setData({
          bookIndex: res.tapIndex
        })
        this.getBookContents(this.data.books[res.tapIndex]._id)
      },
      fail (res) {
        console.log(res.errMsg)
      }
    })
  },

  onGetUserInfo: function (res) {
    console.log("userInfo:", res)

    if(!res.detail.userInfo) return

    wx.showLoading({
      title: '登录中...',
    });

    const db = wx.cloud.database()
    db.collection('users').add({
      data: res.detail.userInfo
    }).then(resp => {
      res.detail.userInfo._id = resp._id;
      app.store.setState({
        userInfo: res.detail.userInfo,
        isRegisted: true
     })
      this.setData({
        isLogin: true
      })
      wx.hideLoading({
        complete: (res) => {},
      })
      this.goClassPage()
    })
  },

  /**
   * 去教程页面
   */
  goClassPage: function(){
    wx.navigateTo({
      url: `/pages/tutorial/tutorial?id=${encodeURI(this.data.contents[this.data.tutorialIndex]._id)}`,
    });
  },

  /**
   * 获取所有的书
   */
  getBooks: function(){
    wx.cloud.callFunction({
      name:'openapi',
      data: {
        action: 'getBooks',
      },
      success: res => {
        console.warn('[云函数] [openapi] books.get 调用成功：', res)
        this.setData({
          books: res.result
        })
        this.getBookContents(res.result[0]._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [openapi] wxacode.get 调用失败：', err)
      }
    })
  },

  getBookContents: function(bookId){
    wx.cloud.callFunction({
      name:'openapi',
      data: {
        action: 'getContents',
        id: bookId
      },
      success: res => {
        console.warn('[云函数] [openapi] contents.get 调用成功：', res)
        this.setData({
          contents: res.result,
          tutorialIndex: 0
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [openapi] contents.get 调用失败：', err)
      }
    })
  }
})
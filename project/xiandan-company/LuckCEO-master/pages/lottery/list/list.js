// pages/lottery/list/list.js
var config = require('../../../config.js')
var qcloud = require('../../../vendor/wafer2-client-sdk/index')
var util = require('../../../utils/util.js')
var than;
var giftsCount = ['一', '两', '三', '四', '五', '六', '七', '八', '九', '十', ]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: true,
    isEmpty: false,
    mode: 1,
    // list: [],
    tabItemList: [],
    status: [' 待开奖', ' 已结束', ' 中奖啦', '未中奖'],
    statusIcons: ['waiting', 'gift', 'happy', 'said'],
    tabs: ["待开奖", "已结束"],
    tabs2: ["待开奖", "已中奖", "未中奖"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: options.mode == 1 ? '我发起的抽奖' : '我参与的抽奖'
    })
    than = this

    wx.getSystemInfo({
      success: function(res) {}
    });
    than.setData({
      mode: options.mode,
      activeIndex: options.index ? options.index : 0
    })
    wx.showNavigationBarLoading()
    qcloud.request({
      url: config.service.myLotterList,
      data: {
        mode: this.data.mode,
        page: 0,
        status: this.data.activeIndex == 0 ? 1 : 3
      },
      method: 'GET',
      login: true,
      success: function(result) {
        wx.hideNavigationBarLoading()
        // console.log('result:', result)
        if (result.data.code == 0) {
          for (var i in result.data.data) {
            if (result.data.data[i].open_time) {
              let time = result.data.data[i].open_time.replace(/-/g, "/"); // 日期格式处理;
              var data = new Date(time)
              result.data.data[i].open_time = util.formatUsuallyTime(data)
            }
            if (than.data.mode == 2) {
              //转换状态 为 0 , 2//未中奖 3已中奖
              if (result.data.data[i].status == 1) {
                if (result.data.data[i].is_win == 1) {
                  result.data.data[i].status = 2;
                } else {
                  result.data.data[i].status = 3;
                }
              }
            }
            result.data.data[i].giftsCount = giftsCount[result.data.data[i].gifts.length - 1]
          }

          than.setData({
            tabItemList: result.data.data,
            isEmpty: result.data.data.length == 0,
            isLoading: false
          })
          // console.log(than.data.tabItemList)
        } else {
          wx.showToast({
            icon: 'warn',
            title: result.data.error
          })
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

  // },

  onItemClick: function(e) {
    let index = e.currentTarget.dataset.index
    let lotter = this.data.tabItemList[index]
    wx.navigateTo({
      url: `/pages/lottery/detail/detail?id=${lotter.id}&mode=${this.data.mode}`,
    })
  },

  onWinners: function(e) {
    let index = e.currentTarget.dataset.index
    let lotter = this.data.tabItemList[index]
    wx.navigateTo({
      url: `/pages/lottery/winners/winners?id=${lotter.id}`,
    })
  },

  tabClick: function(e) {
    // console.log('prvIndex,nextIndex:', than.data.activeIndex, e.currentTarget.id)
    if (than.data.activeIndex != e.currentTarget.id) {
      this.setData({
        sliderOffset: e.currentTarget.offsetLeft,
        activeIndex: e.currentTarget.id,
        isLoading: true
      });
      // console.log('mode,activeIndex:', this.data.mode, e.currentTarget.id);

      let status;
      if (this.data.mode == 1) {
        status = this.data.activeIndex == 0 ? 1 : 2
      } else {
        status = this.data.activeIndex == 0 ? 1 : (this.data.activeIndex == 1 ? 3 : 4)
      }
      // console.log(status)
      qcloud.request({
        url: config.service.myLotterList,
        data: {
          mode: this.data.mode,
          page: 0,
          status: status
        },
        method: 'GET',
        login: true,
        success: function(result) {
          wx.hideNavigationBarLoading()
          // console.log('result:', result)
          if (result.data.code == 0) {

            for (var i in result.data.data) {
              if (result.data.data[i].open_time) {
                let time = result.data.data[i].open_time.replace(/-/g, "/"); // 日期格式处理;
                var data = new Date(time)
                result.data.data[i].open_time = util.formatUsuallyTime(data)
              }
              if (than.mode == 2) {
                //转换状态 为 0 , 2//未中奖 3已中奖
                if (result.data.data[i].status == 1) {
                  if (result.data.data[i].is_win == 1) {
                    result.data.data[i].status = 2;
                  } else {
                    result.data.data[i].status = 3;
                  }
                }
              }

              result.data.data[i].giftsCount = giftsCount[result.data.data[i].gifts.length - 1]
            }

            than.setData({
              tabItemList: result.data.data,
              isEmpty: result.data.data.length == 0,
              isLoading: false
            })
            // console.log('tabItemList',than.data.tabItemList)
          } else {
            wx.showToast({
              icon: 'warn',
              title: result.data.error
            })
          }
        },
        fail: function(e) {
          wx.hideNavigationBarLoading()
          util.showError(e.errMsg)
        }
      })
    }
  }
})
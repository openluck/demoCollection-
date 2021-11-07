// pages/tutorial/tutorial.js
import WxTouchEvent from "wx-touch-event";
let touchEvent = new WxTouchEvent();

const app = getApp()
const device = wx.getSystemInfoSync() // 获取设备信息

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: null,
    contentId: 0,
    classIndex: 0,
    noPaidImage:'',
    noOpenImage:'',
    windowHeight: device.windowHeight,
    assignments: [],
    showAssignments: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('settings').where({
      key: _.in(['no-paid-notice-image', 'on-open-notice-image'])
    }).get().then(res => {
      res.data.forEach(sys => {
        if(sys.key == 'no-paid-notice-image'){
          this.setData({
            noPaidImage: sys.value
          })
        }else if(sys.key == 'on-open-notice-image'){
          this.setData({
            noOpenImage: sys.value
          })
        }
      })
      
    })

    this.getContentDatil(options.id)
    this.setData({
      contentId: options.id,
      classIndex: options.index ? options.index : 0
    })

    touchEvent.bind({ //初始化后绑定事件
      swipe: e => {
        //console.log(e);
        if (e.direction == 'Left') {
          this.onPrevClass()
        } else if (e.direction == 'Right') {
          this.onNextClass()
        }
      },
      doubleTap: function (e) {
        // console.log(e);
      },
      tap: function (e) {
        //console.log(e);
      }.bind(this),
      longTap: function (e) {
        // console.log(e);
      },
      rotate: function (e) {
        //console.log(e)
      }.bind(this),
      pinch: function (e) {
        //console.log(e);
      }

    })
  },

  touchStart: touchEvent.start.bind(touchEvent),
  touchMove: touchEvent.move.bind(touchEvent),
  touchEnd: touchEvent.end.bind(touchEvent),
  touchCancel: touchEvent.cancel.bind(touchEvent),

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
    return {
      title: `${app.store.$state.userInfo.nickName ? app.store.$state.userInfo.nickName : ''}邀请你一起来练习硬笔书法`,
      path: `pages/tutorial/tutorial?id=${this.data.contentId}&index=${this.data.classIndex}`
    }
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
      wx.hideLoading({
        complete: (res) => {},
      })
      this.onTakePicture()
    })
  },

  /**
   * 拍照提交作业
   */
  onTakePicture: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['camera'],
      success: res => {
        // tempFilePath可以作为img标签的src属性显示图片
        console.log(res)
        const classId = this.data.content.classes[this.data.classIndex]._id
        wx.showLoading({
          title: '上传中...',
        });
        wx.cloud.uploadFile({
          cloudPath: `upload/assignments/${classId}/${new Date().getTime()}.jpg`, // 上传至云端的路径
          filePath: res.tempFilePaths[0], // 小程序临时文件路径
          success: res => {
            // 返回文件 ID
            console.log(res.fileID)
            this.createAssignment(classId, res.fileID)
          },
          fail: console.error
        })
      }
    })
  },


  createAssignment: function (classId, fileID) {
    const db = wx.cloud.database()
    db.collection('assignments').add({
      data: {
        classId: classId,
        nickName: app.store.$state.userInfo.nickName,
        headImg: app.store.$state.userInfo.avatarUrl,
        picture: fileID,
        date: new Date()
      }
    }).then(res => {
      wx.hideLoading({
        complete: (res) => {},
      })
      this.getAssignments(classId);
    })
  },

  getAssignments: function (classId) {
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'getAssignments',
        classId: classId
      },
      success: res => {
        console.warn('[云函数] [openapi] assignments.get 调用成功：', res)
        this.setData({
          showAssignments: true,
          assignments: res.result
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [openapi] assignments.get 调用失败：', err)
      }
    })
  },

  onPrevClass: function () {
    if (this.data.classIndex > 0) {
      let index = this.data.classIndex - 1
      this.setData({
        classIndex: index
      })
      this.
      this.getAssignments(this.data.content.classes[index]._id)
    }
  },

  onNextClass: function () {
    if (this.data.classIndex < (this.data.content.classes.length - 1)) {
      let index = this.data.classIndex + 1
      this.setData({
        classIndex: index
      })

      this.getAssignments(this.data.content.classes[index]._id)
    }
  },

  /**
   * 显示大图
   */
  onPreviewImage: function (e) {
    var current = e.currentTarget.dataset.url
    wx.previewImage({
      current: current,
      urls: [current]
    })
  },

  /**
   * 回到上一页
   */
  onBack: function (e) {
    wx.navigateBack();
  },

  getContentDatil: function (id) {
    wx.showNavigationBarLoading();
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'getContentDetail',
        id: id
      },
      success: res => {
        console.warn('[云函数] [openapi] contents.get 调用成功：', res)
        wx.hideNavigationBarLoading();
        this.setData({
          content: res.result
        })
        wx.setNavigationBarTitle({
          title: res.result.tutorial,
        })
        if(res.result.classes.length > 0){
          this.getAssignments(res.result.classes[0]._id)
        }
        
      },
      fail: err => {
        wx.hideNavigationBarLoading()
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [openapi] contents.get 调用失败：', err)
      }
    })
  }
})
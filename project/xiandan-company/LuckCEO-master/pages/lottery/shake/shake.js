var util = require('../../../utils/util.js')
var that;
var qcloud = require('../../../vendor/wafer2-client-sdk/index')
var config = require('../../../config.js')
var audioContext = wx.createInnerAudioContext()
var giftsCount = ['一', '两', '三', '四', '五', '六', '七', '八', '九', '十', ]
// var firstShow = true
Page({
  data: {
    height: "800rpx",
    shaken: false,
    code: 1,
    openType: null,
    winImg: "../../../images/parcel.png",
    openCount: null,
    openTime: null,
    winTitle: null,
    itemId: null,
    shakeLogo: "../../../images/shake_logo.png"
  },
  onLoad(options) {
    that = this;
    wx.getSystemInfo({
      success: function (res) {
        let clientHeight = res.windowHeight;
        let clientWidth = res.windowWidth;
        let ratio = 750 / clientWidth;
        let height = clientHeight * ratio;
        that.setData({
          height: height + "rpx"
        });
      }
    });

    audioContext.src = 'https://wafer-1253463974.cos.ap-guangzhou.myqcloud.com/lottery/audio/shake_sound_male.mp3';
    // audioContext.play()
    audioContext.stop()
    // const audioContext = wx.createInnerAudioContext()
  },

  isShow: false,
  onShow: function () {
    var that = this;
    that.isShow = true;
    wx.onAccelerometerChange(function (e) {
      // console.log(e)
      if (!that.isShow) {
        return
      }
      let lastX = 0
      let lastY = 0
      let lastZ = 0
      let dVlue = 1.8
      let x = e.x
      let y = e.y
      let z = e.z
      var dis = Math.abs(x - lastX) + Math.abs(y - lastY) + Math.abs(z - lastZ);
      // console.log(dis, dVlue)
      if (dis > dVlue && !that.data.shaken) {
        audioContext.src = 'https://wafer-1253463974.cos.ap-guangzhou.myqcloud.com/lottery/audio/shake_sound_male.mp3';
        audioContext.play()
        // if (firstShow) {
        //   wx.playBackgroundAudio({
        //     dataUrl: 'https://wafer-1253463974.cos.ap-guangzhou.myqcloud.com/lottery/audio/shake_sound_male.mp3',
        //   })
        //   firstShow = false
        // }
        that.setData({
          shaken: true
        })
        that.setData({
          shakeLogo: '../../../images/shake_logo.gif'
        })
        wx.showNavigationBarLoading()
        qcloud.request({
          url: config.service.random,
          method: 'GET',
          login: true,
          success: function (result) {
            wx.hideNavigationBarLoading();
            // console.log('reslut:', result);
            if (result.data.code == 0) {
              setTimeout(function () {
                audioContext.src = "https://wafer-1253463974.cos.ap-guangzhou.myqcloud.com/lottery/audio/shake_match.mp3";
                audioContext.play()
              }, 1000)
              let time;
              if (result.data.data.open_time) {
                let opentime = result.data.data.open_time.replace(/-/g, "/"); // 日期格式处理;
                var data = new Date(opentime)
                time = util.formatUsuallyTime(data)
              }

              that.setData({
                giftsCount: giftsCount[result.data.data.gift_count - 1],
                code: result.data.code,
                openType: result.data.data.open_type,
                openCount: result.data.data.open_count,
                openTime: time,
                winImg: result.data.data.cover,
                winTitle: result.data.data.title,
                itemId: result.data.data.id
              })
            } else {
              setTimeout(function () {
                audioContext.src = "https://wafer-1253463974.cos.ap-guangzhou.myqcloud.com/lottery/audio/shake_nomatch.mp3";
                audioContext.play()
              }, 1000)
              that.setData({
                code: result.data.code
              })
            }
          },
          fail: function (e) {
            wx.hideNavigationBarLoading();
            console.log(e);
          }
        })
      };
      lastX = x;
      lastY = y;
      lastZ = z;
    })
  },
  onHide: function () {
    this.isShow = false;
    audioContext.stop()
    if (wx.offAccelerometerChange) wx.offAccelerometerChange()
  },
  onUnload: function () {
    this.isShow = false;
    audioContext.stop()
    if (wx.offAccelerometerChange) wx.offAccelerometerChange()
  },
  setAgain: function () {
    that.setData({
      code: 1,
      shaken: false,
      shakeLogo: '../../../images/shake_logo.png'
    })
  },
  onItemClick: function () {
    wx.navigateTo({
      url: `/pages/lottery/detail/detail?id=${this.data.itemId}`,
    })
  }
})
// // pages/lottery/new/corp/corp.js

import WeCropper from '../../../../we-cropper/dist/we-cropper.js'

const device = wx.getSystemInfoSync() // 获取设备信息

Page({
  data: {
    height: device.windowHeight,
    cropperOpt: {
      id: 'cropper', // 用于手势操作的canvas组件标识符
      targetId: 'targetCropper', // 用于生成截图的canvas组件标识符
      pixelRatio: device.pixelRatio, // 传入设备像素比
      width: device.windowWidth, // 画布宽度
      height: device.windowHeight * 0.92, // 画布高度
      scale: 2.5, // 最大缩放倍数
      zoom: 8, // 缩放系数
      cut: {
        // 裁剪框x轴起点
        x: 1,
        // 裁剪框y轴期起点
        y: (device.windowHeight - 200) / 2,
        width: device.windowWidth - 2, // 裁剪框宽度
        height: 200 // 裁剪框高度
      }
    }
  },

  onLoad(option) {
    // console.log(option)
    const {
      cropperOpt
    } = this.data

    this.cropper = new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
        // console.log(`wecropper is ready for work!`)
      })
      .on('beforeImageLoad', (ctx) => {
        wx.showToast({
          title: '载入中',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        wx.hideToast()
      })

    let initSrc = option.path
    this.cropper.pushOrign(initSrc)
  },

  touchStart(e) {
    this.cropper.touchStart(e)
  },
  touchMove(e) {
    this.cropper.touchMove(e)
  },
  touchEnd(e) {
    this.cropper.touchEnd(e)
  },

  uploadTap() {
    const self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        self.cropper.pushOrign(res.tempFilePaths[0])
      }
    })
  },

  getCropperImage() {
    this.cropper.getCropperImage((tempFilePath) => {
      // tempFilePath 为裁剪后的图片临时路径
      // console.log(tempFilePath)
      if (tempFilePath) {
        var pages = getCurrentPages()
        var page = pages[pages.length - 2];
        if (typeof page.onCutImageCallback === "function") {
          page.onCutImageCallback(tempFilePath)
        }
        wx.navigateBack()
      } else {
        console.log('获取图片失败，请重试!')
      }
    })
  }

})
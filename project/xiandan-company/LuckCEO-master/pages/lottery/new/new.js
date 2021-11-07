// pages/activity/new/new.js
var config = require('../../../config.js')
var util = require('../../../utils/util.js')
var qcloud = require('../../../vendor/wafer2-client-sdk/index')
var than;

var gradeArr = ['一等奖', '二等奖', '三等奖', '四等奖', '五等奖', '六等奖', '七等奖', '八等奖', '九等奖', '十等奖']

Page({
  /**
   * 页面的初始数据
   */
  data: {
    lotteryTitle: '',
    awards: [{
      index: 0,
      grade: '一等奖',
      awardName: '',
      awardCount: ''
    }],
    images: [],
    intro: '',
    intro_count: 0,
    openType: 1,
    isSubmiting: false,
    openTime: "12:00",
    dateSelect: [0, 0],
    dateRange: [
      ['今天', '明天', '后天', '大后天', '第四天', '第五天', '第七天'],
      ['凌晨12点', '凌晨1点', '凌晨2点', '凌晨3点', '凌晨4点',
        '凌晨5点', '上午6点', '上午7点', '上午8点', '上午9点',
        '上午10点', '上午11点', '上午12点', '下午1点', '下午2点', '下午3点',
        '下午4点', '下午5点', '晚上6点', '晚上7点', '晚上8点', '晚上9点',
        '晚上10点', '晚上11点'
      ]
    ],
    isChecked: false,
    openCount: '',
    textareaValue: ''
  },

  //奖品名称、份数input层级问题解决
  showAwardInput(e) {
    // console.log(e)
    let index = e.currentTarget.id.charAt(e.currentTarget.id.length - 1)
    let prop = e.currentTarget.id.substring(0, e.currentTarget.id.length - 1)
    if (prop == 'awardName') {
      let isShowAwardName = 'awards[' + index + '].' + 'isShowAwardName'
      this.setData({
        [isShowAwardName]: true
      })
    } else {
      let isShowAwardCount = 'awards[' + index + '].' + 'isShowAwardCount'
      this.setData({
        [isShowAwardCount]: true
      })
    }
  },

  disfocus(e) {
    // console.log(e)
    if (e.currentTarget.id == 'lotteryTitle') {
      if (this.data.titleTipFlag) {
        if (e.detail.value == '') {
          this.setData({
            titleTipFlag: true
          })
        } else {
          this.setData({
            titleTipFlag: false
          })
        }
      }
    } else {
      //input失焦修改data
      let index = e.currentTarget.id.charAt(e.currentTarget.id.length - 1)
      let prop = e.currentTarget.id.substring(0, e.currentTarget.id.length - 1)
      let value = e.detail.value
      if (prop == 'awardName') {
        let isShowAwardName = 'awards[' + index + '].' + 'isShowAwardName'
        this.setData({
          [isShowAwardName]: false
        })
      } else {
        let isShowAwardCount = 'awards[' + index + '].' + 'isShowAwardCount'
        this.setData({
          [isShowAwardCount]: false
        })
      }
      let key = 'awards[' + index + '].' + prop
      this.setData({
        [key]: value
      })

      //输入提示的显示
      let tipFlag = prop == 'awardName' ? this.data.awards[index].nameTipFlag : this.data.awards[index].countTipFlag
      if (tipFlag) {
        let flagKey = prop == 'awardName' ? 'awards[' + index + ']nameTipFlag' : 'awards[' + index + ']countTipFlag'
        if (this.data.awards[index][prop] == '') {
          this.setData({
            [flagKey]: true
          })
        } else {
          this.setData({
            [flagKey]: false
          })
        }
      }
    }

  },


  //开奖人数input层级问题解决
  showOpenCount() {
    this.setData({
      isShowOpenCount: true
    })
  },
  hideOpenCount(e) {
    let value = e.detail.value
    this.setData({
      openCount: value,
      isShowOpenCount: false
    })
  },

  //抽奖说明textarea层级问题解决
  showTextarea() {
    this.setData({
      isShowTextarea: true
    })
  },
  
  hideTextarea(e) {
    let value = e.detail.value
    this.setData({
      textareaValue: value,
      isShowTextarea: false
    })
  },


  submitData: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    than = this;
    var date = new Date()
    var time = date.getTime();
    date.setTime(time + 3600000)
    date.setMinutes(0)
    date.setSeconds(0)

    var dates = []
    for (var i = 0; i < 7; i++) {
      dates[i] = util.formartDate(new Date(time + i * 86400000))
    }

    this.setData({
      openTime: util.formatUsuallyTime(date),
      openDate: date,
      dateSelect: [0, date.getHours()],
      'dateRange[0]': dates
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
  // onShareAppMessage: function() {

  // },

  onChangePicture: function() {
    wx.chooseImage({
      count: 1,
      sizeType: 'original',
      success: function(res) {
        wx.navigateTo({
          url: `/pages/lottery/new/corp/corp?path=${res.tempFilePaths[0]}&ratio=${9/16}`,
        })
      },
    })
  },

  onCutImageCallback: function(path) {
    than.setData({
      cover: path
    })
  },

  onAddImages: function() {
    wx.chooseImage({
      count: 9 - this.data.images.length,
      sizeType: 'compressed',
      success: function(res) {
        than.setData({
          images: than.data.images.concat(res.tempFilePaths),
        })
      },
    })
  },

  onImageRemove: function(e) {
    let index = e.currentTarget.dataset.index
    var images = than.data.images;
    images.splice(index, 1)
    this.setData({
      images: images,
    })
  },

  onAddAward: function() {
    let awards = this.data.awards
    awards.push({
      grade: gradeArr[awards.length],
      index: awards.length,
      awardName: '',
      awardCount: ''
    })
    this.setData({
      awards: awards
    })
  },

  onRemoveAward: function(e) {
    // console.log(e)
    wx.showModal({
      title: '删除',
      content: '您确认要删除当前奖品吗?',
      success: function(res) {
        if (res.confirm) {
          let awards = than.data.awards
          awards.splice(e.currentTarget.id, 1)
          than.setData({
            awards: awards
          })
          let newAwardsArr=than.data.awards
          for (let i=e.currentTarget.id;i<newAwardsArr.length;i++) {
            newAwardsArr[i].index=i;
            newAwardsArr[i].grade=gradeArr[i]
          }
          than.setData({
            awards: newAwardsArr
          })
        }
      }
    })
  },

  onTitleInputChanged: function(e){
    this.setData({
      lotteryTitle: e.detail.value
    })
  },

  onIntroChange: function(e) {
    this.setData({
      intro: e.detail.value,
      intro_count: e.detail.value.length
    })
  },

  radioChange: function(e) {
    // console.log(e)

    let value = e.currentTarget.dataset['index'];
    // let value = e.detail.value
    this.setData({
      openType: value
    })
  },

  bindDateChange: function(e) {

    var date = new Date()
    date.setHours(e.detail.value[1])
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
    date.setTime(date.getTime() + e.detail.value[0] * 86400000)


    if (date - new Date() <= 0) {
      util.showModel('提示', '时间必须在当前时期之后')
      this.setData({
        dateSelect: this.setData.dateSelect
      })
      return
    }
    this.setData({
      openTime: util.formatUsuallyTime(date),
      openDate: date,
      dateSelect: e.detail.value
    })
  },

  onShowPictures: function(e) {
    let index = e.currentTarget.dataset.index

    wx.previewImage({
      current: this.data.images[index],
      urls: this.data.images,
    })
  },

  showCover: function() {
    if (this.data.cover) {
      wx.previewImage({
        urls: [this.data.cover],
      })
    }
  },

  checkedChange: function() {
    this.setData({
      isChecked: !this.data.isChecked
    })
  },

  formSubmit: function(e) {
    // console.log(e)
    // console.log(this.data.awards)
    if (this.data.isSubmiting) return

    if (!this.data.cover) {
      util.awardInfoShowModel('请选择封面图片')
      return
    }

    if (!this.data.lotteryTitle) {
      util.awardInfoShowModel('抽奖标题不能为空')
      this.setData({
        titleTipFlag: true
      })
      return
    } else {
      this.setData({
        titleTipFlag: false
      })
    }

    for (var i in this.data.awards) {
      let name = this.data.awards[i].awardName
      let nameKey = 'awards[' + i + '].nameTipFlag'
      if (!name) {
        this.setData({
          [nameKey]: true
        })
        util.awardInfoShowModel('奖品名称不能为空')
        return
      } else {
        this.setData({
          [nameKey]: false
        })
      }
      let count = parseInt(this.data.awards[i].awardCount)
      let countKey = 'awards[' + i + '].countTipFlag'
      if (isNaN(count) || count <= 0) {
        this.setData({
          [countKey]: true
        })
        util.awardInfoShowModel('奖品数量至少为1')
        return
      } else {
        this.setData({
          [countKey]: false
        })
      }
    }

    if ((this.data.openType == 2 && this.data.openCount < 2) || (this.data.openType == 2 && isNaN(this.data.openCount))) {
      util.awardInfoShowModel('开奖人数必须大于1')
      return
    }

    if (this.data.textareaValue == '') {
      util.awardInfoShowModel('抽奖说明不能为空')
      return
    }

    this.submitData.cover = this.data.cover
    this.submitData.title = this.data.lotteryTitle
    this.submitData.intro = this.data.textareaValue
    this.submitData.gifts = []
    this.submitData.form_id = '-1'
    this.submitData.is_open = this.data.isChecked ? 1 : 0
    for (var i in this.data.awards) {
      let name = this.data.awards[i].awardName
      let count = this.data.awards[i].awardCount;
      this.submitData.gifts.push({
        name: name,
        count: count
      })
    }
    this.submitData.open_type = this.data.openType;
    if (this.data.openType == 1) {
      this.submitData.open_time = util.formatStandardTime(this.data.openDate)
    } else if (this.data.openType == 2) {
      this.submitData.open_count = this.data.openCount
    }

    wx.requestSubscribeMessage({
      tmplIds:['rqF1VOKa2koM9D1AwzeQW1GJPP2O3xWDEZx6hEWlC3U'],
      success: ()=> {
        this.setData({
          isSubmiting: true
        })
        wx.showLoading({
          title: '请求中...',
        })
        wx.uploadFile({
          url: config.service.uploadUrl,
          filePath: this.data.cover,
          name: 'file',
          formData: {
            'folder': config.uploadFolder.cover
          },
          success: function(result) {
            if (result.statusCode != 200) {
              wx.hideLoading()
              util.showError(result.data)
              return;
            }
            var data = JSON.parse(result.data)
            if (data.code == 0) {
    
              than.submitData.cover = data.data.imgUrl
    
              util.uploadFile(config.service.uploadUrl,
                than.data.images,
                'file', {
                  'folder': config.uploadFolder.pictures
                }, result => {
                  than.submitData.images = result.images
                  than.onSubmit()
                }, e => {
                  wx.hideLoading()
                  than.setData({
                    isSubmiting: false
                  })
                  util.showError(e.errMsg)
                })
    
            } else {
              wx.hideLoading()
              than.setData({
                isSubmiting: false
              })
              util.showModel('错误', data.error)
            }
          },
          fail: function(e) {
            than.setData({
              isSubmiting: false
            })
            wx.hideLoading()
            util.showModel('错误', e.errMsg)
          }
        })
      },
      fail: res => {
        console.log(res)
      }
    })
  },

  onSubmit: function() {
    qcloud.request({
      url: config.service.publishLotter,
      data: than.submitData,
      login: true,
      method: 'POST',
      success: function(result) {
        if (result.statusCode != 200) {
          wx.hideLoading()
          than.setData({
            isSubmiting: false
          })
          util.showModel('错误', result.data)
          return;
        }

        if (result.data.code == 0) {

          than.setData({
            showCanvas: true,
          })

          // let title = getApp().globalData.userInfo.nickName + '邀请您参与[' + than.submitData.title + ']抽奖';

          const context = wx.createCanvasContext('canvas', than)
          var subText = '';
          if (than.submitData.open_type == 1) {
            subText += than.submitData.open_time
            subText += ' 自动开奖'
          } else if (than.submitData.open_type == 2) {
            subText += '满'
            subText += than.submitData.open_count
            subText += '人 自动开奖'
          }
          context.setFillStyle('white')
          context.fillRect(0, 0, 375, 300)
          context.drawImage(than.data.cover, 0, 0, 375, 210)
          context.setFontSize(24)
          context.setFillStyle('black')
          let gift = than.submitData.gifts[0].name + "x" + than.submitData.gifts[0].count
          context.fillText('奖品:' + gift, 40, 250)
          context.setFillStyle('gray')
          context.setFontSize(18)
          context.fillText(subText, 40, 280)
          context.fill()
          context.draw(false, function() {
            wx.canvasToTempFilePath({
              canvasId: 'canvas',
              x: 0,
              y: 0,
              width: 375,
              height: 300,
              destWidth: 375,
              destHeight: 300,
              success: function(res) {
                // app.globalData.userInfo.publish_count = parseInt(app.globalData.userInfo.publish_count) + 1;
                // console.log(res.tempFilePath)
                than.setData({
                  showCanvas: false
                })

                wx.redirectTo({
                  url: `/pages/lottery/new/success/success?json= ${
                    JSON.stringify({
                      id: result.data.data.lottery_id,
                      share_img: encodeURIComponent(res.tempFilePath),
                      status: 0,
                      cover: than.submitData.cover,
                      title: than.submitData.title,
                      gifts: than.submitData.gifts,
                      open_type: than.submitData.open_type,
                      open_time: than.submitData.open_time,
                      open_count: than.submitData.open_count,
                      qr_url: result.data.data.qr,
                    })
                }`,
                })
              },
              fail: function(e) {
                console.log(e)
                than.setData({
                  showCanvas: false
                })
              }
            }, than)
          })


        } else {
          wx.hideLoading()
          than.setData({
            isSubmiting: false
          })
          util.showModel('错误', result.data.error)
        }
      },
      fail: e => {
        than.setData({
          isSubmiting: false
        })
        wx.hideLoading()
        util.showModel('错误', e.errMsg)
      }
    })
  }
})
// pages/share/share.js
var than;
let giftLabs = ['一等奖:', '二等奖:', '三等奖:', '四等奖:', '五等奖:', '六等奖:', '七等奖:', '八等奖:', '九等奖:', '十等奖:'];
var info;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    width: 1080,
    height: 1840,
    showButton: false,
    loading: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    than = this
    info = JSON.parse(options.json)
    this.setData({
      height: 1840 + (info.gifts.length - 1) * 87
    })

    // //check 缓存是否存在
    // let path = wx.getStorageSync(`poster.${options.id}`)
    // if (path){

    //   wx.previewImage({
    //     urls: [path]
    //   })

    //   than.setData({
    //     path: path,
    //     loading: false,
    //     showButton: true,
    //   })


    //   return;
    // }

    this.downloadImage({}, 0, paths => {
      info.head = paths.head;
      info.cover = paths.cover;
      info.qr = paths.qr;

      // setTimeout(()=>{
      this.onDraw();
      // } ,100);
    })
  },

  downloadImage: function(paths, index, callback) {
    var path;
    if (index == 0) {
      path = info.avatar
    } else if (index == 1) {
      path = info.cover
    } else if (index == 2) {
      path = info.qr_url
    }

    if (path) {
      wx.getImageInfo({
        src: path,
        success: function(res) {
          console.log(res)
          if (index == 0) {
            paths.head = res.path
            than.downloadImage(paths, 1, callback)
          } else if (index == 1) {
            paths.cover = res.path
            than.downloadImage(paths, 2, callback)
          } else if (index == 2) {
            paths.qr = res.path
            callback(paths)
          }

        },
        fail: function(msg) {
          console.log(msg)
          if (index == 0) {
            paths.head = path
            than.downloadImage(paths, 1, callback)
          } else if (index == 1) {
            paths.cover = path
            than.downloadImage(paths, 2, callback)
          } else if (index == 2) {
            paths.qr = path
            callback(paths)
          }
        }
      })
    } else {
      if (index == 0) {
        paths.head = path
        than.downloadImage(paths, 1, callback)
      } else if (index == 1) {
        paths.cover = path
        than.downloadImage(paths, 2, callback)
      } else if (index == 2) {
        paths.qr = path
        callback(paths)
      }
    }

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

  onDraw: function() {
    console.log(info)
    const ctx = wx.createCanvasContext('canvas', this);
    // ctx.scale(device.pixelRatio, device.pixelRatio)
    // let img = new Image()
    // img.src = '../../../images/poster_title.png';

    ctx.setFillStyle('#bc4343');
    ctx.fillRect(0, 0, this.data.width, this.data.height);

    // ctx.save()
    // ctx.beginPath()
    // ctx.arc(540, 166.5, 110.5, 0, 2 * Math.PI)
    // ctx.clip()
    // ctx.restore()


    // ctx.setFontSize(70)
    // ctx.setFillStyle('rgb(225,215,138)')
    // ctx.setTextAlign('center')
    // ctx.setTextBaseline('top')
    // ctx.fillText('邀请您参与抽奖', this.data.width / 2, 364  );
    ctx.drawImage('/images/poster_title.png', 184, 58, 714, 118);
    ctx.drawImage('/images/poster_bg.png', 0, this.data.height - 792, 1080, 792);
    ctx.setFillStyle('white');
    this.roundRect(ctx, 61.4, 250, 960, this.data.height - 374, 20);
    if (info.head) {
      ctx.save();
      ctx.beginPath();
      // 绘制圆，参数（x坐标，y坐标，圆半径，起始角度，终止角度）
      ctx.arc(542, 378, 78, 0, 2 * Math.PI);
      // 剪切形状
      ctx.clip();
      // 绘制头像，参数（图片资源，x坐标，y坐标，宽度，高度）
      ctx.drawImage(info.head, 464, 300, 156, 156);

      ctx.setStrokeStyle("#707070");
      ctx.setLineWidth(3);
      ctx.stroke();

      ctx.restore();
    } else {
      ctx.drawImage('/images/icon.png', 464, 300, 156, 156);
    }
    // if (info.cover)
    ctx.setFillStyle('#333333');
    ctx.setTextAlign('center');
    ctx.setTextBaseline('top');
    //normal,
    ctx.font = 'bold 40px PingFang SC';
    ctx.fillText(info.nick_name, 540, 490);
    // ctx.fillText(info.nickName, this.data.width / 2 + 1, 450);
    ctx.save()
    this.roundRect(ctx, 141, 605, 789, 449, 20, '#fff', null);
    ctx.clip()
    ctx.drawImage(info.cover, 141, 605, 789, 449)
    ctx.restore()

    ctx.setFontSize(40);
    ctx.setFillStyle('#333333');
    ctx.setTextBaseline('top');
    ctx.setTextAlign('left');
    ctx.fillText(info.title, 141, 1100);

    ctx.setFillStyle('#666666');
    ctx.setTextBaseline('top');
    ctx.setTextAlign('right');
    ctx.font = 'normal 35px PingFang SC';
    if (info.status > 1) {
      ctx.fillText('已开奖', 940, 1106);
    } else {
      ctx.fillText('待开奖', 940, 1106);
    }

    ctx.setTextAlign('left')
    ctx.font = 'bold 35px PingFang SC';
    if (info.open_type == 1) {
      ctx.fillText(info.open_time + ' 自动开奖', 141, 1175);
    } else {
      ctx.fillText('满' + info.open_count + '人' + '自动开奖', 141, 1175);
    }
    ctx.setFillStyle('#999999');
    ctx.setTextBaseline('top');
    ctx.setTextAlign('left');
    ctx.font = 'bold 35px PingFang SC';
    for (let i = 0; i < info.gifts.length; i++) {
      ctx.fillText(giftLabs[i] + info.gifts[i].name + ' X' + info.gifts[i].count, 141, 1264 + (i * 87));
    }

    // ctx.fillText('奖品:' + info.gift, 99.2   + 1, 1158.5  );

    // if (info.qr)
    ctx.drawImage(info.qr, 449, this.data.height - 502, 184, 184);

    ctx.setFillStyle('#666666');
    ctx.setTextBaseline('bottom');
    ctx.setTextAlign('center');
    ctx.font = 'bold 35px PingFang SC';
    ctx.fillText('长按识别小程序参与抽奖', 540, this.data.height - 245);

    ctx.setFillStyle('#BA4040');
    ctx.setTextBaseline('bottom');
    ctx.setTextAlign('center');
    ctx.font = 'bold 29px PingFang SC';
    ctx.fillText('抽奖CEO ©版权所有', 540, this.data.height - 164);

    ctx.draw(false, setTimeout(() => {
      this.onSave()
    }, 1000))
  },

  onShare: function() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.path
    })
  },

  onSave() {
    wx.canvasToTempFilePath({
      canvasId: 'canvas',
      width: than.data.width,
      height: than.data.height,
      success: res => {

        wx.previewImage({
          urls: [res.tempFilePath]
        })

        than.setData({
          path: res.tempFilePath,
          loading: false,
          showButton: true,
        })

      },
      fail: function(e) {
        console.log(e)
        wx.showToast({
          title: '生成图片失败!',
        })
        wx.navigateBack({

        })
      }
    }, this)
  },
  onPreview: function() {
    wx.previewImage({
      urls: [this.data.path],
    })
  },
  roundRect(ctx, x, y, w, h, r, c = '#fff', stroke = '#707070') {
    if (w < 2 * r) {
      r = w / 2;
    }
    if (h < 2 * r) {
      r = h / 2;
    }

    ctx.beginPath();
    ctx.fillStyle = c;
    ctx.setStrokeStyle(stroke)

    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.lineTo(x + w, y + r);

    ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2);
    ctx.lineTo(x + w, y + h - r);
    ctx.lineTo(x + w - r, y + h);

    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5);
    ctx.lineTo(x + r, y + h);
    ctx.lineTo(x, y + h - r);

    ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI);
    ctx.lineTo(x, y + r);
    ctx.lineTo(x + r, y);

    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  },


})
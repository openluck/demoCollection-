const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatStandardTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}


const formatUsuallyTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute].map(formatNumber).join(':')
}

const formartDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('/')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


// 显示繁忙提示
var showBusy = text => wx.showToast({
  title: text,
  icon: 'loading',
  duration: 10000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
  title: text,
  icon: 'success'
})

//显示错误提示
var showError = text => wx.showToast({
  title: text,
  image:'/images/err.svg'
})

// 显示失败提示
var showModel = (title, content) => {
  wx.hideToast();

  wx.showModal({
    title,
    content: JSON.stringify(content),
    showCancel: false
  })
}

//发起抽奖信息填写提示
var awardInfoShowModel = text => wx.showModal({
  title: '提示',
  showCancel: false,
  content: text
})


var count = 0
var images = []
var SuccessCallback = {
  create: function(index, length, success, fail) {
    var callback = {}
    callback.success = success
    callback.fail = fail
    callback.index = index
    callback.length = length
    callback.success = function(result) {
      if (result.statusCode != 200) {
        if (fail) {
          fail({
            errMsg: result.data
          })
        }
        return;
        ƒ
      }
      var data = JSON.parse(result.data)
      if (data.code == 0) {
        images[this.index] = data.data.imgUrl
        if (++count == length) {
          if (success) {
            success({
              images: images
            })
          }
          return
        }

      } else {
        if (fail) {
          fail({
            errMsg: result.data.error
          })
        }

        return;
      }
    }
    return callback
  }
}

var uploadFile = (url, filePaths, name, formData, success, fail) => {

  if (filePaths.length == 0) {
    if (success) {
      success({
        images: []
      })
    }
    return
  }

  images = new Array(filePaths.length)
  count = 0
  for (var i in filePaths) {

    let callback = SuccessCallback.create(i, filePaths.length, success, fail)

    wx.uploadFile({
      url: url,
      filePath: filePaths[i],
      name: name,
      formData: formData,
      success: result => {
        callback.success(result)
      },
      fail: function(e) {
        if (fail) {
          fail(e)
        }
      }
    })
  }

}

module.exports = {
  formatTime,
  formatUsuallyTime,
  formatStandardTime,
  formartDate,
  showBusy,
  showSuccess,
  showError,
  showModel,
  uploadFile,
  awardInfoShowModel
}
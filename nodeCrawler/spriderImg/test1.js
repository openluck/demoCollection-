const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')
let path = require('path')
const axios = require('axios')

let url = 'https://www.wangt.cc/2021/10/%E4%B8%80%E5%BC%A0%E6%80%9D%E7%BB%B4%E5%AF%BC%E5%9B%BE%E5%85%A5%E9%97%A8react/'
request(url, async (err, response, body) => {
  let $ = cheerio.load(body)
  $('.article-content img').each((index, item) => {
    // 获取图片路径
    let imgUrl = $(item).attr('src')
    // 下载图片
    axios.get(imgUrl, { responseType: 'stream' }).then((res) => {
      //  获取图片路径
      let imgUrl = $(item).attr('src')
      //  获取图片的扩展名
      let extName = path.extname(imgUrl)
      //  图片写入的路径和名字
      let target = `img${index}.${extName}`
      //  在目标 img 路径下创建写入流
      let ws = fs.createWriteStream(target)
      //  下载图片
      axios.get(imgUrl, { responseType: 'stream' }).then(function (res) {
        //  pipe导入图片流资源，利用写入流写入到本地
        res.data.pipe(ws)
        //  提示完成
        console.log('图片下载完成:' + target)
        //  监听流完成
        res.data.on('close', function () {
          //  关闭写入流
          ws.close()
        })
      })
    })
  })
})

// function setImgName(index) {
//   $('')
// }
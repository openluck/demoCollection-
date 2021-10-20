//  引入模块
let url = require('url')
// console.log(url)

//  解析网址
let httpUrl = 'https://www.mi.com/mix4?test=123'
let urlObj = url.parse(httpUrl)
console.log(urlObj)

//  合成网址
//  目标网址
let targetUrl = "http://www.taobao.com/"
//  添加网址
let addUrl = "./theverwang/node.html"
let outUrl = url.resolve(targetUrl, addUrl)
console.log(outUrl)
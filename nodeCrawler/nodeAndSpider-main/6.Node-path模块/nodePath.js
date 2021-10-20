//  引入模块
let path = require('path')
let fs = require('fs')

//  获取路径信息的扩展名
let strPath = 'http://nodejs.cn/api/fs.html'
let info = path.extname(strPath)
console.log('对应路径的文件后缀为：',info)

//  路径或路径片段解析为绝对路径
let arr = ['/Thever','Wang','learn']
let info1 = path.resolve(...arr)
console.log(info1)

//  __dirname: 获取当前执行文件所在目录的完整目录名
//  __filename: 获得当前执行文件的带有完整绝对路径的文件名
//  process.cwd():  获得当前执行node命令时候的文件目录名

//  获取当前执行文件所在目录的完整目录名
console.log(__dirname)
//  解构
//  let info2 = path.join(...[__dirname,'Thever','Wang','learn'])
//  直接传
let info2 = path.join(__dirname,'Thever','Wang','learn')
console.log(info2)

//  做个符合本地文件构造的url
let str = "http://www.jojo.com/news/china.html"
//  通过/来切割内容，解析出请求目录
let newArray = str.split('/')
console.log(newArray)
let wantNew = newArray.slice(newArray.length-2,newArray.length)
console.log(wantNew)
//  获取本地文件路径
let filePath = path.join(__dirname, ...wantNew)
//  读取本地内容
fs.readFile(filePath,{flag:'r', encoding:'utf-8'}, function(err,data){
    if(err){
        console.log(err)
    }else{
        console.log('读取文件成功')
        console.log(data)
    }
})
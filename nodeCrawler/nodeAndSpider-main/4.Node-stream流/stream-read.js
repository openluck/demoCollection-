//  引入模块
let fs = require('fs')
let data = ''

// //  创建可读写入流
// let readstream = fs.createReadStream('read.txt')

// //  设置编码utf-8
// readstream.setEncoding('utf-8')

//  写法可合并为
let readstream = fs.createReadStream('read.txt',{flags:'r',encoding:'utf-8'})

//  处理流事件
//  读取事件
readstream.on('data', function(chunk){
    data += chunk
})

//  读取完毕
readstream.on('end', function(){
    console.log(data)
})

//  读取报错
readstream.on('error', function(err){
    console.log(err.stack)
})

console.log('程序执行完毕')
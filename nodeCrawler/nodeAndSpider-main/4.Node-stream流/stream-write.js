let fs = require('fs')
let data = '呀咧呀咧，真是够了'

//  创建一个可以写入的流，写到文件 write.txt
let writeStream = fs.createWriteStream('write.txt')

//  使用 uft-8 编码写入数据
writeStream.write(data, 'utf-8')
writeStream.write('欧拉欧拉欧拉~', 'utf-8')

//  标记文件末尾
writeStream.end()

//  处理流事件
//  流完成
writeStream.on('finish',function(){
    console.log('写入完成')
})

//  流报错
writeStream.on('error',function(err){
    console.log(err.stack)
})

console.log('程序执行完毕')


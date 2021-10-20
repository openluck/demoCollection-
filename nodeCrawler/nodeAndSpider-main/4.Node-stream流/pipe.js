let fs = require('fs')

//  创建可读流
let readStream = fs.createReadStream('pipe-input.txt')

//  创建可写流
let writeStream = fs.createWriteStream('pipe-out.txt')

// 管道读写操作
// 读取 pipe-input.txt 文件内容，并将内容写入到 pipe-out.txt 文件中
readStream.pipe(writeStream)
console.log('程序执行完毕')
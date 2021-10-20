//  引入模块
let fs = require('fs')
let zlib = require('zlib')

//  解压 compress.txt.gz 文件为 decompress.txt
fs.createReadStream('compress.txt.gz')
    .pipe(zlib.createGunzip())
    .pipe(fs.createWriteStream('decompress.txt'))

console.log('文件解压完成')
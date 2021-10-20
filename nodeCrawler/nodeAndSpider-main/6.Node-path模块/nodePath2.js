//  引入模块
let path = require('path')

//  获取当前执行文件的目录
console.log(__dirname)

//  获取当前的执行文件
console.log(__filename)

//  获取当前文件扩展名
console.log(path.extname(__filename))

//  解析路径,获取根路径,目录,扩展名,文件名称
console.log(path.parse(__filename))
// 1.在没有任何内容导出的情况下获取某个文件的内容，会得到一个空对象
// 2.require获取文件的路径时，可以不加后缀名，默认的后缀名就是js

// //  直接导入
// let use = require('./a')
// console.log(use)

//  结构赋值
let {a} = require('./a')
console.log(a)
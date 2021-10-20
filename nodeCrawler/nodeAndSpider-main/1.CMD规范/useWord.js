//  模块只会初始化一次
let a = require('./word')
let b = require('./word')
console.log(a)
console.log(b)
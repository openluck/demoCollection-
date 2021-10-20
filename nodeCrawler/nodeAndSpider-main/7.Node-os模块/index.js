//  os模块用来获取当前系统的信息
let os = require('os')
// console.log(os)

//  获取当前系统的CPU信息
console.log(os.cpus())

//  查看CPU架构
console.log(os.arch())

//  获取内存信息
console.log(os.totalmem())

//  查看闲置内存量
console.log(os.freemem())

//  查看系统平台
console.log(os.platform())
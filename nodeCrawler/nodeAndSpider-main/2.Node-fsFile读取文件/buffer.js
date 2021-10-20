//  介绍buffer缓冲区
//  1.数组不能进行二进制数据的操作
//  2.js数组不像java、python等语言效率高
//  3.buffer内存空间开辟出固定大小的内存
//  buffer一般用于神经网络

// //  使用buffer
// let str = 'hello, buffer'
// //  将字符串变成二进制存储
// let buf = Buffer.from(str)
// //  显示二进制
// console.log(buf)
// //  转化成字符串输出数据
// console.log(buf.toString())

//  开辟一个空的buffer(缓冲区)
let buf1 = Buffer.alloc(10)
// buf1[0] = 256
console.log(buf1)

//  allocUnsafe 相对于 alloc 不会对原本磁盘的空间进行重置，会保留默认信息，但是效率高
let buf2 = Buffer.allocUnsafe(10)
console.log(buf2)
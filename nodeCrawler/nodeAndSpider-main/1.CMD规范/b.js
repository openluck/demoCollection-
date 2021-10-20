let b = 2
let c = 3

//  也可以使用module.exports来实现模块导出
//  exports === module.exports
// 系统默认设置了module.exports.b = b
// exports.b = b
// module.exports.c = c

//  当然你也可以直接导出对象来替换默认的对象
//  module.exports 可以单个赋值或者整个赋值
module.exports = {a:1,b:2}

//  注意使用exports时，只能单个设置属性
// exports = {a:1,b:2} // 无效，因为会改变 exports 指向 module.exports 的指针

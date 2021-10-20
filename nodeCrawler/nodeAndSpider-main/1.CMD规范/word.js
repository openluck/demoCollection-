let a = 'a'
let b = 'b'

console.log(`/*word.js 模块被初始化了*/`)
console.log(`a:${a}`)
console.log(`b:${b}`)
console.log(`/*word.js 模块被初始化了*/`)

exports.a = a
module.exports.b = b
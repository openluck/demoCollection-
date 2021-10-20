//  读取文件
//  引入fs模块
let fs = require('fs')

//  node读写文件有同步和异步的接口
// //  同步读取会阻塞JS
// let content = fs.readFileSync('hello.txt',{flag:'r',encoding:'utf-8'})
// console.log(content)

// //  异步读取
// fs.readFile('hello.txt',{flag:'r', encoding:"utf-8"},(err, data) => {
//     if(err){
//         console.log(err)
//         throw err
//     }
//     console.log(456)
// })
// console.log(123)

//  封装异步
//  用promise处理读取文件返回
function fsRead(path){
    return new Promise(function(resolve,reject){
        fs.readFile(path,{flag:'r', encoding:"utf-8"},(err, data) => {
            if(err){
                //  有错误，执行失败
                console.log(err)
                reject(err)
            }else{
                //  没错误，执行成功
                resolve(data)
            }
        })
    })
}

// //  直接读取
// fsRead('hello.txt').then(resolve => {
//     console.log(resolve)
// }).catch(reject => {
//     console.log(reject)
// })

// //  用async await来获取异步的值
// async function readContent(){
//     let content = await fsRead('hello.txt')
//     console.log(content)
// }
// readContent()

//  用 async await 函数来处理异步，读取多个文件
async function readMany(){
    let content = await fsRead('hello.txt')
    let content2 = await fsRead('hello2.txt')
    let content3 = await fsRead('hello3.txt')
    console.log(content)
    console.log(content2)
    console.log(content3)
}
readMany()


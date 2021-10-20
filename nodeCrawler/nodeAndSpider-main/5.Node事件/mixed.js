//  模拟读取文件
//  引入模块
let fs = require('fs')
let events = require('events')
let emitter = new events.EventEmitter()

//  封装读取文件的函数
function ReadFile(path){
    return new Promise(function(resolve,reject){
        fs.readFile(path,{flag:'r', encoding:'utf-8'},function(err,data){
            if(err){
                reject(err)
            }else{
                resolve(data)
            }
        })
    })
}

//  监听事件
emitter.on('ReadFile',function(data){
    console.log('ReadFile成功！')
    console.log(data)
})

//  读取文件
// ReadFile('hello.txt').then(resolve => {
//     emitter.emit('ReadFile', resolve)
// })

//  当然你也可以用 async 来封装异步
async function show(){
    let data = await ReadFile('hello.txt')
    emitter.emit('ReadFile', data)
}
show()
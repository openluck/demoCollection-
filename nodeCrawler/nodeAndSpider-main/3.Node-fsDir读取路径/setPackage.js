//  根据输入生成package.json
//  输入内容
//  导入readline
let readline = require('readline')
let {fsWrite} = require('./lcfs')
//  实例化接口对象
let r1 = readline.createInterface({
    input:process.stdin,
    output:process.stdout
})

//  question方法
// r1.question('你的名字是?', function(answer){

// })

//  封装函数
function lcQuestion(title){
    return new Promise(function(resolve, reject){
        r1.question(title, function(answer){
            resolve(answer)
        })
    })
}

async function createPackage(){
    let name = await lcQuestion('您的包名叫什么？')
    let description = await lcQuestion('您的包如何描述？')
    let main = await lcQuestion('您的包主程序的入口是啥？')
    let author = await lcQuestion('您的包的作者是谁？')
    let content = `{
        "name":"${name}",
        "description":"${description}",
        "main":"${main}",
        "author":"${author}",
    }`
    await fsWrite('package.json',content)
    //  关闭
    r1.close()
}
createPackage()

// //  close事件监听
// r1.on('close',function(){
//     //  结束程序
//     process.exit(0)
// })
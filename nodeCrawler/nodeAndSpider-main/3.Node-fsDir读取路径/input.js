//  输入内容
//  导入readline
let readline = require('readline')

//  实例化接口对象
let r1 = readline.createInterface({
    input:process.stdin,
    output:process.stdout
})

//  question方法
r1.question('你的名字是?', function(answer){
    console.log('我的名字是：'+answer)
    //  不加close,则程序不会结束
    r1.close()
})

//  close事件监听
r1.on('close',function(){
    //  结束程序
    process.exit(0)
})
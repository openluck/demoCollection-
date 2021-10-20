//  写入创建文件
//  引入fs模块
let fs = require('fs')
// write w 写入
// read r 读取
// append a 追加
fs.writeFile('./test.txt', 'hello, test.txt\n',{flag:'a', encoding:'utf-8'}, function(err){
    if(err){
        console.error('写入内容出错')
    }else{
        console.log('创建或修改test.txt成功了')
    }
})

//  封装写入
function writeFs(path, content){
    return new Promise(function(resolve,reject){
        fs.writeFile(path, content,{flag:'a', encoding:'utf-8'}, function(err){
            if(err){
                // console.error('写入内容出错')
                reject(err)
            }else{
                // console.log('创建或修改test.txt成功了')
                resolve()
            }
        })
    })
}

//  多次调用写入内容
async function writeList(){
    await writeFs('./test.txt', '今天晚饭吃啥？\n')
    await writeFs('./test.txt', '铁板牛扒\n')
    await writeFs('./test.txt', '烤泥鳅\n')
    await writeFs('./test.txt', '真棒！\n')
}
writeList()

//  生成html
async function writeHtml(){
    await writeFs('./add.html', '<p>1</p>\n')
    await writeFs('./add.html', '<p>2</p>\n')
    await writeFs('./add.html', '<p>3</p>\n')
    await writeFs('./add.html', '<p>4</p>\n')
}
writeHtml()
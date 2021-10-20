//  功能合集
let fs = require('fs')

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

function fsWrite(path, content){
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

//  创建地址
function fsDir(path){
    return new Promise(function(resolve, reject){
        fs.mkdir(path,function(err){
            if(err){
                reject(err)
            }else{
                resolve('创建目录成功')
            }
        })
    })
}

//  导出方法
module.exports = {fsRead, fsWrite, fsDir}
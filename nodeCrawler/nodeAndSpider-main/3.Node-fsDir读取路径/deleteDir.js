//  删除目录abc
let fs = require('fs')

fs.rmdir('abc',function(err){
    if(err){
        console.log('删除目录abc失败')
    }else{
        console.log('删除目录abc成功')
        console.log('查看当前目录')
        fs.readdir('./',function(err,files){
            if(err){
                return console.log(err)
            }else{
                files.forEach(function(file, index){
                    console.log(file)
                    console.log(index)
                })
            }
        })
    }
})
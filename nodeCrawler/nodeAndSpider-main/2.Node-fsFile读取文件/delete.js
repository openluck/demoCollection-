//  删除文件
//  导入fs模块
let fs = require('fs')

//  删除文件
fs.unlink('del.txt',function(err){
    if(err){
        console.error('删除文件del.txt失败')
    }else{
        console.log('成功删除del.txt') 
    }
})
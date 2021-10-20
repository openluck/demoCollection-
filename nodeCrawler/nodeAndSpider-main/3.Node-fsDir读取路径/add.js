//  添加abc目录
let fs = require('fs')

fs.mkdir('./abc', function(err){
    if(err){
        console.error('创建abc目录失败')
    }else{
        console.log('创建abc目录成功')
    }
})
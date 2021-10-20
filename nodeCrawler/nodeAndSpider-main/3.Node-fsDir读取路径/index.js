let fs = require('fs')
let {fsWrite, fsRead} = require('./lcfs')

const txtPath = 'all.txt'
fs.readdir('../2.fsFile',function(err,files){
    if(err){
        console.error(err)
    }else{
        console.log(files)
        //  读取数据，并写入到all.txt中
        files.forEach(async function(filename, i){
            let content = await fsRead('../2.fsFile/'+filename)
            await fsWrite(txtPath, content)
        })
    }
})
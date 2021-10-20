//  目标：下载音乐
//  1.获取音乐相关的信息，获得音乐的音频地址
//  2.下载对应音乐

//  酷我音乐过不了csrf的验证，可能是做了请求来源区别，这里就实现下下载音乐的过程


//  引入模块
const { default: axios } = require('axios')
let fs = require('fs')
let path = require('path')
const { pipeline } = require('stream')

//  在线音乐地址
let audio = 'https://ep-sycdn.kuwo.cn/3e864f40cdd35d635e4284a581b4ae85/612f2ec6/resource/n2/73/67/1062811834.mp3'

//  封装下载音乐
async function downloadMusic(url){
    //  获取音乐文件文件名与后缀
    let name = path.parse(url).base
    //  音乐写入的路径和名字
    let target = `audio/${name}`
    //  在目标文件夹 audio 创建写入流
    let ws = fs.createWriteStream(target)
    //  下载音乐文件
    axios.get(url,{responseType:'stream'}).then(function(res){
        //  pipe导入文件流到本地存储
        res.data.pipe(ws)
        //  提示音乐下载完成
        console.log('音乐下载完成:'+target)
        //  监听文件流完成
        res.data.on('close',function(){
            //  关闭写入流
            ws.close()
        })
    })

}
downloadMusic(audio)
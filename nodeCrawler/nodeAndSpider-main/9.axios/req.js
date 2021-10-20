//  引入axios
let axios = require('axios')
//  引入request
let request = require('request')
//  导入fs
let fs = require('fs')
//  导入封装好的方法
let {fsRead, fsWrite, fsDir} = require('./lcfs')

//  请求
// let httpUrl = 'https://www.dytt8.net/html/gndy/index.html'
// axios.get(httpUrl, {
//     headers: {'X-Requested-With': 'XMLHttpRequest'}
// }).then(resolve => {
//         console.log('请求成功')
//         console.log(resolve)
//     })
//     .catch(reject => {
//         console.log('请求失败')
//         console.log(reject)
//     })

//  封装请求
function req(url){
    return new Promise(function(resolve,reject){
        request(url,function(error,response,data){
            if(error){
                reject(error)
            }else{
                resolve({response,data})
            }
        })
    })
}

//  通过分类，获取页面中的电影链接
async function getMoivies(url,moveType){
    let {response, data} = await req(url)
    let reg = /<a class="pic-pack-outer" target="_blank" href="(.*?)".*?><img/igs
    var res
    let arrList = []
    while (res = reg.exec(data)) {
        //  改进，可以改为迭代器，提升性能
        arrList.push(res[1])
        //  提取主要信息
        parsePage(res[1],moveType)
    }
    // console.log('分类：',moveType)
    // console.log(arrList)
}

//  解析页面内容
async function parsePage(url, moveType){
    let {response, data} = await req(url)
    let reg = /<h1 class="playerBox-info-name playerBox-info-cnName">(.*?)<\/h1>.*?id="playerBoxIntroCon">(.*?)<a.*?导演.*?target="\_blank" title="(.*?)" data-hrefexp/igs
    let res= reg.exec(data)
    console.log(res[1])
    let movie = {
        name:res[1],
        brief:res[2],
        director:res[3],
        movieUrl:url,
        moveType
    }
    //  写入内容
    let strMovie = JSON.stringify(movie)
    fsWrite('./movies/'+moveType+'/'+res[1]+'.json', strMovie)
}

//  获取起始页面的所有分类
let httpUrl2 = 'https://www.1905.com/vod/list/n_1/o3u1p1.html?fr=vodhome_js_dyjy'
async function getClassUrl(){
    let {response, data} = await req(httpUrl2)
    //  console.log(response)
    // console.log(data)
    //  解析html内容
    let reg = /<span class="search-index-L">类型(.*?)<div class="grid-12x">/igs
    //  获取分类
    let result = reg.exec(data)[1]
    //  提取数据
    let reg1 = /<a href="javascript\:void\(0\);" onclick="location\.href='(.*?)';return false;" >(.*?)<\/a>/igs
    let arrClass = []
    var res
    while(res = reg1.exec(result)){
        if(res[2]!="全部"){
            let obj = {
                className:res[2],
                url:res[1]
            }
            //  数组注入数据
            arrClass.push(obj)
            //  创建目录
            await fsDir('./movies/'+res[2])
            //  目标地址中写入内容
            getMoivies(res[1],res[2])
        }
    }
    // console.log(arrClass)
}
getClassUrl()

//  获取分类你的电影链接
//  根据电影链接获取电影的详细信息
// request(httpUrl2,function(error,response,data){
//     console.log(data)
// })

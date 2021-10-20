//  cheerio是nodejs的抓取页面模块，为服务器特别定制的，快速、灵活、实施的jQuery核心实现。适合各种Web爬虫程序。
//  cheerio是为了获取HTML文档的内容，内容的获取跟jquery一样
//  引入三方库
let cheerio = require('cheerio')
let axios = require('axios')
let fs = require('fs')
let url = require('url')
let path = require('path')

//  将延迟函数封装成promise对象
function lcWait(milliSecondes){
    return new Promise(function(resolve,reject){
        setTimeout(function(){
            resolve('成功执行延迟函数，延迟:'+milliSecondes)
        }, milliSecondes)
    })
}

//  定义函数解析路径，下载图片
async function parsePage(url,title){
    //  请求页面
    let res = await axios.get(url)
    //  解析页面内容
    let $ = cheerio.load(res.data)
    //  获取所有的图片地址
    $('.pic-content img').each((index, item) => {
        //  获取图片路径
        let imgUrl = $(item).attr('src')
        //  获取图片的扩展名
        let extName = path.extname(imgUrl)
        //  图片写入的路径和名字
        let target = `img/${title}/${title}-${index}.${extName}`
        //  在目标 img 路径下创建写入流
        let ws = fs.createWriteStream(target)
        //  下载图片
        axios.get(imgUrl,{responseType:'stream'}).then(function(res){
            //  pipe导入图片流资源，利用写入流写入到本地
            res.data.pipe(ws)
            //  提示完成
            console.log('图片下载完成:'+target)
            //  监听流完成
            res.data.on('close',function(){
                //  关闭写入流
                ws.close()
            })
        })
    })
}

//  获取表情包页面总数
async function getNum(){
    //  网址
    let httpUrl = 'https://www.doutula.com/article/list/?page=1'
    //  获取对应返回
    let res = await axios.get(httpUrl)
    //  cheerio加载对应页面
    let $ = cheerio.load(res.data)
    //  获取分页器按钮长度
    let btnLength= $('.pagination li').length
    //  获取倒数第二个内容 --> 也就是总页数
    let allNum = $('.pagination li').eq(btnLength-2).find('a').text()
    // console.log(allNum)
    return allNum
}

//  获取分类列表数据
async function getListPage(pageNum){
    //  传入页面序号生成请求链接
    let httpUrl = 'https://www.doutula.com/article/list/?page='+pageNum
    //  请求对应页面
    let res = await axios.get(httpUrl)
    //  cheerio解析html文档
    let $ = cheerio.load(res.data)
    //  获取当前页面所有的表情页面的链接
    $('#home .col-sm-9>a').each(async function(index,item){
        //  获取全部标题
        let title  = $(item).find('.random_title').text()
        //  正则匹配文字
        let reg = /(.*?)\d/igs
        //  获取文字 标题
        title = reg.exec(title)[1]
        //  获取链接
        let pageUrl = $(item).attr('href')
        //  创建对应目录
        fs.mkdir('./img/'+title, function(err){
            if(err){
                console.log('创建目录出错了,可能是 ./img 路径下已存在了对应文件夹')
                console.log(err)
            }else{
                console.log('创建目录成功:'+'./img/'+title)
            }
        })
        // //  延迟获取内容
        await lcWait(50*index)
        // //  调用函数下载图片
        parsePage(pageUrl,title)
        //  延迟获取内容
        // setTimeout(parsePage(pageUrl,title), 50*index)
    })
}

//  匿名异步函数调用 --> 爬取所有页面
// (async function(){})()

//  封装函数爬取页面中的表情包
async function spider(){
    //  获取所有的页面总数
    let allPageNum = await getNum()
    //  循环调用方法请求数据
    //  请求量太大建议使用延迟函数来减少服务器响应压力
    for(let i = 1; i <= allPageNum; i++){
        //  设置不同的延迟值
        await lcWait(3000*i)
        getListPage(i)
    }
}
spider()

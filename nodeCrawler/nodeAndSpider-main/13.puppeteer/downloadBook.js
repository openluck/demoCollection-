//  下载目录中的电子书
//  引入模块
let puppeteer = require('puppeteer')
let url = require('url')
let fs = require('fs')


//  封装异步
//  用promise处理读取文件返回
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

//  封装写入
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

// 目标：获取https://sobook.cc/,所有书名和电子书的链接
// 进入网站，获取整个网站列表页的页数
//  异步函数自己调用自己
(async function(){
    //  调试配置
    let debugOptions = {
        //  设置视窗宽高
        defaultViewport:{
            width:1400,
            height:800
        },
        //  是否为无界面浏览器
        headless:false,
        //  放慢每个步骤的操作250毫秒
        slowMo:250,
        //  页面响应取消超时
        timeout:0
    }

    //  正常配置
    let options = {
        //  是否为无界面浏览器
        headless:true
    }
    //  打开浏览器
    let browser = await puppeteer.launch(debugOptions)

    //  将延迟函数封装成 promise 对象
    function lcWait(milliSecondes){
        return new Promise(function(resolve, reject){
            setTimeout(function(){
                resolve('成功执行延迟函数,延迟：'+milliSecondes)
            }, milliSecondes)
        })
    }

    //  解析文本
    async function parseTxt(){
        //  读取内容
        let textContent = await fsRead('./book.txt')
        //  分割字符串
        let strs = textContent.split('---\n')
        //  填入数据
        let arr = []
        for(let i = 0 ; i < strs.length; i++){
            //  解决写入文件最后一行的空字符串
            if(strs[i] != ''){
                let add = JSON.parse(strs[i])
                arr.push(add)
            }
        }
        //  返回内容
        return arr
    }

    //  下载最好有代理池，不然可能需要等待来避免被网站检测
    //  下载文件
    //  读取资源数组
    let bookArr = await parseTxt()
    //  计数器
    let index = 0
    //  下载方法
    async function downloadBook(){
        //  根据索引值下载书
        //  如果索引值大于书数量的总长度
        if(index >= bookArr.length){
            return '完成'
        }
        let bookObj = bookArr[index]
        index ++
        //  打开新页面下载数据
        let page = await browser.newPage()
        page.goto(bookObj['href'])
    }

    downloadBook()
})()
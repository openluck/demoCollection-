//  爬取对应网站中的电子书
//  引入对应模块
let puppeteer = require('puppeteer')
let url = require('url')
let fs = require('fs')

//  访问地址
let httpUrl = "https://sobooks.cc/";

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
    let browser = await puppeteer.launch(options)

    //  将延迟函数封装成 promise 对象
    function lcWait(milliSecondes){
        return new Promise(function(resolve, reject){
            setTimeout(function(){
                resolve('成功执行延迟函数,延迟：'+milliSecondes)
            }, milliSecondes)
        })
    }

    //  获取总的页数
    async function getAllNum(){
        //  打开页面
        let page = await browser.newPage()
        //  拦截谷歌请求
        await page.setRequestInterception(true)
        //  监听请求事件，并对请求进行拦截
        page.on('request', interceptedRequest => {
            //  通过url对请求的地址进行解析
            let urlObj = url.parse(interceptedRequest.url())
            if (urlObj.hostname == 'googleads.g.doubleclick.net' || urlObj.hostname == 'pagead2.googlesyndication.com/')
                //  如果是谷歌的广告请求，name就放弃当次请求，谷歌广告响应太慢
                interceptedRequest.abort();
            else
                interceptedRequest.continue();
            }
        );
        //  跳转到对应页面
        await page.goto(httpUrl)
        //  设置选择器获取总页数
        let pageNum = await page.$eval('.pagination li:last-child span', (element) =>{
            //  对应对象
            let txt = element.innerHTML
            //  截取首字和尾字,再去除两侧空格，就是获取到的页数
            let text = element.innerHTML.substring(1,txt.length-2).trim()
            return text
        })
        //  关闭页面，节约性能
        page.close()
        //  返回页数
        return pageNum
    }

    //  获取总页数
    let pageNum = await getAllNum()
    // console.log(`总页数为 ${pageNum}`)

    //  获取总页数的函数
    async function pageList(num){
        //  拼接地址
        let pageListUrl = `https://sobooks.cc/page/`+num
        //  打开新页面
        let page = await browser.newPage()
        //  拦截谷歌请求
        await page.setRequestInterception(true)
        //  监听请求事件，并对请求进行拦截
        page.on('request', interceptedRequest => {
            //  通过url对请求的地址进行解析
            let urlObj = url.parse(interceptedRequest.url())
            if (urlObj.hostname == 'googleads.g.doubleclick.net' || urlObj.hostname == 'pagead2.googlesyndication.com/')
                //  如果是谷歌的广告请求，name就放弃当次请求，谷歌广告响应太慢
                interceptedRequest.abort();
            else
                interceptedRequest.continue();
            }
        );
        //  访问列表页地址
        await page.goto(pageListUrl)
        //  获取对应所有的内容
        let arrPage = await page.$$eval('#cardslist .card .card-item .thumb-img>a',(elements)=>{
            //  用来存储数据
            let arr = []
            elements.forEach((element, i) => {
                //  填充数据
                let obj = {
                    href:element.getAttribute('href'),
                    title:element.getAttribute('title')
                }
                //  将内容放到数组中
                arr.push(obj)
            })
            // console.log(arr)
            //  返回填充后的数据
            return arr
        })
        //  关闭页面
        page.close()

        //  通过获取的数据的地址和标题去请求书籍的详情页
        arrPage.forEach(async (pageObj, i) => {
            await lcWait(4000*i)
            getPageInfo(pageObj)
        })
        // getPageInfo(arrPage[0])
    }

    //  获取页面详情
    async function getPageInfo(pageObj){
        //  创建新页面
        let page = await browser.newPage()
        //  拦截谷歌请求
        await page.setRequestInterception(true)
        //  监听请求事件，并对请求进行拦截
        page.on('request', interceptedRequest => {
            //  通过url对请求的地址进行解析
            let urlObj = url.parse(interceptedRequest.url())
            if (urlObj.hostname == 'googleads.g.doubleclick.net' || urlObj.hostname == 'pagead2.googlesyndication.com/')
                //  如果是谷歌的广告请求，name就放弃当次请求，谷歌广告响应太慢
                interceptedRequest.abort();
            else
                interceptedRequest.continue();
            }
        );
        //  打开对应的地址
        await page.goto(pageObj.href)
        //  获取输入框
        // let inputEle = await page.$('.e-secret form .euc-y-i')
        //  这个input可是是封装过的组件，需要点击让其获取焦点
        // inputEle.click()
        //  输入框输入内容，注意通过微信内容更新
        // await page.keyboard.type('949696', {delay: 100})
        await page.type('.e-secret form .euc-y-i', '949696')
        // 点击按钮回车
        let btnEle = await page.waitForSelector('.e-secret form .euc-y-s')
        await btnEle.click()

        //  这里输入口令后页面会跳转刷新(history模式),加载后显示对应的下载内容
        //  等待页面跳转,无限等待时间
        await page.waitForNavigation({timeout:0})

        //  
        //  获取书本名称
        let name = await page.$eval('.article-title a', (element) =>{
            //  获取链接
            let downloadUrl = element.innerText
            return downloadUrl
        })

        //  获取下载地址
        let downloadUrl = await page.$eval('.e-secret b a:last-child', (element) =>{
            //  获取链接
            let downloadUrl = element.getAttribute('href').split('url=')[1]
            return downloadUrl
        })
        //  拼接内容---，用来给后面字符串做分割
        let content = `{"title":"${name}","href":"${downloadUrl}"}---\n`
        //  写入路径
        fs.writeFile('book.txt',content,{flag:'a',encoding:'utf-8'},function(){
            console.log(`已将书下载路径写入：${name}`)
            //  写入完成后关闭页面，节约性能
            page.close()
        })
    }

    pageList(1)
})()
//  获取列表页的所有链接


//  进入每个电子书的详情页，获取下载电子书的网盘地址

//  将获取的数据保存到book.txt里
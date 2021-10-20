let puppeteer = require('puppeteer')

async function test(){
    //  puppeter.launch 开启浏览器，可以穿衣个options对象，可以配置为有界面浏览器，无界面浏览器
    //  无界面浏览器性能更高更快，有界面一般用于调试开发
    //  实例启动浏览器,非无头浏览器
    //  配置参数
    let options = {
        //  设置视窗宽高
        defaultViewport:{
            width:1400,
            height:800
        },
        //  是否为无界面浏览器
        headless:false,
        //  放慢每个步骤的操作250毫秒
        slowMo:250
    }
    //  启动浏览器
    let browser = await puppeteer.launch(options)

    //  打开新页面
    let page = await browser.newPage()

    //  访问页面
    // await page.goto('https://www.baidu.com/')
    await page.goto('https://www.dytt8.net/html/gndy/index.html')

    //  截屏
    // await page.screenshot({path:'screenshot.png'})

    // //  通过点击页面跳转的方式
    // //  获取页面对象
    // elementHandle = await page.$$('#menu li a')
    // //  点击内容跳转
    // elementHandle[2].click()

    // 通过表单输入进行搜索
    // 获取表单 --> 默认获取的单个对象是第一个对象，就是表单
    let inputEle = await page.$('.searchl .formhue')
    // 往输入框输入内容
    await page.keyboard.type('新·福音战士剧场版：终')
    // 没装 adblock，应对广告，取消事件冒泡
    await page.$eval('.bd3rl .search',(element) => {
        //  监听阻止事件冒泡
        element.addEventListener('click', function(event){
            event.cancelBubble = true
        })
    })
    // 点击按钮回车
    let btnEle = await page.$('.searchr input[name="Submit"]')
    await btnEle.click()
}

test()
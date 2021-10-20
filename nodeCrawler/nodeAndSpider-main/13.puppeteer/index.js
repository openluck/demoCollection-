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
        headless:false
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

    //  获取页面的内容
    //  $$eval函数使得回调函数运行在浏览器中，并且可以通过浏览器的方式进行输出
    let elements = await page.$$eval('#menu li a',(elements) => {
        //  console.log(elements)
        //  创建数组收集信息，包括地址和内容
        let eles = []
        //  循环获取到的内容
        elements.forEach((item,index) => {
            //  console.log(item.innerText)
            //  过滤无关内容
            if(item.getAttribute('href') != '#' && item.getAttribute('href') != '/app.html'){
                let eleObj = {
                    href:'https://www.dytt8.net'+item.getAttribute('href'),
                    text:item.innerText
                }
                eles.push(eleObj)
            }
        })
        return eles
    })

    // //  监听浏览器控制台输出
    // page.on('console', (eventMsg) => {
    //     console.log(eventMsg.text())
    // })

    //  查看输出
    console.log(elements)
    console.log(elements[2].href)

    //  打开国内电影页面
    let gnPage = await browser.newPage()
    await gnPage.goto(elements[2].href)
}

test()
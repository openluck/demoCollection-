# 爬虫总结

## 1.爬虫介绍

通过模拟浏览器的请求，服务器就回根据我们的请求返回我们想要的数据，将数据解析出来，并且进行保存。



### 爬虫流程

---

**1.目标：确定你想要的获取的数据**

​	1.确定想要的数据在什么页面上(一般详细的数据会在详情页)

​	2.确定在那些页面可以链接到这些页面(一般分类列表页面会有详情页的链接数据)

​	3.寻找页面之间和数据之间的规律

**2.分析页面**

​	1.获取数据的方式(正则，cherrio)

​	2.分析数据是通过ajax请求的数据，还是html里自带的数据

​	3.如果是通过ajax请求的数据，那么需要获取ajax请求的链接，一般请求到的数据都为JSON格式数据，那么就回比较容易解析。

​	4.如果数据再HTML里，那么就用cherrio通过选择器将内容选中

**3.编写单个数据获取的案例**

​	1.解析出分类页的链接地址

​	2.解析出列表页的链接地址

​	3.解析出详情页的链接地址

​	4.解析详情页你想要获取的数据

​	5.将数据惊喜保存到本地或者数据库

**4.如果遇到阻碍反爬虫对抗**

​	1.User-Agent是否是正常的浏览器的信息

​	2.将请求头设置成浏览器一样的内容

​	3.如果爬虫的爬取速度过快，会导致封号。1.通过降低速度进行解决 2.可以使用代理访问进行解决

​	4.如果设置需要凭证，那么可以采用无界浏览器真实模拟。



## 2.请求数据的库

requst, axios:通过库，帮助我们快速实现HTTP请求包的打包

```javascript
request.get('请求地址'， {
	'请求头字段':'请求头的value值'            
})
```

axios优势会更明显，前后端通杀，前后端调用的方式一致：

```javascript
axios.get('请求地址',参数对象).then(function(res){
    console.log(res)
})
```

axios获取图片

```javascript
axios({
    method:'get',
    url:'http://bit.ly/2mTM3nY',
    responseType:'stream'
})
.then(function(response){
    response.data.pipe(fs.createWriteStream('img.jpg'))
})
```

puppeteer:完全模拟浏览器，用来对付SPA

打开浏览器

```javascript
let options = {
    headless:true,	//是否是无界面(无头)浏览器
    slowMo:250,	//调试时可以减慢操作速度
    defaultViewport:{
        //	设置视窗宽高
        width:1200,
        height:800
    },
    timeout:3000,//默认超时3秒
}
//	启用配置，打开浏览器
let browser = await puppeteer.launch(options)
```

打开新标签页

```javascript
let page = await browser.newPage()
```

获取浏览器中的页面

```javascript
let pages = await browser.pages()
```

关闭浏览器

```javascript
browser.close()
```

将页面跳转至

```javascript
await page.goto(url)
```

获取页面的对象，并进行操作

```javascript
let btn = await page.$(selector)
let input = await page.$(selector)
//	点击按钮
btn.click()
//	聚焦到输入框
input.focus()
```

在页面上写入内容或者键盘按键

```javascript
await page.keyboard.type('Hello World')
await page.keyboard.press('ArrowLeft')
await page.keyboard.down('Shift')
```

截获页面请求

```javascript
await page.setRequestInterception(true)
page.on('request', request => {
    request.url()	//	可以获取请求的网址，request,包含所有的请求信息
    if(你想要的的条件){
       request.continue()
    }else{
        request.abort([errorCode])
    }
})
```

获取浏览器的信息和内容

```javascript
page.$eval(selector, (item) => {return item})
page.$$eval(selector, (items) => {return items})
```
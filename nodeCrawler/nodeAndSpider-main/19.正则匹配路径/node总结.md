# node总结

Node:一门后端语言(服务器端的程序语言)，能够链接数据库存储数据，能够接受和处理网络请求(服务器的响应，发送请求去获取数据)，单线程事件驱动，异步执行不等待，提高IO(input和output)的处理速度和效率。

服务器：本质上是一台PC主机(linux系统，windows系统)，部署了后端语言的的执行环境，并且能够长时间提供网络服务。

**事件驱动**

node本身提供了事件对象，帮助我们快速实现订阅者模式，或观察者模式，或时间模式

```javascript
//	事件的订阅
event.on('子安武人演唱会', () => {console.log('准备买门票')})
//	事件的触发
event.emit('子安武人演唱会')
```

**读写事件**

```javascript
fs.readfile('path', 读取配置, (err,data) => {})
fs.writeFile('path', 写入数据, 写入配置, () => {})
```

**读写promise封装**

```javascript
let fs = require('fs')
function fsRead(path){
    return new Promise(function(resolve,reject){
        fs.readFile(path,{flag:'r',encoding:"utf-8"},function(err,data){
            if(err){
                //console.log(err)
                //失败执行的内容
                reject(err)

            }else{
                //console.log(data)
                //成功执行的内容
                resolve(data)
            }
            //console.log(456)
        })
    })
}


function fsWrite(path,content){
    return new Promise(function(resolve,reject){
        fs.writeFile(path,content,{flag:"a",encoding:"utf-8"},function(err){
            if(err){
                //console.log("写入内容出错")
                reject(err)
            }else{
                resolve(err)
                //console.log("写入内容成功")
            }
        })
    })
}

function fsDir(path){
    return new Promise(function(resolve,reject){
        fs.mkdir(path,function(err){
            if(err){
                reject(err)
            }else{
                resolve("成功创建目录")
            }
        })
    })
}

module.exports = {fsRead,fsWrite,fsDir}
```

使用方式

```javascript
//	这种写法实际上是立即调用匿名 async 函数
(async function(){
    //	这里等待捕获读取的内容结果
    let data = await fsRead('path')
})()
```

**网络请求数据**

request, axios:效率比较高，局线性比较大 (适用于SSR渲染，抓内容，看接口，不适用SPA)

puppeteer:效率低，局限性比较小(其实就是操作浏览器，可以异步，操作比较负载)

重点掌握的是：页面的分析，数据存放的位置，以及响应内容。

**网络响应数据**

```javascript
http.createServer:就可以创建1个服务器去监听某个端口，并且通过请求时间来处理每个发送过来的请求。
//	node启动服务后，只要被请求就会触发request事件
server.on('request', (req,res) => {
    req:请求数据都会放到这个对象中
    res:响应对象
})
```

**路由**

根据不同的路径去响应不同的内容

```javascript
//  循环匹配正则路径
for(let key in this.reqEvent){
    //  获取正则
    let regStr = key
    let reg = new RegExp(regStr, 'igs')
    if(reg.test(req.url)){
        //  路径匹配正则就调用
        this.reqEvent[key](req, res)
        resState = true
        break
    }
}
```

**模板**

会有个固定样式和结构的HTML模板，根据请求的数据不同，显示页面内容，比如新闻网站

```javascript
//  渲染内容方法
function render(options,path){
    fs.readFile(path,{encoding:"utf-8",flag:"r"},(err,data)=>{
        if(err){
            console.log(err)
        }else{
            //  捕获错误
            try{
                //  console.log(data)
                //  先匹配数组
                data = replaceArr(data, options)
                //  再匹配变量
                data = replaceVar(data, options)
                //  最终输出渲染出来的HTML
                this.end(data)
            }catch(error){
                console.log(error)
            }
        }
    })
}
//	调用
//  根据模板渲染页面
// res.end(pageData.name)
if(index == 0){
    res.render(movies[index],'./template/index0.html')
}else if(index == 1){
    res.render(movies[index],'./template/index1.html')
}else{
    res.setHeader('content-type','text/html;charset=utf-8')
    res.end(`<h3>没有找到对应的电影</h3>`)
}
```
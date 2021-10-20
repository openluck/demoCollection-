//  引入http模块
let http = require('http')
//  创建服务器实例
let server = http.createServer()
//  监听服务器对象的请求
server.on('request', (req, res) => {
    //  当服务器被请求时，会触发请求时间，并传入请求对象和响应对象
    //  console.log(`查看req`)
    //  console.log(req)
    //  设置响应头
    res.setHeader('Content-Type','text/html; charset=UTF-8')
    let url = req.url   //  获取相对路径
    if(url === '/'){
        res.end(`<h3 style="color:blue;">index page</h3>`)
    }else if(url === '/login'){
        res.end('login page')
    }else if(url === '/register'){
        res.end('register page')
    }else if(url === '/product'){
        let arr = [
            {
                name:'dio',
                age:200
            },
            {
                name:'jojo',
                age:18
            }
        ]
        //  响应的数据类型必须是字符串或者二进制数据
        res.end(JSON.stringify(arr))
    }else{
        res.end('404 not found')
    }
})
//  监听端口
server.listen(3000, () => {
    console.log(`服务器启动成功，可以通过localhost:3000 或 127.0.0.1:3000 来获取数据`)
})
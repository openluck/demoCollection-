//  页面+静态资源
//引入http模块
let http = require('http');
//创建server对象
let server = http.createServer()
//引入path模块
let path = require('path')
//引入文件模块
let fs = require('fs')
//监听客户端发送过来的请求
//req请求对象包含了请求的相关的信息
//res对象用于响应内容，可以通过这个对象帮助我们快速实现HTTP响应
server.on('request',function(req,res){
    //解析路径
    let urlObj = path.parse(req.url)
    //识别请求的路径
    //console.log(urlObj)
    //进入首页，返回首页的内容
    if(req.url=="/"){
        res.setHeader("content-type","text/html;charset=utf-8")
        res.end(`<link rel="stylesheet" href="./static/style.css"><h1>首页</h1><img src='./static/a.jpg'>`)
    }else if(urlObj.dir=='/static'){
        res.setHeader("content-type",getContentType(urlObj.ext))
        let rs = fs.createReadStream('./static/'+urlObj.base)
        rs.pipe(res)
    }else{
        res.setHeader("content-type","text/html;charset=utf-8")
        res.end("<h1>404页面找不到</h1>")
    }
})
function getContentType(extName){
    switch(extName){
        case ".jpg":
            return "image/jpeg";
        case ".png":
            return "image/png";    
        case ".html":
            return "text/html;charset=utf-8";
        case ".js":
            return "text/javascript;charset=utf-8";
        case ".json":
            return "text/json;charset=utf-8";
        case ".gif":
            return "image/gif";
        case ".css":
            return "text/css"
    }
}
//启动服务器，监听服务端口
server.listen(80,function(){
    console.log("服务已启动：http:localhost:80")
    console.log("服务已启动：http:127.0.0.1:80")
})
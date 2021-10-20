//  封装服务器
//  封装：
//  1.构造函数能够实例化app对象
//  2.app.on(),可以添加路由的事件，根据请求的路径请求不同的内容
//  3.app.run(port,callback),让服务器运行起来


//  引入模块
let http = require('http')
let path = require('path')
// let url = require('url')
let fs = require('fs')

//  申明类
class LcApp{
    constructor(){
        //  启动服务
        this.server = http.createServer()
        //  请求对象
        this.reqEvent =  {}
        //  静态服务器默认目录
        this.staticDir = '/static'
        //  监听请求事件
        this.server.on('request', (req, res) => {
            //  解析路径
            let pathObj = path.parse(req.url)
            //  判断路径是否在请求事件中
            if(pathObj.dir in this.reqEvent){
                //  指向渲染函数
                res.render = render
                res.setHeader('content-type','text/html;charset=utf-8')
                //  指向路径
                req.pathObj = pathObj
                //  如果存在就调用
                this.reqEvent[pathObj.dir](req, res)
            }else if(pathObj.dir == this.staticDir){
                //  静态服务器处理
                res.setHeader("content-type",this.getContentType(pathObj.ext))
                let rs = fs.createReadStream(`.`+this.staticDir+`/`+pathObj.base)
                rs.pipe(res)
            }else{
                //  不存在就提示404
                res.setHeader('content-type','text/html;charset=utf-8')
                res.end(`<h1>404页面未找到</h1>`)
            }
        })
    }
    on(url,fn){
        //  this.reqEvent创建对应内容
        this.reqEvent[url] = fn
    }
    run(port,callback){
        //  传入端口号，回调函数运行
        this.server.listen(port,callback)
    }
    getContentType(extName){
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
}

//  渲染内容
function render(options,path){
    fs.readFile(path,{encoding:"utf-8",flag:"r"},(err,data)=>{
        if(err){
            console.log(err)
        }else{
            //  console.log(data)
            //  先匹配数组
            data = replaceArr(data, options)
            //  再匹配变量
            data = replaceVar(data, options)
            this.end(data)
        }
    })
}

//  匹配变量
function replaceVar(data, options){
    let reg = /\{\{(.*?)\}\}/igs
    while(result = reg.exec(data)){
        //  去除2边的空白
        let strKey = result[1].trim()
        //  匹配对应属性
        let strValue = eval('options.'+strKey)
        //  替换内容
        data = data.replace(result[0],strValue)
    }
    return data
}

//  匹配数组
function replaceArr(data, options){
    //  匹配循环的变量，并且替换循环的内容
    let reg = /\{\%for \{(.*?)\} \%\}(.*?)\{\%endfor\%\}/igs
    while(result = reg.exec(data)){
        //  获取键名
        let strkey = result[1].trim()
        //  获取键值
        let strValueArr = options[strkey]
        let listStr = ""
        //  这里在读取result[0] result[2] 时会读取异常，就用变量先存储赋值
        let getTwo = result[2]
        let getZero = result[0]
        strValueArr.forEach((item, index) => {
            //  替换每一项里面的变量
            listStr = listStr + replaceVar(getTwo, {'item':item})
        })
        data = data.replace(getZero, listStr)
    }
    return data
}
// 导出内容
module.exports = LcApp
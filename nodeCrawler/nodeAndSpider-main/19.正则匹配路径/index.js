//  导入类
let LcApp = require('./lcApp')

//  实例化
let app = new LcApp()

//  更改静态目录
app.staticDir = '/abc'

app.on('^/$', (req,res) => {
    res.setHeader('content-type','text/html;charset=utf-8')
    res.end(`<link rel="stylesheet" href="./static/style.css"><h1>首页</h1><img src='./abc/a.jpg'>`)
})

app.on('/gnxw/(.*)', (req, res) => {
    res.setHeader('content-type','text/html;charset=utf-8')
    if(req.pathObj.base == 'index'){
        res.end('<h1>这是国内新闻首页</h1>')
    }else{
        res.end('<h1>这是国内新闻其他页面</h1>')
    }
})

//请求路径：http://127.0.0.1/movies/0
app.on('/movies/\\d+',(req,res) => {
    //  获取序号
    let index = req.pathObj.base
    //  电影内容
    let movies = [
        {
            name:"雪暴",
            brief:"电影《雪暴》讲述了在一座极北的边陲小镇，一伙穷凶极恶、作案手法老到的悍匪为抢夺黄金，打劫运金车，并借助大雪掩盖了所有犯罪痕迹。为了探求真相，警察王康浩暗地里搜集证据，熟悉地形，终于在一场灾难级的暴雪降临时，与谋财害命的悍匪发生了惊心动魄的正面对决……",
            author:"张震",
            stars:['小a','小b','小c','小d']
        },{
            name:"少年的你",
            brief:"陈念（周冬雨 饰）是一名即将参加高考的高三学生，同校女生胡晓蝶（张艺凡 饰）的跳楼自杀让她的生活陷入了困顿之中。胡晓蝶死后，陈念遭到了以魏莱（周也 饰）为首的三人组的霸凌，魏莱虽然表面上看来是乖巧的优等生，实际上却心思毒辣，胡晓蝶的死和她有着千丝万缕的联系。",
            author:"周冬雨",
            stars:[
                {
                    name:"周冬雨",
                    gender:'女'
                },
                {
                    name:"子安武人",
                    gender:'男'
                }
            ]
        }
    ]
    //  获取对应的电影内容
    let pageData = movies[index]
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
})
//  访问页面
app.run(80, () => {
    console.log('服务启动: localhost:80')
    console.log('服务启动: 127.0.0.1:80')
})


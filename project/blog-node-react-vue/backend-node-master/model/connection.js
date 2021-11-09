var mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)
//连接数据库
mongoose.connect('mongodb://localhost:27017/blog',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

//监听数据库连接状态
mongoose.connection.once('open',()=>{
    console.log('数据库连接成功……')
})
mongoose.connection.once('close',()=>{
    console.log('数据库断开……')
})
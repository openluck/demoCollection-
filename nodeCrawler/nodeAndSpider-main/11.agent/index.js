let axios = require('axios')

let httpUrl = 'https://www.doutula.com/article/detail/1032963'
let options = {
    proxy:{
        host:'117.187.167.224',
        port:3128
    }
}
axios.get(httpUrl,options)
    .then(resolve => {
        console.log('请求成功')
        console.log(resolve)
    })
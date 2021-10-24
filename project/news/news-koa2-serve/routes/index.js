const router = require('koa-router')()
// 导入查询sql语句
const findSqlData = require('../controllers/mysqlConnect')

// 请求接口前缀
router.prefix('/api')

// 查询中国新闻网-财经首页新闻
router.get('/getChinaNewsFinance', async (ctx, next) => {
  await findSqlData.findChinaNewsFinance().then(async (res) => {
    console.log(res);
    ctx.body = {
      code: "200",
      data: res,
      message: '查询成功'
    }
  })
})


module.exports = router

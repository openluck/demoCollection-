/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-10-25 09:14:58
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-11-01 16:16:56
 */
const router = require('koa-router')()
// 导入查询sql语句
const findSqlData = require('../controllers/mysqlConnect')

// // find方法封装
// db.collection(collectionName).find(json1, { fields: attr }).skip(slipNum).limit(pageSize);
// // count方法封装
// var result = db.collection(collectionName).count(json);
// result.then(function (data) {
//   resolve(data);
// })

// 请求接口前缀
router.prefix('/api')

// query：返回的是格式化好的参数对象。
// querystring：返回的是请求字符串。

// 查询中国新闻网-财经首页新闻
router.post('/getChinaNewsFinance', async (ctx, next) => {
  const { current, pageSize } = ctx.request.body
  let dataParam = {
    current: (current - 1) * 10,
    pageSize
  }
  await findSqlData.findChinaNewsFinance(dataParam).then(async (res) => {
    console.log('res--------', res);
    ctx.body = {
      code: "200",
      data: res,
      message: '查询成功'
    }
  })
})
// 中国新闻网-查询关键词
router.post('/findKeywordList', async (ctx, next) => {
  console.log('ctx.request.body', ctx.request.body);
  let { searchValue } = ctx.request.body
  await findSqlData.findKeywordList(searchValue).then(async (res) => {
    console.log('res--------', res);
    ctx.body = {
      code: "200",
      data: res,
      message: '查询成功'
    }
  })
})


module.exports = router

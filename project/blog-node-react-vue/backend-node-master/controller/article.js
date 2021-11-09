
const Article = require('../model/article')
const { articleCreateRule, articleListRule, articleUpdateRule } = require('../rule/ArticleRule')
const { IdScheme } = require('../rule/currencyRule')

// 创建文章

const create = async (req, res) => {
    await articleCreateRule.validateAsync(req.body)
    const result = await Article.create(req.body)

    if (!result) {
        return res.json({
            code: 300,
            msg: '创建文章失败'
        })
    }
    return res.json({
        code: 200,
        msg: '创建文章成功'
    })
}


//  查询文章列表

const list = async (req, res) => {
    const { limit, page, ...optional } = await articleListRule.validateAsync(req.query)
    const { keyword, date, classify} = optional
    const where = {}
    if (keyword) {
        const reg = new RegExp(keyword)
        where.title = reg
    }
    if (date && date.length > 0) {
        where.createTime = { $gt: date[0], $lt: date[1] }
    }
    if (classify) {
        where.classify = classify
    }
    console.log(where)
    const skip = (page - 1) * limit
    const count = await Article.find(where).count()
    const result = await Article.find(where).sort({ _id: -1 }).limit(limit).skip(skip).populate('classify', 'name')
    res.json({
        code: 200,
        msg: '文章列表',
        count,
        data: result
    })
}


// 文章详情

const detail = async (req, res) => {
    const { id } = await IdScheme.validateAsync(req.query)
    const result = await Article.findById(id).populate('classify', 'name').lean()
    if (!result) {
        return res.json({
            code: 300,
            msg: '获取文章详情失败'
        })
    }
    await Article.findByIdAndUpdate(id, { $inc: { browse: 1 } })
    res.json({
        code: 200,
        msg: '文章详情',
        data: result
    })
}


// 修改文章

const update = async (req, res) => {
    const { id, ...params } = await articleUpdateRule.validateAsync(req.body) // 验证参数
    const result = await Article.findByIdAndUpdate(id, params) // 数据库操作
    if (!result) {     // 返回前端
        res.json({
            code: 300,
            msg: '修改文章失败',
        })
    }
    res.json({
        code: 200,
        msg: '修改文章成功',
    })
    // 中间所有错误会被各类错误中间件捕获
}

// 删除文章
const deleted = async (req, res) => {
    const { id } = await IdScheme.validateAsync(req.query)
    const result = await Article.findByIdAndRemove(id)
    if (!result) {
        res.json({
            code: 300,
            msg: '删除文章失败',
        })
    }
    res.json({
        code: 200,
        msg: '删除文章成功',
    })
}

// 点赞 / 取消点赞

const giveFive = async (req, res) => {
    const { data: userId } = req.user
    const { id } = await IdScheme.validateAsync(req.body)
    const result = await Article.findOne({ _id: id, fabulous: userId })
    if (!result) {
        const ADD = await Article.updateOne({ _id: id }, { $push: { fabulous: userId } })
        if (!ADD) {
            return res.json({
                code: 300,
                msg: '点赞失败'
            })
        }
        return res.json({
            code: 200,
            msg: '点赞成功'
        })
    } else {
        const CUT = await Article.updateOne({ _id: id }, { $pull: { fabulous: userId } })
        if (!CUT) {
            return res.json({
                code: 300,
                msg: '取消点赞失败'
            })
        }
        return res.json({
            code: 200,
            msg: '取消点赞成功'
        })
    }
}







module.exports = {
    create,
    list,
    detail,
    update,
    deleted,
    giveFive,
}
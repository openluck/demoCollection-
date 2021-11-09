const ArticleClassify = require('../model/articleClassify')

const { articleClassifyCreateRule, articleClassifyUpdateRule, articleClassifyDeleteRule } = require('../rule/ArticleRule')


// 创建文章

const create = async (req, res) => {
    try {
        await articleClassifyCreateRule.validateAsync(req.body)
    } catch (error) {
        return res.json({
            code: 101,
            msg: error.message,
        })
    }
    const { name } = req.body

    const result = await ArticleClassify.findOne({name})

    if(!result) {
        await ArticleClassify.create({name})
    } else {
        return res.json({
            code: 102,
            msg: '分类名字重复',
        })
    }
    return res.json({
        code: 200,
        msg: '添加分类成功',
    })
}


// 修改文章分类

const update = async (req, res) => {
    try {
        await articleClassifyUpdateRule.validateAsync(req.body)
    } catch (error) {
        return res.json({
            code: 101,
            msg: error.message,
        })
    }
    const { id, name } = req.body

    const result = await ArticleClassify.findByIdAndUpdate(id, {name})

    if(!result) {
        return res.json({
            code: 102,
            msg: '修改分类失败',
        })
    }
    return res.json({
        code: 200,
        msg: '修改分类成功',
    })
}


// 删除分类


// 修改文章分类

const deleted = async (req, res) => {
    try {
        await articleClassifyDeleteRule.validateAsync(req.query)
    } catch (error) {
        return res.json({
            code: 101,
            msg: error.message,
        })
    }
    const { id } = req.query

    const result = await ArticleClassify.findByIdAndRemove(id)
    if(!result) {
        return res.json({
            code: 102,
            msg: '删除失败',
        })
    }
    return res.json({
        code: 200,
        msg: '删除成功',
    })
}

/**
 * @title 获取文章列表
 * @param {Object} req
 * @param {Object} res
 * @returns {JSON}
*/

const list = async (req, res) => {
    const data = await ArticleClassify.find().sort({ id: -1 })
    if (data) {
        return res.json({
            code: 200,
            data,
            msg: '文章分类列表'
        })
    }
}

module.exports = {
    create,
    update,
    deleted,
    list
}
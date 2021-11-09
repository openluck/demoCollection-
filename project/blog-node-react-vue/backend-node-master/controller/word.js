
const Word = require('../model/word')
const User = require('../model/user')
const { WordCreateRule, WordChildCreateRule, WordChildIdRule } = require('../rule/WordRule')
const { IdScheme, limitPageScheme } = require('../rule/currencyRule')

const create = async (req, res) => {
    const { content } = await WordCreateRule.validateAsync(req.body)
    const id = req.user.data
    const { _id } = await User.findById(id)
    const result = await Word.create({
        person: _id,
        content
    })
    if (!result) {
        return res.json({
            code: 300,
            msg: '留言失败'
        })
    }
    return res.json({
        code: 200,
        msg: '留言成功'
    })
}

const createChild = async (req, res) => {
    const { content, id } = await WordChildCreateRule.validateAsync(req.body)
    console.log(content)
    const userId = req.user.data
    const { _id } = await User.findById(userId)
    const result = await Word.updateOne({ _id: id }, { $push: { children: { person: _id, content } } })
    if (!result) {
        return res.json({
            code: 300,
            msg: '留言失败'
        })
    }
    return res.json({
        code: 200,
        msg: '留言成功'
    })
}

// 删除留言

const deleted = async (req, res) => {
    const { id } = await IdScheme.validateAsync(req.query)
    const result = await Word.findByIdAndRemove(id)
    if (!result) {
        res.json({
            code: 300,
            msg: '删除留言失败',
        })
    }
    res.json({
        code: 200,
        msg: '删除留言成功',
    })
}

// 删除子留言

const deletedChild = async (req, res) => {
    const { id: _id } = await IdScheme.validateAsync(req.query)
    const result = await Word.updateOne({ 'children._id': _id }, { $pull: { children: { _id } } })
    if (!result.n) {
        res.json({
            code: 300,
            msg: '删除留言失败',
        })
    }
    res.json({
        code: 200,
        msg: '删除留言成功',
    })
}

// 查找子列表

const listChild = async (req, res) => {
    const { id } = await IdScheme.validateAsync(req.query)
    const result = await Word.findById(id, ['children']).populate({
        path: 'children',
        populate: { path: 'person', select: ['nickname', 'avatar', '_id' ]},
    }).lean()

    let children = result.children.sort((m, n) => m.time < n.time ? 1 : -1 )

    if (!result) {
        return res.json({
            code: 300,
            msg: '获取列表失败',
        })
    }
    return res.json({
        code: 200,
        data: children
    })
}


// 查找总列表

const list = async (req, res) => {
    const { limit, page, keyword } = await limitPageScheme.validateAsync(req.query)
    const skip = (page - 1) * limit
    const where = {}
    if (keyword) {
        const reg = new RegExp(keyword, 'g')
        where.content = reg
    }
    const count = await Word.find(where).count()
    const result = await Word.find(where).limit(limit).skip(skip).sort({_id: -1 }).populate('person', ['nickname', 'avatar']).populate({
        path: 'children',
        populate: { path: 'person', select:['nickname', 'avatar'] }
      });
    if (!result) {
        return res.json({
            code: 300,
            msg: '获取列表失败',
        })
    }
    return res.json({
        code: 200,
        count,
        data: result
    })
}




module.exports = {
    create,
    createChild,
    deleted,
    deletedChild,
    listChild,
    list
}
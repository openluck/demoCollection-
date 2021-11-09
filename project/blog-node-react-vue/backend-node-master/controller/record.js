const Record = require('../model/record')
const { RecordCreate, RecordUpdata, RecordList } = require('../rule/Record.js')
const { IdScheme } = require('../rule/currencyRule')

const create = async (req, res) => {
    const params = await RecordCreate.validateAsync(req.body)
    const result = Record.create(params)
    if (!result) {
        return res.json({
            code: 300,
            msg: '创建记录失败'
        })
    }
    return res.json({
        code: 200,
        msg: '创建记录成功'
    })
}

const update = async (req, res) => {
    const { id, ...params } = await RecordUpdata.validateAsync(req.body)
    console.log(id, params)
    const result = await Record.updateOne({ _id: id }, params)
    if (result.n !== 1) {
        return res.json({
            code: 300,
            msg: '更新记录失败'
        })
    }
    return res.json({
        code: 200,
        msg: '更新记录成功'
    })
}

const deleted = async (req, res) => {
    const { id } = await IdScheme.validateAsync(req.query)
    const result = await Record.deleteOne({ _id: id })
    if (!result) {
        return res.json({
            code: 300,
            msg: '删除失败'
        })
    }
    return res.json({
        code: 200,
        msg: '删除成功'
    })
}


const list = async (req, res) => {
    const { limit, page, keyword, tag, date } = await RecordList.validateAsync(req.query)
    const skip = (page - 1) * limit
    const where = {}
    if (keyword) {
        const reg = new RegExp(keyword)
        where.content = reg
    }
    if (date && date.length > 0) {
        where.time = { $gt: date[0], $lt: date[1] }
    }
    if (tag) {
        where.tag = tag
    }
    const result = await Record.find(where).limit(limit).skip(skip).sort({_id: -1}).populate('tag', { name: 1, color: 1 })
    const count = await Record.find(where).count()
    res.json({
        code: 200,
        msg: '记录列表',
        count: count,
        data: result
    })
}



module.exports = {
    create,
    update,
    deleted,
    list,
}
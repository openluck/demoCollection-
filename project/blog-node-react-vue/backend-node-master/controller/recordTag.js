const { json } = require('express')
const RecordTag = require('../model/recordTag')
const  { RecordTagCreate, RecordTagUpdate }= require('../rule/Record')



/**
 * 创建记录标签
 * @method
 */
const create = async (req, res, next) => {
    const { name, color } = await RecordTagCreate.validateAsync(req.body)
    try {
        await RecordTag.create({name, color})
    } catch (error) {
        if (error.code === 11000) {
            return res.json({
                code: 300,
                msg: '名字重复了'
            })
        }
        next()
    }

    return res.json({
        code: 200,
        msg: '添加成功'
    })
}

const update = async (req, res) => {

    const { id, ...params } = await RecordTagUpdate.validateAsync(req.body)

    const result = await RecordTag.findByIdAndUpdate(id, params)
    console.log(result)
    if (!result) {
        return res.json({
            code: 300,
            msg: '修改失败'
        })
    }

    return res.json({
        code: 200,
        msg: '修改成功'
    })

}

const list = async (req, res) => {
    const result = await RecordTag.find()
    if (!result) {
        return res.json({
            code: 300,
            msg: '获取列表失败'
        })
    }

    return res.json({
        code: 200,
        data: result,
        msg: '获取列表成功'
    })
}

const deleted = async (req, res) => {
    const { id } = req.query

    const result = await RecordTag.findByIdAndRemove(id)
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




module.exports = {
    create,
    update,
    list,
    deleted
}
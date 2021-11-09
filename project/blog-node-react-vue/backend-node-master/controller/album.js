const Album = require('../model/album')
const { albumCreateRule, albumPhotoAddRule, albumPhotoListRule, albumUpdateRule } = require('../rule/Album')
const { IdScheme } = require('../rule/currencyRule')

const create = async (req, res) => {
    const params = await albumCreateRule.validateAsync(req.body)
    const Reslut = await Album.findOne({ name: params.name })
    if (Reslut) {
        return res.json({
            code: 300,
            msg: '名字重复'
        })
    }
    const result = await Album.create(params)
    if (!result) {
        return res.json({
            code: 300,
            msg: '相册创建失败'
        })
    }
    return res.json({
        code: 200,
        msg: '相册创建成功'
    })
}

// 增加photo

const addPhoto = async (req, res) => {
    const { id, ...params } = await albumPhotoAddRule.validateAsync(req.body)
    const query = params.url.map((item) => {
        return { url: item }
    })
    const result = await Album.updateOne({ _id: id }, { $push: { photo: query } })
    if (!result) {
        return res.json({
            code: 300,
            msg: '添加失败'
        })
    }
    return res.json({
        code: 200,
        msg: '添加成功'
    })
}

//  删除photo
const deletePhoto = async (req, res) => {
    const { id } = await IdScheme.validateAsync(req.query)
    const result = await Album.updateOne({ 'photo._id': id }, { $pull: { photo: { _id: id } } })
    if (!result.n) {
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


//  删除相册

const deleted = async (req, res) => {
    const { id } = await IdScheme.validateAsync(req.query)
    const result = await Album.findByIdAndRemove(id)
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


// 获取相册列表

const list = async (req, res) => {
    const result = await Album.find({}, { photo: false })

    return res.json({
        code: 200,
        msg: '相册列表',
        data: result
    })
}

// 获取照片列表
const photoList = async (req, res) => {
    const { id, limit, page } = await albumPhotoListRule.validateAsync(req.query)
    const skip = (page - 1) * limit
    const { photo } = await Album.findById(id)
    // const { photo } = await Album.findById(id, { 'photo': { $slice: [skip, limit] } })
    if (!photo) {
        return res.json({
            code: 200,
            msg: '获取照片失败',
        })
    }
    return res.json({
        code: 200,
        msg: '照片列表',
        data: photo
    })
}


// 修改相册

const update = async (req, res) => {
    const { id, ...params} = await albumUpdateRule.validateAsync(req.body)
    const result = await Album.findByIdAndUpdate(id, params)
    if (!result) {
        return res.json({
            code: 300,
            msg: '有问题'
        })
    }

    return res.json({
        code: 200,
        msg: '修改成功'
    })
}




module.exports = {
    create,
    addPhoto,
    deletePhoto,
    deleted,
    list,
    photoList,
    update
}
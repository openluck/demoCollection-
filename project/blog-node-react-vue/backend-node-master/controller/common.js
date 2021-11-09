
// 引入处理文件上传的模块
const formidable = require('formidable')
// 引入处理路径模块
const path = require('path')
const { baseUrl } = require('../utils/constant')
const uploadAvatar = async (req, res) => {
    const form = new formidable.IncomingForm()
    form.uploadDir = path.join(__dirname, '../public/images/avatar') // 文件保存路径
    form.keepExtensions = true // 文件保留扩展名
    const { files } = await parse(form, req)
    if (files) {
        const URL = files.file.path.split('public')[1].replace(/\\/g, '/')
        res.json({
            message: '头像上传成功',
            code: 200,
            data: baseUrl + URL
        })
    } else {
        res.json({
            message: '头像上传失败',
            code: 300,
        })
    }
}

const uploadPoster = async (req, res) => {
    const form = new formidable.IncomingForm()
    form.uploadDir = path.join(__dirname, '../public/images/poster') // 文件保存路径
    form.keepExtensions = true // 文件保留扩展名
    const { files } = await parse(form, req)
    if (files) {
        const URL = files.file.path.split('public')[1].replace(/\\/g, '/')
        res.json({
            message: '头像上传成功',
            code: 200,
            data: baseUrl + URL
        })
    } else {
        res.json({
            message: '头像上传失败',
            code: 300,
        })
    }
}

const uploadPhoto = async (req, res) => {
    const form = new formidable.IncomingForm()
    form.uploadDir = path.join(__dirname, '../public/images/photo') // 文件保存路径
    form.keepExtensions = true // 文件保留扩展名
    const { files } = await parse(form, req)
    if (files) {
        const URL = files.file.path.split('public')[1].replace(/\\/g, '/')
        res.json({
            message: '照片上传成功',
            code: 200,
            data: baseUrl + URL
        })
    } else {
        res.json({
            message: '照片上传失败',
            code: 300,
        })
    }
}


//  自定义一个解析函数
function parse (form, req) {
    return new Promise ((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) {
                reject(err)
                return
            }
            resolve({fields, files})
        });
    })
}

module.exports = {
    uploadAvatar,
    uploadPoster,
    uploadPhoto
}
const Joi = require('joi')


const albumCreateRule = Joi.object({
    name: Joi.string().min(2).max(4).required().error(new Joi.ValidationError('名字格式不正确')),
    word: Joi.string().min(6).max(40).required().error(new Joi.ValidationError('word格式不正确')),
    isOpen: Joi.boolean().error(new Joi.ValidationError('isOpen格式不正确')),
    poster:  Joi.string().uri({ allowRelative: true}).error( new Joi.ValidationError('封面图格式不正确'))
})

const albumPhotoAddRule = Joi.object({
    id: Joi.string().length(24).required().error(new Joi.ValidationError("id不正确")),
    url: Joi.array().error(new Joi.ValidationError('图片地址不正确'))
})

const albumPhotoListRule = Joi.object({
    id: Joi.string().length(24).required().error(new Joi.ValidationError("id不正确")),
    limit: Joi.number().integer().greater(0).required().error(new Joi.ValidationError('limit格式不正确')),
    page: Joi.number().integer().greater(0).required().error(new Joi.ValidationError('page格式不正确'))
})

const albumUpdateRule = Joi.object({
    id: Joi.string().length(24).required().error(new Joi.ValidationError("id不正确")),
    name: Joi.string().min(2).max(4).error(new Joi.ValidationError('名字格式不正确')),
    word: Joi.string().min(6).max(40).error(new Joi.ValidationError('word格式不正确')),
    isOpen: Joi.boolean().error(new Joi.ValidationError('isOpen格式不正确')),
    poster:  Joi.string().uri({ allowRelative: true}).error( new Joi.ValidationError('封面图格式不正确'))
})






module.exports = {
    albumCreateRule,
    albumPhotoAddRule,
    albumPhotoListRule,
    albumUpdateRule
}

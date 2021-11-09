const Joi = require('joi')

const UserCreateRule =  Joi.object({
    username: Joi.string().min(2).required().messages({
        "string.base": `用户名必须是String`,
        "string.empty": `用户名不能为空`,
        "string.min": `用户名最小长度为4`,
        "any.required": `用户名为必填`,
    }),
    password: Joi.string().min(6).max(18).required().error( new Joi.ValidationError("密码格式不正确")),
    avatar: Joi.string().uri().error(new Joi.ValidationError("头像格式不正确")),
    nickname: Joi.string().min(2).max(8).error(new Joi.ValidationError("昵称格式不正确")),
    isAdmin: Joi.boolean().error(new Joi.ValidationError("isAdmin格式不正确"))
})


const UserUpdateRule = Joi.object({
    id: Joi.string().length(24).required().error(new Joi.ValidationError("id不正确")),
    username: Joi.string().min(2).messages({
        "string.base": `用户名必须是String`,
        "string.empty": `用户名不能为空`,
        "string.min": `用户名最小长度为4`,
        "any.required": `用户名为必填`,
    }),
    password: Joi.string().min(6).max(18).error( new Joi.ValidationError("密码格式不正确")),
    avatar: Joi.string().uri().error(new Joi.ValidationError("头像格式不正确")),
    nickname: Joi.string().min(2).max(8).error(new Joi.ValidationError("昵称格式不正确")),
    isAdmin: Joi.boolean().error(new Joi.ValidationError("isAdmin格式不正确"))
})

const UserListRule = Joi.object({
    limit: Joi.number().integer().greater(0).required().error(new Joi.ValidationError('limit格式不正确')),
    page: Joi.number().integer().greater(0).required().error(new Joi.ValidationError('page格式不正确')),
    keyword: Joi.string().allow('').error(new Joi.ValidationError('keyword格式不正确')),
})
module.exports = {
    UserCreateRule,
    UserUpdateRule,
    UserListRule
}
// 一些公用的joi Scheme
const Joi = require('joi')

const limitPageScheme = Joi.object({
    limit: Joi.number().integer().greater(0).required().error(new Joi.ValidationError('limit格式不正确')),
    page: Joi.number().integer().greater(0).required().error(new Joi.ValidationError('page格式不正确')),
    keyword: Joi.string().allow('').trim().error( new Joi.ValidationError('keyword格式不正确')),
})
const IdScheme = Joi.object({
    id: Joi.string().length(24).required().error(new Joi.ValidationError("id不正确")),
})
module.exports = {
    limitPageScheme,
    IdScheme
}
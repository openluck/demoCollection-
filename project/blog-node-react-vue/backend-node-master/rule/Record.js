const Joi = require('joi')


const RecordCreate = Joi.object({
    content: Joi.string().error( new Joi.ValidationError('title格式不正确')),
    tag:  Joi.array().items(Joi.string().length(24).required()).error(new Joi.ValidationError("tag格式不正确")),
})

const RecordUpdata = Joi.object({
    id: Joi.string().length(24).required().error(new Joi.ValidationError("id不正确")),
    content: Joi.string().error( new Joi.ValidationError('title格式不正确')),
    tag:  Joi.array().items(Joi.string().length(24).required()).error(new Joi.ValidationError("tag格式不正确")),
})

const RecordList = Joi.object({
    limit: Joi.number().integer().greater(0).required().error(new Joi.ValidationError('limit格式不正确')),
    page: Joi.number().integer().greater(0).required().error(new Joi.ValidationError('page格式不正确')),
    keyword: Joi.string().allow('').error( new Joi.ValidationError('keyword格式不正确')),
    tag: Joi.string().length(24).allow('').error(new Joi.ValidationError("tag格式不正确")),
    date:  Joi.array().items(Joi.date()).error(new Joi.ValidationError("date格式不正确")),
})


const RecordTagCreate = Joi.object({
    name: Joi.string().min(2).required().error( new Joi.ValidationError('name格式不正确')),
    color: Joi.string().required().error( new Joi.ValidationError('color格式不正确')),
})

const RecordTagUpdate = Joi.object({
    id: Joi.string().length(24).required().error(new Joi.ValidationError("id不正确")),
    name: Joi.string().min(2).error( new Joi.ValidationError('name格式不正确')),
    color: Joi.string().error( new Joi.ValidationError('color格式不正确')),
})


module.exports = {
    RecordTagCreate,
    RecordTagUpdate,
    RecordCreate,
    RecordUpdata,
    RecordList
}
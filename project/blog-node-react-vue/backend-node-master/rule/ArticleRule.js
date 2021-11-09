const Joi = require('joi')




// 创建文章分类时的验证
const articleClassifyCreateRule =  Joi.object({
    name: Joi.string().min(2).max(4).required().error(new Joi.ValidationError('名字格式不正确'))
})

// 修改分类时的验证

const articleClassifyUpdateRule =  Joi.object({
    id: Joi.string().length(24).required().error(new Joi.ValidationError("id格式不正确")),
    name: Joi.string().min(2).max(4).required().error(new Joi.ValidationError('名字格式不正确'))
})

// 删除分类时验证


const articleClassifyDeleteRule =  Joi.object({
    id: Joi.string().length(24).required().error(new Joi.ValidationError("id格式不正确")),
})


// 创建文章的验证

const articleCreateRule = Joi.object({
    title: Joi.string().min(6).max(100).required().messages({
        "string.base": `title必须是String`,
        "string.empty": `title名不能为空`,
        "string.min": `title最小长度为6`,
        "string.max": `title最大长度为100`,
        "any.required": `title为必填`,
    }),
    poster: Joi.string().uri({ allowRelative: true}).required().error(new Joi.ValidationError('封面图格式不正确')),
    content: Joi.string().required().messages({
        "string.base": `content必须是String`,
        "string.empty": `content名不能为空`,
        "any.required": `content为必填`,
    }),
    classify:  Joi.string().length(24).required().error(new Joi.ValidationError("classify不正确")),
})

// 更新文章的验证
const articleUpdateRule = Joi.object({
    id: Joi.string().length(24).required().error(new Joi.ValidationError("id不正确")),
    title: Joi.string().min(6).max(100).messages({
        "string.base": `title必须是String`,
        "string.empty": `title名不能为空`,
        "string.min": `title最小长度为6`,
        "string.max": `title最大长度为100`,
        "any.required": `title为必填`,
    }),
    poster: Joi.string().uri({ allowRelative: true}).error(new Joi.ValidationError('封面图格式不正确')),
    content: Joi.string().messages({
        "string.base": `content必须是String`,
        "string.empty": `content名不能为空`,
        "any.required": `content为必填`,
    }),
    classify:  Joi.string().length(24).error(new Joi.ValidationError("classify不正确")),
})

const articleListRule = Joi.object({
    limit: Joi.number().integer().greater(0).required().error(new Joi.ValidationError('limit格式不正确')),
    page: Joi.number().integer().greater(0).required().error(new Joi.ValidationError('page格式不正确')),
    classify: Joi.string().length(24).allow('').error(new Joi.ValidationError("classify格式不正确")),
    date:  Joi.array().items(Joi.date()).error(new Joi.ValidationError("date格式不正确")),
    keyword: Joi.string().allow('').error(new Joi.ValidationError("keyword格式格式不正确")),
})



module.exports = {
    articleClassifyCreateRule,
    articleClassifyUpdateRule,
    articleClassifyDeleteRule,
    articleCreateRule,
    articleListRule,
    articleUpdateRule
}
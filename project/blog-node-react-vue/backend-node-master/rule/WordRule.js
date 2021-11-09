const Joi = require('joi')

const WordCreateRule = Joi.object({
    content: Joi.string().empty().required().error(new Joi.ValidationError("content格式不正确"))
})

const WordChildCreateRule = Joi.object({
    id: Joi.string().length(24).required().error(new Joi.ValidationError("id不正确")),
    content: Joi.string().empty().required().error(new Joi.ValidationError("content格式不正确"))
})

const WordChildIdRule = Joi.object({
    id: Joi.string().length(24).required().error(new Joi.ValidationError("id不正确")),
    parentId: Joi.string().empty().required().error(new Joi.ValidationError("parentId格式不正确"))
})



module.exports = {
    WordCreateRule,
    WordChildCreateRule,
    WordChildIdRule
}
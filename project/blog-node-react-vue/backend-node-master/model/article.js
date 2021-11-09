// 引入mongoose数据库管理工具

const mongoose = require("mongoose")
const moment = require('moment')
const { Schema } = mongoose

const schema = new Schema({
    classify: {
        type: Schema.Types.ObjectId,
        ref: 'article_classify',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    poster: {
        type: String,
        required: true
    },
    fabulous: [Schema.Types.ObjectId],
    browse: {
        type: Number,
        default: 0
    },
    createTime: {
        type: Date,
        default: Date.now,
        get: v => moment(v).format('YYYY-MM-DD')
    },
    updateTime: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' },
    versionKey: false
})

schema.set('toJSON', { getters: true });
module.exports = mongoose.model('article', schema)


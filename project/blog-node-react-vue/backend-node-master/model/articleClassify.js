// 引入mongoose数据库管理工具

const mongoose = require("mongoose")
const { Schema } = mongoose



const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    createTime: {
        type: Date,
        default: Date.now
    },
    updateTime: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' },
    versionKey: false // 是够显示_v
})

module.exports = mongoose.model('article_classify', schema)
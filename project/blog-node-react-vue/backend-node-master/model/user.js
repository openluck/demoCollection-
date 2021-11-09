const mongoose = require('mongoose')
const moment = require("moment")
const { baseUrl } = require('../utils/constant')
//创建Schema对象（约束）
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    avatar: {
        type: String,
        default: '/images/avatar/avatar.jpg',
        set: (v) => {
            if(/^http/.test(v)) {
                return `/images${v.split('/images')[1]}`
            }
            return v
        },
        get: v => baseUrl + v
    },
    nickname: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    createTime: {
        type: Date,
        default: Date.now,
        get: v => moment(v).format('YYYY-MM-DD hh:mm:ss')
    },
    updateTime: {
        type: Date,
        default: Date.now,
        get: v => moment(v).format('YYYY-MM-DD hh:mm:ss')
    }
}, {
    timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' },
    versionKey: false
})

userSchema.set('toJSON', { getters: true });

//将stuSchema映射到一个MongoDB collection并定义这个文档的构成
module.exports = mongoose.model('user', userSchema)
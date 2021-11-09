// 引入mongoose数据库管理工具

const mongoose = require("mongoose")
const { Schema } = mongoose


const childrenSheme = new Schema({
    person: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    content: String,
    time: {
        type: Date,
        default: Date.now
    }
},  {
    timestamps: { createdAt: 'time' },
    versionKey: false
})



const scheme = new Schema({
    person: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    content: String,
    time: {
        type: Date,
        default: Date.now
    },
    support: {
        type: Number,
        default: 0
    },
    oppose: {
        type: Number,
        default: 0
    },
    children: [childrenSheme]
}, {
    timestamps: { createdAt: 'time' },
    versionKey: false
})


module.exports = mongoose.model('word', scheme)
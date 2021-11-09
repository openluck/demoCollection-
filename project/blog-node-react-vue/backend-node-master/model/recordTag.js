const mongoose = require("mongoose")
const { Schema } = mongoose
const moment = require("moment")

const schema = new Schema({
    name: {
        type: String,
        unique: true,
        require: true,
    },
    color: {
        type: String,
    },
    createTime: {
        type: Date,
        default: Date.now,
        get: v => moment(v).format('YYYY-MM-DD')
    },
},{
    timestamps: {},
    versionKey: false
})

schema.set('toJSON', { getters: true });
module.exports = mongoose.model('recordTag', schema)
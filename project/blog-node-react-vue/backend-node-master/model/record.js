const mongoose = require("mongoose")
const { Schema } = mongoose
const moment = require("moment")


const schema = new Schema({
    content: {
        type: String,
        require: true,
    },
    time: {
        type: Date,
        default: Date.now,
        get: v => moment(v).format('YYYY-MM-DD')
    },
    tag: [{type: Schema.Types.ObjectId, ref: 'recordTag'}],
},{
    timestamps: { createdAt: 'time'},
    versionKey: false
})

schema.set('toJSON', { getters: true });
module.exports = mongoose.model('record', schema)
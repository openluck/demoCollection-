const mongoose = require("mongoose")
const { Schema } = mongoose
const moment = require('moment')


const scheme = new Schema({
    name: {
        type: String,
        require: true,
    },
    word: {
        type: String,
        require: true,
    },
    poster: {
        type: String,
        default: '../upload/image.png'
    },
    isOpen: {
        type: Boolean,
        default: true,
    },
    time: {
        type: Date,
        default: Date.now,
        get: v => moment(v).format('YYYY-MM-DD')
    },
    photo: [{
        url: {
            type: String,
            default: '',
        },
    }]
},  {
    timestamps: { createdAt: 'time' },
    versionKey: false
})

scheme.set('toJSON', { getters: true });
module.exports = mongoose.model('album', scheme)
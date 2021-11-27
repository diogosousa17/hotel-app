let mongoose = require('mongoose')
let Schema = mongoose.Schema

let TokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600,
    },
})

let Token = mongoose.model('tokens', TokenSchema)

module.exports = Token